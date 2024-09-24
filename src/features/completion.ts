import {
  Completion,
  CompletionContext,
  CompletionResult,
  snippetCompletion,
} from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { debug } from "../utils/debug";
import {
  findNodeIndexInArrayNode,
  getChildValueNode,
  getWord,
  isPropertyNameNode,
  isPrimitiveValueNode,
  stripSurroundingQuotes,
  getNodeAtPosition,
  getClosestNode,
  getMatchingChildrenNodes,
  getMatchingChildNode,
  getChildrenNodes,
  surroundingDoubleQuotesToSingle,
} from "../utils/node";
import { getJSONSchema } from "./state";
import { Draft07, isJsonError } from "json-schema-library";
import {
  jsonPointerForPosition,
  resolveTokenName,
} from "../utils/json-pointers";
import { MODES, TOKENS } from "../constants";
import { JSONMode } from "../types";
import { el } from "../utils/dom";
import { renderMarkdown } from "../utils/markdown";
import { DocumentParser, getDefaultParser } from "../parsers";

class CompletionCollector {
  completions = new Map<string, Completion>();
  reservedKeys = new Set<string>();

  reserve(key: string) {
    this.reservedKeys.add(key);
  }

  add(completion: Completion) {
    if (this.reservedKeys.has(completion.label)) {
      return;
    }
    this.completions.set(completion.label, completion);
  }
}

export interface JSONCompletionOptions {
  mode?: JSONMode;
  jsonParser?: DocumentParser;
}

export class JSONCompletion {
  private schema: JSONSchema7 | null = null;
  private mode: JSONMode = MODES.JSON;
  private parser: DocumentParser;

  constructor(private opts: JSONCompletionOptions) {
    this.mode = opts.mode ?? MODES.JSON;
    this.parser = this.opts?.jsonParser ?? getDefaultParser(this.mode);
  }
  public doComplete(ctx: CompletionContext) {
    const s = getJSONSchema(ctx.state)!;
    this.schema = this.expandSchemaProperty(s, s) ?? s;
    if (!this.schema) {
      // todo: should we even do anything without schema
      // without taking over the existing mode responsibilties?
      return [];
    }

    const result: CompletionResult = {
      from: ctx.pos,
      to: ctx.pos,
      options: [],
      filter: false, // will be handled manually
    };

    const text = ctx.state.doc.sliceString(0);
    let node: SyntaxNode | null = getNodeAtPosition(ctx.state, ctx.pos);

    // position node word prefix (without quotes) for matching
    let prefix = ctx.state.sliceDoc(node.from, ctx.pos).replace(/^(["'])/, "");

    debug.log("xxx", "node", node, "prefix", prefix, "ctx", ctx);

    // Only show completions if we are filling out a word or right after the starting quote, or if explicitly requested
    if (
      !(
        isPrimitiveValueNode(node, this.mode) ||
        isPropertyNameNode(node, this.mode)
      ) &&
      !ctx.explicit
    ) {
      debug.log("xxx", "no completions for non-word/primitive", node);
      return result;
    }

    const currentWord = getWord(ctx.state.doc, node);
    const rawWord = getWord(ctx.state.doc, node, false);
    // Calculate overwrite range
    if (
      node &&
      (isPrimitiveValueNode(node, this.mode) ||
        isPropertyNameNode(node, this.mode))
    ) {
      result.from = node.from;
      result.to = node.to;
    } else {
      const word = ctx.matchBefore(/[A-Za-z0-9._]*/);
      const overwriteStart = ctx.pos - currentWord.length;
      debug.log(
        "xxx",
        "overwriteStart after",
        overwriteStart,
        "ctx.pos",
        ctx.pos,
        "word",
        word,
        "currentWord",
        currentWord,
        "=>",
        text[overwriteStart - 1],
        "..",
        text[overwriteStart],
        "..",
        text
      );
      result.from =
        node.name === TOKENS.INVALID ? word?.from ?? ctx.pos : overwriteStart;
      result.to = ctx.pos;
    }

    const collector = new CompletionCollector();

    let addValue = true;

    const closestPropertyNameNode = getClosestNode(
      node,
      TOKENS.PROPERTY_NAME,
      this.mode
    );
    // if we are inside a property name node, we need to get the parent property name node
    // The only reason we would be inside a property name node is if the current node is invalid or a literal/primitive node
    if (closestPropertyNameNode) {
      debug.log(
        "xxx",
        "closestPropertyNameNode",
        closestPropertyNameNode,
        "node",
        node
      );
      node = closestPropertyNameNode;
    }
    if (isPropertyNameNode(node, this.mode)) {
      debug.log("xxx", "isPropertyNameNode", node);
      const parent = node.parent;
      if (parent) {
        // get value node from parent
        const valueNode = getChildValueNode(parent, this.mode);
        addValue =
          !valueNode ||
          (valueNode.name === TOKENS.INVALID &&
            valueNode.from - valueNode.to === 0) ||
          // TODO: Verify this doesn't break anything else
          (valueNode.parent
            ? getChildrenNodes(valueNode.parent).length <= 1
            : false);
        debug.log(
          "xxx",
          "addValue",
          addValue,
          getChildValueNode(parent, this.mode),
          node
        );
        // find object node
        node = getClosestNode(parent, TOKENS.OBJECT, this.mode) ?? null;
      }
    }

    debug.log(
      "xxx",
      node,
      currentWord,
      ctx,
      "node at pos",
      getNodeAtPosition(ctx.state, ctx.pos)
    );

    // proposals for properties
    if (
      node &&
      [TOKENS.OBJECT, TOKENS.JSON_TEXT].includes(
        resolveTokenName(node.name, this.mode) as any
      ) &&
      (isPropertyNameNode(getNodeAtPosition(ctx.state, ctx.pos), this.mode) ||
        closestPropertyNameNode)
    ) {
      // don't suggest keys when the cursor is just before the opening curly brace
      if (node.from === ctx.pos) {
        debug.log("xxx", "no completions for just before opening brace");
        return result;
      }

      // property proposals with schema
      this.getPropertyCompletions(
        this.schema,
        ctx,
        node,
        collector,
        addValue,
        rawWord
      );
    } else {
      // proposals for values
      const types: { [type: string]: boolean } = {};

      // value proposals with schema
      const res = this.getValueCompletions(this.schema, ctx, types, collector);
      debug.log("xxx", "getValueCompletions res", res);
      if (res) {
        // TODO: While this works, we also need to handle the completion from and to positions to use it
        // // use the value node to calculate the prefix
        // prefix = res.valuePrefix;
        // debug.log("xxx", "using valueNode prefix", prefix);
      }
    }

    // handle filtering
    result.options = Array.from(collector.completions.values()).filter((v) =>
      stripSurroundingQuotes(v.label).startsWith(prefix)
    );

    debug.log(
      "xxx",
      "result",
      result,
      "prefix",
      prefix,
      "collector.completions",
      collector.completions,
      "reservedKeys",
      collector.reservedKeys
    );
    return result;
  }
  private applySnippetCompletion(completion: Completion) {
    return snippetCompletion(
      typeof completion.apply !== "string"
        ? completion.label
        : completion.apply,
      completion
    );
  }

  private getPropertyCompletions(
    schema: JSONSchema7,
    ctx: CompletionContext,
    node: SyntaxNode,
    collector: CompletionCollector,
    addValue: boolean,
    rawWord: string
  ) {
    // don't suggest properties that are already present
    const properties = getMatchingChildrenNodes(
      node,
      TOKENS.PROPERTY,
      this.mode
    );
    debug.log("xxx", "getPropertyCompletions", node, ctx, properties);
    properties.forEach((p) => {
      const key = getWord(
        ctx.state.doc,
        getMatchingChildNode(p, TOKENS.PROPERTY_NAME, this.mode)
      );
      collector.reserve(stripSurroundingQuotes(key));
    });

    // TODO: Handle separatorAfter

    // Get matching schemas
    const schemas = this.getSchemas(schema, ctx);
    debug.log("xxx", "propertyCompletion schemas", schemas);

    schemas.forEach((s) => {
      if (typeof s !== "object") {
        return;
      }

      const properties = s.properties;
      if (properties) {
        Object.entries(properties).forEach(([key, value]) => {
          if (typeof value === "object") {
            const description = value.description ?? "";
            const type = value.type ?? "";
            const typeStr = Array.isArray(type) ? type.toString() : type;
            const completion: Completion = {
              // label is the unquoted key which will be displayed.
              label: key,
              apply: this.getInsertTextForProperty(
                key,
                addValue,
                rawWord,
                value
              ),
              type: "property",
              detail: typeStr,
              info: () =>
                el("div", {
                  inner: renderMarkdown(description),
                }),
            };
            collector.add(this.applySnippetCompletion(completion));
          }
        });
      }
      const propertyNames = s.propertyNames;
      if (typeof propertyNames === "object") {
        if (propertyNames.enum) {
          propertyNames.enum.forEach((v) => {
            const label = v?.toString();
            if (label) {
              const completion: Completion = {
                label,
                apply: this.getInsertTextForProperty(label, addValue, rawWord),
                type: "property",
              };
              collector.add(this.applySnippetCompletion(completion));
            }
          });
        }

        if (propertyNames.const) {
          const label = propertyNames.const.toString();
          const completion: Completion = {
            label,
            apply: this.getInsertTextForProperty(label, addValue, rawWord),
            type: "property",
          };
          collector.add(this.applySnippetCompletion(completion));
        }
      }
    });
  }

  // apply is the quoted key which will be applied.
  // Normally the label needs to match the token
  // prefix i.e. if the token begins with `"to`, then the
  // label needs to have the quotes as well for it to match.
  // However we are manually filtering the results so we can
  // just use the unquoted key as the label, which is nicer
  // and gives us more control.
  // If no property value is present, then we add the colon as well.
  // Use snippetCompletion to handle insert value + position cursor e.g. "key": "#{}"
  // doc: https://codemirror.net/docs/ref/#autocomplete.snippetCompletion
  // idea: https://discuss.codemirror.net/t/autocomplete-cursor-position-in-apply-function/4088/3
  private getInsertTextForProperty(
    key: string,
    addValue: boolean,
    rawWord: string,
    propertySchema?: JSONSchema7Definition
  ) {
    // expand schema property if it is a reference
    propertySchema = propertySchema
      ? this.expandSchemaProperty(propertySchema, this.schema!)
      : propertySchema;

    let resultText = this.getInsertTextForPropertyName(key, rawWord);

    if (!addValue) {
      return resultText;
    }
    resultText += ": ";

    let value;
    let nValueProposals = 0;
    if (typeof propertySchema === "object") {
      if (typeof propertySchema.default !== "undefined") {
        if (!value) {
          value = this.getInsertTextForGuessedValue(propertySchema.default, "");
        }
        nValueProposals++;
      } else {
        if (propertySchema.enum) {
          if (!value && propertySchema.enum.length === 1) {
            value = this.getInsertTextForGuessedValue(
              propertySchema.enum[0],
              ""
            );
          }
          nValueProposals += propertySchema.enum.length;
        }
        if (typeof propertySchema.const !== "undefined") {
          if (!value) {
            value = this.getInsertTextForGuessedValue(propertySchema.const, "");
          }
          nValueProposals++;
        }
        if (
          Array.isArray(propertySchema.examples) &&
          propertySchema.examples.length
        ) {
          if (!value) {
            value = this.getInsertTextForGuessedValue(
              propertySchema.examples[0],
              ""
            );
          }
          nValueProposals += propertySchema.examples.length;
        }
        if (value === undefined && nValueProposals === 0) {
          let type = Array.isArray(propertySchema.type)
            ? propertySchema.type[0]
            : propertySchema.type;
          if (!type) {
            if (propertySchema.properties) {
              type = "object";
            } else if (propertySchema.items) {
              type = "array";
            }
          }
          switch (type) {
            case "boolean":
              value = "#{}";
              break;
            case "string":
              value = this.getInsertTextForString("");
              break;
            case "object":
              switch (this.mode) {
                case MODES.JSON5:
                  value = "{#{}}";
                  break;
                case MODES.YAML:
                  value = "#{}";
                  break;
                default:
                  value = "{#{}}";
                  break;
              }
              break;
            case "array":
              value = "[#{}]";
              break;
            case "number":
            case "integer":
              value = "#{0}";
              break;
            case "null":
              value = "#{null}";
              break;
            default:
              // always advance the cursor after completing a property
              value = "#{}";
              break;
          }
        }
      }
    }
    if (!value || nValueProposals > 1) {
      debug.log(
        "xxx",
        "value",
        value,
        "nValueProposals",
        nValueProposals,
        propertySchema
      );
      value = "#{}";
    }

    return resultText + value;
  }
  private getInsertTextForPropertyName(key: string, rawWord: string) {
    switch (this.mode) {
      case MODES.JSON5:
      case MODES.YAML: {
        if (rawWord.startsWith('"')) {
          return `"${key}"`;
        }
        if (rawWord.startsWith("'")) {
          return `'${key}'`;
        }
        return key;
      }
      default:
        return `"${key}"`;
    }
  }
  private getInsertTextForString(value: string, prf = "#") {
    switch (this.mode) {
      case MODES.JSON5:
        return `'${prf}{${value}}'`;
      case MODES.YAML:
        return `${prf}{${value}}`;
      default:
        return `"${prf}{${value}}"`;
    }
  }

  // TODO: Is this actually working?
  private getInsertTextForGuessedValue(
    value: any,
    separatorAfter = ""
  ): string {
    switch (typeof value) {
      case "object":
        if (value === null) {
          return "${null}" + separatorAfter;
        }
        return this.getInsertTextForValue(value, separatorAfter);
      case "string": {
        let snippetValue = JSON.stringify(value);
        snippetValue = snippetValue.substr(1, snippetValue.length - 2); // remove quotes
        snippetValue = this.getInsertTextForPlainText(snippetValue); // escape \ and }
        return this.getInsertTextForString(snippetValue, "$") + separatorAfter;
      }
      case "number":
      case "boolean":
        return "${" + JSON.stringify(value) + "}" + separatorAfter;
    }
    return this.getInsertTextForValue(value, separatorAfter);
  }
  private getInsertTextForPlainText(text: string): string {
    return text.replace(/[\\$}]/g, "\\$&"); // escape $, \ and }
  }

  private getInsertTextForValue(value: any, separatorAfter: string): string {
    const text = JSON.stringify(value, null, "\t");
    if (text === "{}") {
      return "{#{}}" + separatorAfter;
    } else if (text === "[]") {
      return "[#{}]" + separatorAfter;
    }
    return this.getInsertTextForPlainText(text + separatorAfter);
  }

  private getValueCompletions(
    schema: JSONSchema7,
    ctx: CompletionContext,
    types: { [type: string]: boolean },
    collector: CompletionCollector
  ) {
    let node: SyntaxNode | null = syntaxTree(ctx.state).resolveInner(
      ctx.pos,
      -1
    );
    let valueNode: SyntaxNode | null = null;
    let parentKey: string | undefined = undefined;

    debug.log("xxx", "getValueCompletions", node, ctx);

    if (node && isPrimitiveValueNode(node, this.mode)) {
      valueNode = node;
      node = node.parent;
    }

    if (!node) {
      this.addSchemaValueCompletions(schema, types, collector);
      return;
    }

    if (resolveTokenName(node.name, this.mode) === TOKENS.PROPERTY) {
      const keyNode = getMatchingChildNode(
        node,
        TOKENS.PROPERTY_NAME,
        this.mode
      );
      if (keyNode) {
        parentKey = getWord(ctx.state.doc, keyNode);
        node = node.parent;
      }
    }

    debug.log("xxx", "node", node, "parentKey", parentKey);
    if (
      node &&
      (parentKey !== undefined ||
        resolveTokenName(node.name, this.mode) === TOKENS.ARRAY)
    ) {
      // Get matching schemas
      const schemas = this.getSchemas(schema, ctx);
      for (const s of schemas) {
        if (typeof s !== "object") {
          return;
        }

        if (
          resolveTokenName(node.name, this.mode) === TOKENS.ARRAY &&
          s.items
        ) {
          let c = collector;
          if (s.uniqueItems) {
            c = {
              ...c,
              add(completion) {
                if (!c.completions.has(completion.label)) {
                  collector.add(completion);
                }
              },
              reserve(key) {
                collector.reserve(key);
              },
            };
          }
          if (Array.isArray(s.items)) {
            let arrayIndex = 0;
            if (valueNode) {
              // get index of next node in array
              const foundIdx = findNodeIndexInArrayNode(
                node,
                valueNode,
                this.mode
              );

              if (foundIdx >= 0) {
                arrayIndex = foundIdx;
              }
            }
            const itemSchema = s.items[arrayIndex];
            if (itemSchema) {
              this.addSchemaValueCompletions(itemSchema, types, c);
            }
          } else {
            this.addSchemaValueCompletions(s.items, types, c);
          }
        }

        if (parentKey !== undefined) {
          let propertyMatched = false;
          if (s.properties) {
            const propertySchema = s.properties[parentKey];
            if (propertySchema) {
              propertyMatched = true;
              this.addSchemaValueCompletions(propertySchema, types, collector);
            }
          }
          if (s.patternProperties && !propertyMatched) {
            for (const pattern of Object.keys(s.patternProperties)) {
              const regex = this.extendedRegExp(pattern);
              if (regex?.test(parentKey)) {
                propertyMatched = true;
                const propertySchema = s.patternProperties[pattern];
                if (propertySchema) {
                  this.addSchemaValueCompletions(
                    propertySchema,
                    types,
                    collector
                  );
                }
              }
            }
          }
          if (s.additionalProperties && !propertyMatched) {
            const propertySchema = s.additionalProperties;
            this.addSchemaValueCompletions(propertySchema, types, collector);
          }
        }
        if (types["boolean"]) {
          this.addBooleanValueCompletion(true, collector);
          this.addBooleanValueCompletion(false, collector);
        }
        if (types["null"]) {
          this.addNullValueCompletion(collector);
        }
      }
    }

    // TODO: We need to pass the from and to for the value node as well
    // TODO: What should be the from and to when the value node is null?
    // TODO: (NOTE: if we pass a prefix but no from and to, it will autocomplete the value but replace
    // TODO: the entire property nodewhich isn't what we want). Instead we need to change the from and to
    // TODO: based on the corresponding (relevant) value node
    const valuePrefix = valueNode
      ? getWord(ctx.state.doc, valueNode, true, false)
      : "";

    return {
      valuePrefix,
    };
  }

  private addSchemaValueCompletions(
    schema: JSONSchema7Definition,
    types: { [type: string]: boolean },
    collector: CompletionCollector
  ) {
    if (typeof schema === "object") {
      this.addEnumValueCompletions(schema, collector);
      this.addDefaultValueCompletions(schema, collector);
      this.collectTypes(schema, types);
      if (Array.isArray(schema.allOf)) {
        schema.allOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector)
        );
      }
      if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector)
        );
      }
      if (Array.isArray(schema.oneOf)) {
        schema.oneOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector)
        );
      }
    }
  }
  private addDefaultValueCompletions(
    schema: JSONSchema7,
    collector: CompletionCollector,
    arrayDepth = 0
  ): void {
    let hasProposals = false;
    if (typeof schema.default !== "undefined") {
      let type = schema.type;
      let value = schema.default;
      for (let i = arrayDepth; i > 0; i--) {
        value = [value];
        type = "array";
      }
      const completionItem: Completion = {
        type: type?.toString(),
        ...this.getAppliedValue(value),
        detail: "Default value",
      };
      collector.add(completionItem);
      hasProposals = true;
    }
    if (Array.isArray(schema.examples)) {
      schema.examples.forEach((example) => {
        let type = schema.type;
        let value = example;
        for (let i = arrayDepth; i > 0; i--) {
          value = [value];
          type = "array";
        }
        collector.add({
          type: type?.toString(),
          ...this.getAppliedValue(value),
        });
        hasProposals = true;
      });
    }
    if (
      !hasProposals &&
      typeof schema.items === "object" &&
      !Array.isArray(schema.items) &&
      arrayDepth < 5 /* beware of recursion */
    ) {
      this.addDefaultValueCompletions(schema.items, collector, arrayDepth + 1);
    }
  }

  private addEnumValueCompletions(
    schema: JSONSchema7,
    collector: CompletionCollector
  ): void {
    if (typeof schema.const !== "undefined") {
      collector.add({
        type: schema.type?.toString(),
        ...this.getAppliedValue(schema.const),

        info: schema.description,
      });
    }

    if (Array.isArray(schema.enum)) {
      for (let i = 0, length = schema.enum.length; i < length; i++) {
        const enm = schema.enum[i];
        collector.add({
          type: schema.type?.toString(),
          ...this.getAppliedValue(enm),
          info: schema.description,
        });
      }
    }
  }

  private addBooleanValueCompletion(
    value: boolean,
    collector: CompletionCollector
  ): void {
    collector.add({
      type: "boolean",
      label: value ? "true" : "false",
    });
  }

  private addNullValueCompletion(collector: CompletionCollector): void {
    collector.add({
      type: "null",
      label: "null",
    });
  }

  private collectTypes(
    schema: JSONSchema7,
    types: { [type: string]: boolean }
  ) {
    if (Array.isArray(schema.enum) || typeof schema.const !== "undefined") {
      return;
    }
    const type = schema.type;
    if (Array.isArray(type)) {
      type.forEach((t) => (types[t] = true));
    } else if (type) {
      types[type] = true;
    }
  }

  private getSchemas(
    schema: JSONSchema7,
    ctx: CompletionContext
  ): JSONSchema7Definition[] {
    const draft = new Draft07(this.schema!);
    let pointer = jsonPointerForPosition(ctx.state, ctx.pos, -1, this.mode);
    // Pass parsed data to getSchema to get the correct schema based on the data context
    const { data } = this.parser(ctx.state);
    let subSchema = draft.getSchema({
      pointer,
      data: data ?? undefined,
    });
    debug.log(
      "xxxx",
      "draft.getSchema",
      subSchema,
      "data",
      data,
      "pointer",
      pointer
    );
    if (isJsonError(subSchema)) {
      subSchema = subSchema.data?.schema;
    }
    // if we don't have a schema for the current pointer, try the parent pointer
    if (
      !subSchema ||
      subSchema.name === "UnknownPropertyError" ||
      subSchema.enum ||
      subSchema.type === "undefined" ||
      subSchema.type === "null"
    ) {
      pointer = pointer.replace(/\/[^/]*$/, "/");
      subSchema = draft.getSchema({ pointer });
    }

    debug.log("xxx", "pointer..", JSON.stringify(pointer));

    // For some reason, it returns undefined schema for the root pointer
    // We use the root schema in that case as the relevant (sub)schema
    if (!pointer || pointer === "/") {
      subSchema = this.expandSchemaProperty(schema, schema) ?? schema;
    }
    // const subSchema = new Draft07(this.schema).getSchema(pointer);
    debug.log("xxx", "subSchema..", subSchema);
    if (!subSchema) {
      return [];
    }

    if (Array.isArray(subSchema.allOf)) {
      return [
        subSchema,
        ...subSchema.allOf.map((s) => this.expandSchemaProperty(s, schema)),
      ];
    }
    if (Array.isArray(subSchema.oneOf)) {
      return [
        subSchema,
        ...subSchema.oneOf.map((s) => this.expandSchemaProperty(s, schema)),
      ];
    }
    if (Array.isArray(subSchema.anyOf)) {
      return [
        subSchema,
        ...subSchema.anyOf.map((s) => this.expandSchemaProperty(s, schema)),
      ];
    }

    return [subSchema as JSONSchema7];
  }

  private expandSchemaProperty<T extends JSONSchema7Definition>(
    property: T,
    schema: JSONSchema7
  ) {
    if (typeof property === "object" && property.$ref) {
      const refSchema = this.getReferenceSchema(schema, property.$ref);
      if (typeof refSchema === "object") {
        const dereferenced = {
          ...property,
          ...refSchema,
        };
        Reflect.deleteProperty(dereferenced, "$ref");

        return dereferenced;
      }
    }
    return property;
  }

  private getReferenceSchema(schema: JSONSchema7, ref: string) {
    const refPath = ref.split("/");
    let curReference: Record<string, any> | undefined = schema;
    refPath.forEach((cur) => {
      if (!cur) {
        return;
      }
      if (cur === "#") {
        curReference = schema;
        return;
      }
      if (typeof curReference === "object") {
        curReference = curReference[cur];
      }
    });

    return curReference;
  }

  private getAppliedValue(value: any): { label: string; apply: string } {
    const stripped = stripSurroundingQuotes(JSON.stringify(value));
    switch (this.mode) {
      case MODES.JSON5:
        return {
          label: stripped,
          apply: surroundingDoubleQuotesToSingle(JSON.stringify(value)),
        };
      case MODES.YAML:
        return {
          label: stripped,
          apply: stripped,
        };
      default:
        return {
          label: stripped,
          apply: JSON.stringify(value),
        };
    }
  }

  private getValueFromLabel(value: any): string {
    return JSON.parse(value);
  }

  private extendedRegExp(pattern: string): RegExp | undefined {
    let flags = "";
    if (pattern.startsWith("(?i)")) {
      pattern = pattern.substring(4);
      flags = "i";
    }
    try {
      return new RegExp(pattern, flags + "u");
    } catch (e) {
      // could be an exception due to the 'u ' flag
      try {
        return new RegExp(pattern, flags);
      } catch (e) {
        // invalid pattern
        return undefined;
      }
    }
  }
}
/**
 * provides a JSON schema enabled autocomplete extension for codemirror
 * @group Codemirror Extensions
 */
export function jsonCompletion(opts: JSONCompletionOptions = {}) {
  const completion = new JSONCompletion(opts);
  return function jsonDoCompletion(ctx: CompletionContext) {
    return completion.doComplete(ctx);
  };
}
