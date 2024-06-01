import { type EditorView, Tooltip } from "@codemirror/view";
import {
  type Draft,
  Draft04,
  JsonSchema,
  isJsonError,
} from "json-schema-library";

import { jsonPointerForPosition } from "../utils/json-pointers";
import { joinWithOr } from "../utils/formatting";
import { debug } from "../utils/debug";
import { JSONMode, Side } from "../types";
import { el } from "../utils/dom";
import { getJSONSchema } from "./state";
import { MODES } from "../constants";
import { renderMarkdown } from "../utils/markdown";
import { JSONSchema7Type } from "json-schema";

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

function formatType(data: { type?: JSONSchema7Type; $ref?: string }) {
  if (data.type) {
    if (data.$ref) {
      return `${data.$ref} (${data.type})`;
    }
    return data.type;
  }
  if (data.$ref) {
    return `${data.$ref}`;
  }
}

function formatComplexType(
  schema: JsonSchema,
  complexType: "oneOf" | "anyOf" | "allOf",
  draft: Draft
) {
  return `${complexType}: ${joinWithOr(
    schema[complexType].map((s: JsonSchema) => {
      try {
        const { data } = draft.resolveRef({ data: s, pointer: s.$ref });
        if (data) {
          return formatType(data);
        }
        return formatType(s);
      } catch (err) {
        return s.type;
      }
    })
  )}`;
}

export class JSONHover {
  private schema: Draft | null = null;
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
    side: Side
  ): CursorData | null {
    const schema = getJSONSchema(view.state)!;
    if (!schema) {
      // todo: should we even do anything without schema
      // without taking over the existing mode responsibilties?
      return null;
    }
    this.schema = new Draft04(schema);

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
    let subSchema = this.schema.getSchema({
      pointer,
      data,
      withSchemaWarning: true,
    });
    if (isJsonError(subSchema)) {
      if (subSchema?.data.schema["$ref"]) {
        subSchema = this.schema.resolveRef(subSchema);
      } else {
        subSchema = subSchema?.data.schema;
      }
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

  public getHoverTexts(data: FoundCursorData, draft: Draft): HoverTexts {
    let typeInfo = "";
    let message = null;

    const { schema } = data;

    if (schema.oneOf) {
      typeInfo = formatComplexType(schema, "oneOf", draft);
    }
    if (schema.anyOf) {
      typeInfo = formatComplexType(schema, "anyOf", draft);
    }
    if (schema.allOf) {
      typeInfo = formatComplexType(schema, "allOf", draft);
    }

    if (schema.type) {
      typeInfo = Array.isArray(schema.type)
        ? joinWithOr(schema.type)
        : schema.type;
    }
    if (schema.$ref) {
      typeInfo = ` Reference: ${schema.$ref}`;
    }
    if (schema.enum) {
      typeInfo = `\`enum\`: ${joinWithOr(schema.enum)}`;
    }
    if (schema.format) {
      typeInfo += `\`format\`: ${schema.format}`;
    }
    if (schema.pattern) {
      typeInfo += `\`pattern\`: ${schema.pattern}`;
    }

    if (schema.description) {
      message = schema.description;
    }
    return { message, typeInfo };
  }

  // return hover state for the current json schema property
  public async doHover(
    view: EditorView,
    pos: number,
    side: Side
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
        this.schema!
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
