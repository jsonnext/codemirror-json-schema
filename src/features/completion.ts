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
  getChildrenNodes,
  getChildValueNode,
  getClosestNode,
  getMatchingChildNode,
  getMatchingChildrenNodes,
  getNodeAtPosition,
  getWord,
  isPrimitiveValueNode,
  isPropertyNameNode,
  stripSurroundingQuotes,
  surroundingDoubleQuotesToSingle,
} from "../utils/node";
import { getJSONSchema } from "./state";
import type { JsonError, JsonSchema } from "json-schema-library";
import { Draft07, isJsonError } from "json-schema-library";
import {
  jsonPointerForPosition,
  resolveTokenName,
} from "../utils/json-pointers";
import { MODES, TOKENS } from "../constants";
import { JSONMode } from "../types";
import { renderMarkdown } from "../utils/markdown";
import { DocumentParser, getDefaultParser } from "../parsers";
import { replacePropertiesDeeply } from "../utils/recordUtil";
import { omit } from "radash";

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

function isRealSchema(
  subSchema: JsonSchema | JsonError | undefined,
): subSchema is JsonSchema {
  return !(
    !subSchema ||
    isJsonError(subSchema) ||
    subSchema.name === "UnknownPropertyError" ||
    subSchema.type === "undefined"
  );
}

export class JSONCompletion {
  private originalSchema: JSONSchema7 | null = null;
  /**
   * Inlined (expanded) top-level $ref if present.
   */
  private schema: JSONSchema7 | null = null;
  /**
   * Inlined (expanded) top-level $ref if present.
   * Does not contain any required properties and allows any additional properties everywhere.
   */
  private laxSchema: JSONSchema7 | null = null;
  private mode: JSONMode = MODES.JSON;
  private parser: DocumentParser;

  // private lastKnownValidData: object | null = null;

  constructor(private opts: JSONCompletionOptions) {
    this.mode = opts.mode ?? MODES.JSON;
    this.parser = this.opts?.jsonParser ?? getDefaultParser(this.mode);
  }

  public doComplete(ctx: CompletionContext) {
    const schemaFromState = getJSONSchema(ctx.state)!;
    if (this.originalSchema !== schemaFromState) {
      // only process schema when it changed (could be huge)
      this.schema =
        expandSchemaProperty(schemaFromState, schemaFromState) ??
        schemaFromState;
      this.laxSchema = makeSchemaLax(this.schema);
    }
    if (!this.schema || !this.laxSchema) {
      // todo: should we even do anything without schema
      // without taking over the existing mode responsibilties?
      return [];
    }

    // first attempt to complete with the original schema
    debug.log("xxx", "trying with original schema");
    const completionResultForOriginalSchema = this.doCompleteForSchema(
      ctx,
      this.schema,
    );
    if (completionResultForOriginalSchema.options.length !== 0) {
      return completionResultForOriginalSchema;
    }
    // if there are no completions, try with the lax schema (because json-schema-library would otherwise not provide schemas if invalid properties are present)
    debug.log(
      "xxx",
      "no completions with original schema, trying with lax schema",
    );
    return this.doCompleteForSchema(ctx, this.laxSchema);
  }

  private doCompleteForSchema(ctx: CompletionContext, rootSchema: JSONSchema7) {
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
        text,
      );
      result.from =
        node.name === TOKENS.INVALID ? (word?.from ?? ctx.pos) : overwriteStart;
      result.to = ctx.pos;
    }

    const collector = new CompletionCollector();

    let addValue = true;

    const closestPropertyNameNode = getClosestNode(
      node,
      TOKENS.PROPERTY_NAME,
      this.mode,
    );
    // if we are inside a property name node, we need to get the parent property name node
    // The only reason we would be inside a property name node is if the current node is invalid or a literal/primitive node
    if (closestPropertyNameNode) {
      debug.log(
        "xxx",
        "closestPropertyNameNode",
        closestPropertyNameNode,
        "node",
        node,
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
          node,
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
      getNodeAtPosition(ctx.state, ctx.pos),
    );

    // proposals for properties
    if (
      node &&
      [TOKENS.OBJECT, TOKENS.JSON_TEXT].includes(
        resolveTokenName(node.name, this.mode) as any,
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
        rootSchema,
        ctx,
        node,
        collector,
        addValue,
        rawWord,
      );
    } else {
      // proposals for values
      const types: { [type: string]: boolean } = {};

      // value proposals with schema
      const res = this.getValueCompletions(rootSchema, ctx, types, collector);
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
      stripSurroundingQuotes(v.label).startsWith(prefix),
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
      collector.reservedKeys,
    );
    return result;
  }

  private applySnippetCompletion(completion: Completion) {
    return snippetCompletion(
      typeof completion.apply !== "string"
        ? completion.label
        : completion.apply,
      completion,
    );
  }

  private getPropertyCompletions(
    rootSchema: JSONSchema7,
    ctx: CompletionContext,
    node: SyntaxNode,
    collector: CompletionCollector,
    addValue: boolean,
    rawWord: string,
  ) {
    // don't suggest properties that are already present
    const properties = getMatchingChildrenNodes(
      node,
      TOKENS.PROPERTY,
      this.mode,
    );
    debug.log("xxx", "getPropertyCompletions", node, ctx, properties);
    properties.forEach((p) => {
      const key = getWord(
        ctx.state.doc,
        getMatchingChildNode(p, TOKENS.PROPERTY_NAME, this.mode),
      );
      collector.reserve(stripSurroundingQuotes(key));
    });

    // TODO: Handle separatorAfter

    // Get matching schemas
    const schemas = this.getSchemas(rootSchema, ctx);
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
                rootSchema,
                value,
              ),
              type: "property",
              detail: typeStr,
              info: renderMarkdown(description),
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
                apply: this.getInsertTextForProperty(
                  label,
                  addValue,
                  rawWord,
                  rootSchema,
                ),
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
            apply: this.getInsertTextForProperty(
              label,
              addValue,
              rawWord,
              rootSchema,
            ),
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
    rootSchema: JSONSchema7,
    propertySchema?: JSONSchema7Definition,
  ) {
    // expand schema property if it is a reference
    propertySchema = propertySchema
      ? expandSchemaProperty(propertySchema, rootSchema)
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
              "",
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
              "",
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
        propertySchema,
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
    separatorAfter = "",
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
    rootSchema: JSONSchema7,
    ctx: CompletionContext,
    types: { [type: string]: boolean },
    collector: CompletionCollector,
  ) {
    let node: SyntaxNode | null = syntaxTree(ctx.state).resolveInner(
      ctx.pos,
      -1,
    );
    let valueNode: SyntaxNode | null = null;
    let parentKey: string | undefined = undefined;

    debug.log("xxx", "getValueCompletions", node, ctx);

    if (node && isPrimitiveValueNode(node, this.mode)) {
      valueNode = node;
      node = node.parent;
    }

    if (!node) {
      this.addSchemaValueCompletions(rootSchema, types, collector);
      return;
    }

    if (resolveTokenName(node.name, this.mode) === TOKENS.PROPERTY) {
      const keyNode = getMatchingChildNode(
        node,
        TOKENS.PROPERTY_NAME,
        this.mode,
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
      const schemas = this.getSchemas(rootSchema, ctx);
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
                this.mode,
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

        if (s.type == null || s.type !== "object") {
          this.addSchemaValueCompletions(s, types, collector);
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
                    collector,
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
    // TODO this is buggy because it does not resolve refs, should hand down rootSchema and expand each ref
    // rootSchema: JSONSchema7,
    types: { [type: string]: boolean },
    collector: CompletionCollector,
  ) {
    if (typeof schema === "object") {
      this.addEnumValueCompletions(schema, collector);
      this.addDefaultValueCompletions(schema, collector);
      this.collectTypes(schema, types);
      if (Array.isArray(schema.allOf)) {
        schema.allOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector),
        );
      }
      if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector),
        );
      }
      if (Array.isArray(schema.oneOf)) {
        schema.oneOf.forEach((s) =>
          this.addSchemaValueCompletions(s, types, collector),
        );
      }
    }
  }

  private addDefaultValueCompletions(
    schema: JSONSchema7,
    collector: CompletionCollector,
    arrayDepth = 0,
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
    collector: CompletionCollector,
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
    collector: CompletionCollector,
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
    types: { [type: string]: boolean },
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
    rootSchema: JSONSchema7,
    ctx: CompletionContext,
  ): JSONSchema7Definition[] {
    const { data: documentData } = this.parser(ctx.state);

    const draft = new Draft07(rootSchema);
    let pointer: string | undefined = jsonPointerForPosition(
      ctx.state,
      ctx.pos,
      -1,
      this.mode,
    );
    // TODO make jsonPointer consistent and compatible with json-schema-library by default (root path '/' or ' ' or undefined or '#', idk)
    if (pointer === "") pointer = undefined;

    if (pointer != null && pointer.endsWith("/")) {
      // opening new property under pointer
      // the property name is empty but json-schema-library would puke itself with a trailing slash, so we shouldn't even call it with that
      pointer = pointer.substring(0, pointer.length - 1);

      // when adding a new property, we just wanna return the possible properties if possible
      const effectiveSchemaOfPointer = getEffectiveObjectWithPropertiesSchema(
        rootSchema,
        documentData,
        pointer,
      );
      if (effectiveSchemaOfPointer != null) {
        return [effectiveSchemaOfPointer];
      }
    }

    let parentPointer: string | undefined =
      pointer != null ? pointer.replace(/\/[^/]*$/, "") : undefined;
    if (parentPointer === "") parentPointer = undefined;

    // Pass parsed data to getSchema to get the correct schema based on the data context (e.g. for anyOf or if-then)
    const effectiveSchemaOfParent = getEffectiveObjectWithPropertiesSchema(
      rootSchema,
      documentData,
      parentPointer,
    );
    const deepestPropertyKey = pointer?.split("/").pop();
    const pointerPointsToKnownProperty =
      deepestPropertyKey == null ||
      deepestPropertyKey in (effectiveSchemaOfParent?.properties ?? {});

    // TODO upgrade json-schema-library, so this actually returns undefined if data and schema are incompatible (currently it sometimes pukes itself with invalid data and imagines schemas on-the-fly)
    let subSchema = draft.getSchema({
      pointer,
      data: documentData ?? undefined,
    });
    if (
      !pointerPointsToKnownProperty &&
      subSchema?.type === "null" &&
      this.mode === "yaml"
    ) {
      // TODO describe YAML special-case where null is given the value and json-schema-library simply makes up a new schema based on that null value for whatever reason
      subSchema = undefined;
    }

    debug.log(
      "xxxx",
      "draft.getSchema",
      subSchema,
      "data",
      documentData,
      "pointer",
      pointer,
      "pointerPointsToKnownProperty",
      pointerPointsToKnownProperty,
    );
    if (isJsonError(subSchema)) {
      subSchema = subSchema.data?.schema;
    }

    // if we don't have a schema for the current pointer, try the parent pointer with data to get a list of possible properties
    if (!isRealSchema(subSchema)) {
      if (effectiveSchemaOfParent) {
        return [effectiveSchemaOfParent];
      }
    }

    // then try the parent pointer without data
    if (!isRealSchema(subSchema)) {
      subSchema = draft.getSchema({ pointer: parentPointer });
      // TODO should probably only change pointer if it actually found a schema there, but i left it as-is
      pointer = parentPointer;
    }

    debug.log("xxx", "pointer..", JSON.stringify(pointer));

    // For some reason, it returns undefined schema for the root pointer
    // We use the root schema in that case as the relevant (sub)schema
    if (!isRealSchema(subSchema) && (!pointer || pointer === "/")) {
      subSchema = expandSchemaProperty(rootSchema, rootSchema) ?? rootSchema;
    }
    // const subSchema = new Draft07(this.dirtyCtx.rootSchema).getSchema(pointer);
    debug.log("xxx", "subSchema..", subSchema);
    if (!subSchema) {
      return [];
    }

    if (Array.isArray(subSchema.allOf)) {
      return [
        subSchema,
        ...subSchema.allOf.map((s) => expandSchemaProperty(s, rootSchema)),
      ];
    }
    if (Array.isArray(subSchema.oneOf)) {
      return [
        subSchema,
        ...subSchema.oneOf.map((s) => expandSchemaProperty(s, rootSchema)),
      ];
    }
    if (Array.isArray(subSchema.anyOf)) {
      return [
        subSchema,
        ...subSchema.anyOf.map((s) => expandSchemaProperty(s, rootSchema)),
      ];
    }

    return [subSchema as JSONSchema7];
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

/**
 * removes required properties and allows additional properties everywhere
 * @param schema
 */
function makeSchemaLax(schema: any): any {
  return replacePropertiesDeeply(schema, (key, value) => {
    if (key === "additionalProperties" && value === false) {
      return [];
    }
    if (key === "required" && Array.isArray(value)) {
      return [];
    }
    if (key === "unevaluatedProperties" && value === false) {
      return [];
    }
    if (key === "unevaluatedItems" && value === false) {
      return [];
    }
    // TODO remove dependencies and other restrictions
    // if (key === 'dependencies' && typeof value === 'object') {
    //   return Object.keys(value).reduce((acc: any, depKey) => {
    //     const depValue = value[depKey];
    //     if (Array.isArray(depValue)) {
    //       return acc;
    //     }
    //     return { ...acc, [depKey]: depValue };
    //   }, {});
    // }
    return [key, value];
  });
}

/**
 * determines effective object schema for given data
 * TODO support patternProperties, etc.
 * @param schema
 * @param data
 * @param pointer
 */
function getEffectiveObjectWithPropertiesSchema(
  schema: JSONSchema7,
  data: unknown,
  pointer: string | undefined,
): JSONSchema7 | undefined {
  // TODO (unimportant): [performance] cache Draft07 in case it does some pre-processing? but does not seem to be significant
  const draft = new Draft07(schema);
  const subSchema = draft.getSchema({
    pointer,
    data: data ?? undefined,
  });
  if (!isRealSchema(subSchema)) {
    return undefined;
  }

  const possibleDirectPropertyNames = getAllPossibleDirectStaticPropertyNames(
    draft,
    subSchema as JSONSchema7,
  );
  const effectiveProperties: Exclude<JSONSchema7["properties"], undefined> = {};
  for (let possibleDirectPropertyName of possibleDirectPropertyNames) {
    let propertyPointer = extendJsonPointer(
      pointer,
      possibleDirectPropertyName,
    );
    const subSchemaForPropertyConsideringData = draft.getSchema({
      // TODO [performance] use subSchema and only check it's sub-properties
      pointer: propertyPointer,
      data: data ?? undefined,
      // pointer: `/${possibleDirectPropertyName}`,
      // schema: subSchema
    });
    if (isRealSchema(subSchemaForPropertyConsideringData)) {
      Object.assign(effectiveProperties, {
        [possibleDirectPropertyName]: subSchemaForPropertyConsideringData,
      });
    }
  }

  if (
    possibleDirectPropertyNames.length === 0 ||
    Object.keys(effectiveProperties).length === 0
  ) {
    // in case json-schema-library behaves too weirdly and returns nothing, just return no schema too to let other cases handle this edge-case
    return undefined;
  }

  // TODO also resolve patternProperties of allOf, anyOf, oneOf
  return {
    ...omit(subSchema, ["allOf", "anyOf", "oneOf"]),
    properties: effectiveProperties,
  };
}

/**
 * static means not from patternProperties
 * @param rootDraft
 * @param schema
 */
function getAllPossibleDirectStaticPropertyNames(
  rootDraft: Draft07,
  schema: JSONSchema7,
): string[] {
  schema = expandSchemaProperty(schema, rootDraft.rootSchema);
  if (typeof schema !== "object" || schema == null) {
    return [];
  }

  const possiblePropertyNames = [];

  function addFrom(subSchema: JSONSchema7) {
    const possiblePropertyNamesOfSubSchema =
      getAllPossibleDirectStaticPropertyNames(rootDraft, subSchema);
    possiblePropertyNames.push(...possiblePropertyNamesOfSubSchema);
  }

  if (typeof schema.properties === "object" && schema.properties != null) {
    possiblePropertyNames.push(...Object.keys(schema.properties));
  }
  if (typeof schema.then === "object" && schema.then != null) {
    addFrom(schema.then);
  }
  if (Array.isArray(schema.allOf)) {
    for (const subSchema of schema.allOf) {
      addFrom(subSchema as JSONSchema7);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    for (const subSchema of schema.anyOf) {
      addFrom(subSchema as JSONSchema7);
    }
  }
  if (Array.isArray(schema.oneOf)) {
    for (const subSchema of schema.oneOf) {
      addFrom(subSchema as JSONSchema7);
    }
  }
  return possiblePropertyNames;
}

function expandSchemaProperty<T extends JSONSchema7Definition>(
  propertySchema: T,
  rootSchema: JSONSchema7,
) {
  if (typeof propertySchema === "object" && propertySchema.$ref) {
    const refSchema = getReferenceSchema(rootSchema, propertySchema.$ref);
    if (typeof refSchema === "object") {
      const dereferenced = {
        ...propertySchema,
        ...refSchema,
      };
      Reflect.deleteProperty(dereferenced, "$ref");

      return dereferenced;
    }
  }
  return propertySchema;
}

function getReferenceSchema(schema: JSONSchema7, ref: string) {
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

function extendJsonPointer(pointer: string | undefined, key: string) {
  return pointer === undefined ? `/${key}` : `${pointer}/${key}`;
}
