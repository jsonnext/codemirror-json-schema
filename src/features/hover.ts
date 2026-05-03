import { type EditorView, Tooltip } from "@codemirror/view";
import {
  JsonSchema,
  SchemaNode,
  compileSchema,
  draft04,
  isJsonError,
} from "json-schema-library";

import { MODES } from "../constants";
import { JSONMode, Side } from "../types";
import { debug } from "../utils/debug";
import { el } from "../utils/dom";
import { joinWithOr } from "../utils/formatting";
import { jsonPointerForPosition } from "../utils/json-pointers";
import { renderMarkdown } from "../utils/markdown";
import { getJSONSchema } from "./state";

export type CursorData = { schema?: JsonSchema; pointer: string };

export type FoundCursorData = Required<CursorData>;

export type HoverTexts = { message: string; typeInfo: string };

export type HoverOptions = {
  mode?: JSONMode;
  /**
   * Generate the text to display in the hover tooltip
   */
  getHoverTexts?: (data: FoundCursorData) => HoverTexts;
  /**
   * Generate the hover tooltip HTML
   */
  formatHover?: (data: HoverTexts) => HTMLElement;
  /**
   * Provide a custom parser for the document
   * @default JSON.parse
   */
  parser?: (text: string) => any;
};

/**
 * provides a JSON schema enabled tooltip extension for codemirror
 * @group Codemirror Extensions
 */
export function jsonSchemaHover(options?: HoverOptions) {
  const hover = new JSONHover(options);
  return async function jsonDoHover(view: EditorView, pos: number, side: Side) {
    return hover.doHover(view, pos, side);
  };
}

function isSchemaNodeLike(value: unknown): value is SchemaNode {
  return Boolean(
    value &&
    typeof value === "object" &&
    "schema" in (value as Record<string, unknown>),
  );
}

function normalizeSchema(
  value: JsonSchema | SchemaNode | undefined,
): JsonSchema | undefined {
  if (!value) {
    return undefined;
  }
  if (isSchemaNodeLike(value)) {
    return value.schema as JsonSchema;
  }
  return value;
}

function flattenHoverSchemas(
  schema: JsonSchema | undefined,
  rootSchema: JsonSchema,
): JsonSchema[] {
  if (!schema) {
    return [];
  }
  const expanded = expandHoverSchema(schema, rootSchema);
  const candidates = [expanded];
  const compositeKeys = ["allOf", "anyOf", "oneOf"] as const;
  for (const key of compositeKeys) {
    const value = expanded[key];
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (typeof entry === "object" && entry != null) {
          candidates.push(expandHoverSchema(entry as JsonSchema, rootSchema));
        }
      }
    }
  }
  return candidates;
}

function expandHoverSchema(
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema {
  if (schema.$ref) {
    const resolved = getHoverReferenceSchema(rootSchema, schema.$ref);
    if (resolved && typeof resolved === "object") {
      return { ...resolved, $ref: schema.$ref } as JsonSchema;
    }
  }
  return schema;
}

function getHoverReferenceSchema(schema: JsonSchema, ref: string) {
  const refPath = ref.split("/");
  let current: Record<string, unknown> | undefined = schema as Record<
    string,
    unknown
  >;
  for (const part of refPath) {
    if (!part) {
      continue;
    }
    if (part === "#") {
      current = schema as Record<string, unknown>;
      continue;
    }
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = current[part] as Record<string, unknown> | undefined;
  }
  return current;
}

function getHoverSchemaAtPointer(
  rootSchema: JsonSchema,
  pointer: string,
): JsonSchema | undefined {
  const segments = pointer.split("/").filter(Boolean);
  let currentSchemas = flattenHoverSchemas(rootSchema, rootSchema);

  for (const segment of segments) {
    const nextSchemas: JsonSchema[] = [];
    const isArrayIndex = /^\d+$/.test(segment);

    for (const candidate of currentSchemas) {
      for (const schema of flattenHoverSchemas(candidate, rootSchema)) {
        if (isArrayIndex) {
          const itemSchema = schema.items;
          if (Array.isArray(itemSchema)) {
            const indexed = itemSchema[Number(segment)];
            if (indexed && typeof indexed === "object") {
              nextSchemas.push(
                ...flattenHoverSchemas(indexed as JsonSchema, rootSchema),
              );
            }
          } else if (itemSchema && typeof itemSchema === "object") {
            nextSchemas.push(
              ...flattenHoverSchemas(itemSchema as JsonSchema, rootSchema),
            );
          }
          continue;
        }

        const propertySchema = schema.properties?.[segment];
        if (propertySchema && typeof propertySchema === "object") {
          nextSchemas.push(
            ...flattenHoverSchemas(propertySchema as JsonSchema, rootSchema),
          );
        }
      }
    }

    currentSchemas = nextSchemas;
    if (currentSchemas.length === 0) {
      return undefined;
    }
  }

  const meaningfulSchemas = currentSchemas.filter((candidate) =>
    Boolean(
      candidate.$ref ||
      candidate.type ||
      candidate.properties ||
      candidate.items ||
      candidate.enum ||
      candidate.const ||
      candidate.description ||
      candidate.oneOf ||
      candidate.anyOf ||
      candidate.allOf,
    ),
  );

  if (meaningfulSchemas.length === 1) {
    return meaningfulSchemas[0];
  }

  const description =
    currentSchemas.find((candidate) => candidate.description)?.description ??
    meaningfulSchemas.find((candidate) => candidate.description)?.description;
  const refs = meaningfulSchemas
    .map((candidate) => candidate.$ref)
    .filter((ref): ref is string => typeof ref === "string");
  if (refs.length > 0) {
    return {
      description,
      oneOf: refs.map((ref) => ({ $ref: ref })),
    } as JsonSchema;
  }

  if (
    description &&
    meaningfulSchemas.every((candidate) => !candidate.description)
  ) {
    meaningfulSchemas[0] = {
      ...meaningfulSchemas[0],
      description,
    };
  }

  return {
    description,
    oneOf: meaningfulSchemas,
  } as JsonSchema;
}

function formatType(data?: JsonSchema | SchemaNode) {
  const schema = normalizeSchema(data);
  if (!schema) {
    return undefined;
  }
  if (schema.type) {
    if (schema.$ref) {
      return `${schema.$ref} (${schema.type})`;
    }
    return schema.type;
  }
  if (schema.$ref) {
    return `${schema.$ref}`;
  }
  return undefined;
}

function formatComplexType(
  schema: JsonSchema | SchemaNode | undefined,
  complexType: "oneOf" | "anyOf" | "allOf",
  _draft: SchemaNode,
) {
  const normalizedSchema = normalizeSchema(schema);
  if (!normalizedSchema || !Array.isArray(normalizedSchema[complexType])) {
    return "";
  }
  return `${complexType}: ${joinWithOr(
    (normalizedSchema[complexType] as Array<JsonSchema | SchemaNode>)
      .map((s) => {
        const normalizedEntry = normalizeSchema(s);
        if (!normalizedEntry) {
          return "";
        }
        if (normalizedEntry.$ref) {
          return normalizedEntry.$ref;
        }
        try {
          return formatType(normalizedEntry) ?? "";
        } catch (err) {
          return normalizedEntry.type ?? "";
        }
      })
      .filter(Boolean),
  )}`;
}

export class JSONHover {
  private schema: SchemaNode | null = null;
  private mode: JSONMode = MODES.JSON;
  public constructor(private opts?: HoverOptions) {
    this.opts = {
      parser: JSON.parse,
      ...this.opts,
    };
    this.mode = this.opts?.mode ?? MODES.JSON;
  }
  public getDataForCursor(
    view: EditorView,
    pos: number,
    side: Side,
  ): CursorData | null {
    const schema = getJSONSchema(view.state)!;
    if (!schema) {
      // todo: should we even do anything without schema
      // without taking over the existing mode responsibilties?
      return null;
    }
    this.schema = compileSchema(schema, { drafts: [draft04] }) as SchemaNode;

    const pointer = jsonPointerForPosition(view.state, pos, side, this.mode);

    let data = undefined;
    // TODO: use the AST tree to return the right hand, data so that we don't have to parse the doc
    try {
      data = this.opts!.parser!(view.state.doc.toString());
    } catch {}

    if (!pointer) {
      return null;
    }
    // if the data is valid, we can infer a type for complex types
    let subSchema = this.schema.getNode(pointer, data ?? undefined, {
      withSchemaWarning: false,
    }).node?.schema;
    if (!subSchema) {
      subSchema = getHoverSchemaAtPointer(schema, pointer);
    }
    if (isJsonError(subSchema)) {
      if (subSchema?.data.schema["$ref"]) {
        subSchema = this.schema.resolveRef?.({
          pointer: subSchema?.data.schema["$ref"],
        })?.schema;
      } else {
        subSchema = subSchema?.data.schema;
      }
    }

    const fallbackSchema = getHoverSchemaAtPointer(schema, pointer);
    if (!subSchema) {
      subSchema = fallbackSchema;
    } else if (
      fallbackSchema &&
      typeof subSchema === "object" &&
      !isJsonError(subSchema)
    ) {
      subSchema = {
        ...fallbackSchema,
        ...subSchema,
        description:
          (subSchema as JsonSchema).description ?? fallbackSchema.description,
        oneOf: (subSchema as JsonSchema).oneOf ?? fallbackSchema.oneOf,
        anyOf: (subSchema as JsonSchema).anyOf ?? fallbackSchema.anyOf,
        allOf: (subSchema as JsonSchema).allOf ?? fallbackSchema.allOf,
      } as JsonSchema;
    }

    return { schema: subSchema, pointer };
  }

  private formatMessage(texts: HoverTexts): HTMLElement {
    const { message, typeInfo } = texts;
    if (message) {
      return el("div", { class: "cm6-json-schema-hover" }, [
        el("div", {
          class: "cm6-json-schema-hover--description",
          inner: renderMarkdown(message, false),
        }),
        el("div", { class: "cm6-json-schema-hover--code-wrapper" }, [
          el("div", {
            class: "cm6-json-schema-hover--code",
            inner: renderMarkdown(typeInfo, false),
          }),
        ]),
      ]);
    }
    return el("div", { class: "cm6-json-schema-hover" }, [
      el("div", { class: "cm6-json-schema-hover--code-wrapper" }, [
        el("code", {
          class: "cm6-json-schema-hover--code",
          inner: renderMarkdown(typeInfo, false),
        }),
      ]),
    ]);
  }

  public getHoverTexts(data: FoundCursorData, draft: SchemaNode): HoverTexts {
    let typeInfo = "";
    let message = null;

    const schema = normalizeSchema(data.schema);
    if (schema?.description) {
      message = schema.description;
    }

    if (schema?.oneOf) {
      typeInfo = formatComplexType(schema, "oneOf", draft);
    }
    if (schema?.anyOf) {
      typeInfo = formatComplexType(schema, "anyOf", draft);
    }
    if (schema?.allOf) {
      typeInfo = formatComplexType(schema, "allOf", draft);
    }

    if (schema?.type) {
      typeInfo = Array.isArray(schema.type)
        ? joinWithOr(schema.type)
        : schema.type;
    } else if (schema?.$ref) {
      typeInfo = ` Reference: ${schema.$ref}`;
    }
    if (schema?.enum) {
      typeInfo = `\`enum\`: ${joinWithOr(schema.enum)}`;
    }
    if (schema?.format) {
      typeInfo += `\`format\`: ${schema.format}`;
    }
    if (schema?.pattern) {
      typeInfo += `\`pattern\`: ${schema.pattern}`;
    }

    if (schema?.description) {
      message = schema.description;
    }
    return { message, typeInfo };
  }

  // return hover state for the current json schema property
  public async doHover(
    view: EditorView,
    pos: number,
    side: Side,
  ): Promise<Tooltip | null> {
    const start = pos,
      end = pos;
    try {
      const cursorData = this.getDataForCursor(view, pos, side);
      debug.log("cursorData", cursorData);
      // if we don't have a (sub)schema, we can't show anything
      if (!cursorData?.schema) return null;

      const getHoverTexts = this.opts?.getHoverTexts ?? this.getHoverTexts;
      const hoverTexts = getHoverTexts(
        cursorData as FoundCursorData,
        this.schema!,
      );
      // allow users to override the hover
      const formatter = this.opts?.formatHover ?? this.formatMessage;
      const formattedDom = formatter(hoverTexts);
      return {
        pos: start,
        end,
        arrow: true,
        // to mimic similar modes for other editors
        // otherwise, it gets into a z-index battle with completion/etc
        above: true,
        create: (view) => {
          return {
            dom: formattedDom,
          };
        },
      };
    } catch (err) {
      debug.log(err);
      return null;
    }
  }
}
