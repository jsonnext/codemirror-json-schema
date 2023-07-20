import { type EditorView, Tooltip } from "@codemirror/view";
import { type Draft, Draft04, JsonSchema } from "json-schema-library";
import type { JSONSchema7 } from "json-schema";

import { JSONMode, jsonPointerForPosition } from "./utils/jsonPointers";
import { joinWithOr } from "./utils/formatting";
import getSchema from "./utils/schema-lib/getSchema";
import { debug } from "./utils/debug";
import { Side } from "./types";
import { el } from "./utils/dom";

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
export function jsonSchemaHover(schema: JSONSchema7, options?: HoverOptions) {
  const hover = new JSONHover(schema, options);
  return async function jsonDoHover(view: EditorView, pos: number, side: Side) {
    return hover.doHover(view, pos, side);
  };
}

function formatComplexType(
  schema: JsonSchema,
  type: "oneOf" | "anyOf" | "allOf",
  draft: Draft
) {
  return `${type}: ${joinWithOr(
    schema[type].map((s: JsonSchema) => {
      return s.type ?? draft.resolveRef(s).type;
    })
  )}`;
}

export class JSONHover {
  private schema: Draft;
  public constructor(schema: JSONSchema7, private opts?: HoverOptions) {
    this.schema = new Draft04(schema);
    this.opts = {
      parser: JSON.parse,
      ...this.opts,
    };
  }
  public getDataForCursor(
    view: EditorView,
    pos: number,
    side: Side
  ): CursorData | null {
    const pointer = jsonPointerForPosition(
      view.state,
      pos,
      side,
      this.opts?.mode
    );

    let data = undefined;
    // TODO: use the AST tree to return the right hand, data so that we don't have to parse the doc
    try {
      data = this.opts!.parser!(view.state.doc.toString());
    } catch {}

    if (!pointer) {
      return null;
    }
    // if the data is valid, we can infer a type for complex types
    let subSchema = getSchema(this.schema, pointer, data);
    if (subSchema.type === "error" && data !== undefined) {
      // if the data is invalid, we won't get the type - try again without the data
      subSchema = getSchema(this.schema, pointer, undefined);
      if (subSchema.type === "error") {
        return { pointer };
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
          text: message,
        }),
        el("div", { class: "cm6-json-schema-hover--code-wrapper" }, [
          el("code", { class: "cm6-json-schema-hover--code", text: typeInfo }),
        ]),
      ]);
    }
    return el("div", { class: "cm6-json-schema-hover" }, [
      el("div", { class: "cm6-json-schema-hover--code-wrapper" }, [
        el("code", { class: "cm6-json-schema-hover--code", text: typeInfo }),
      ]),
    ]);
  }

  public getHoverTexts(data: FoundCursorData, draft: Draft): HoverTexts {
    let typeInfo = null;
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

      const getHoverTexts = this.opts?.getHoverTexts ?? this.getHoverTexts;
      const hoverTexts = getHoverTexts(
        cursorData as FoundCursorData,
        this.schema
      );
      // allow users to override the hover
      const formatter = this.opts?.formatHover ?? this.formatMessage;
      const formattedDom = formatter(hoverTexts);
      return {
        pos: start,
        end,
        arrow: true,
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
