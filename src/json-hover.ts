import { type EditorView, Tooltip } from "@codemirror/view";
import { type Draft, Draft04, JsonSchema } from "json-schema-library";
import type { JSONSchema7 } from "json-schema";

import { JSONMode, jsonPointerForPosition } from "./utils/jsonPointers";
import { joinWithOr } from "./utils/formatting";
import getSchema from "./utils/schema-lib/getSchema";

export type CursorData = { schema?: JsonSchema; pointer: string };

export type FoundCursorData = Required<CursorData>;

export type HoverOptions = {
  mode?: JSONMode;
  formatHover?: (data: FoundCursorData) => HTMLElement;
  // todo: handle hover events
  // onHover?: () => void;
};

export function hoverJsonSchema(schema: JSONSchema7, options?: HoverOptions) {
  const hover = new JSONHover(schema, options);
  return async function jsonDoHover(
    view: EditorView,
    pos: number,
    side: -1 | 1
  ) {
    return hover.doHover(view, pos, side);
  };
}
export class JSONHover {
  private schema: Draft;
  public constructor(schema: JSONSchema7, private opts?: HoverOptions) {
    this.schema = new Draft04(schema);
  }
  public getDataForCursor(
    view: EditorView,
    pos: number,
    side: -1 | 1
  ): CursorData | null {
    const pointer = jsonPointerForPosition(
      view.state,
      pos,
      side,
      this.opts?.mode
    );

    if (!pointer) {
      return null;
    }
    const subSchema = getSchema(this.schema, pointer);
    // doesn't work for oneOf - we need to give it a shape to tell it what kind of schema type to return
    if (subSchema.type === "error") {
      return { pointer };
    }
    return { schema: subSchema, pointer };
  }
  private formatMessage(data: FoundCursorData): HTMLElement {
    const { schema } = data;
    const hoverWrapper = document.createElement("div");
    hoverWrapper.classList.add("cm6-json-schema-hover");
    const codeBlock = document.createElement("code");
    codeBlock.innerText = Array.isArray(schema.type)
      ? joinWithOr(schema.type)
      : schema.type;
    if (schema.description) {
      const descriptionBlock = document.createElement("div");
      const codeWrapper = document.createElement("div");
      descriptionBlock.innerText = schema.description;
      hoverWrapper.appendChild(descriptionBlock);
      codeWrapper.appendChild(codeBlock);
      hoverWrapper.appendChild(codeWrapper);
      return hoverWrapper;
    } else {
      hoverWrapper.appendChild(codeBlock);
    }

    return hoverWrapper;
  }

  // return hover state for the current json schema property
  public async doHover(
    view: EditorView,
    pos: number,
    side: 1 | -1
  ): Promise<Tooltip | null> {
    let start = pos,
      end = pos;
    try {
      const cursorData = this.getDataForCursor(view, pos, side);
      if (!cursorData?.schema) {
        return null;
      }
      // allow users to override the hover
      const formatter = this.opts?.formatHover ?? this.formatMessage;
      return {
        pos: start,
        end,
        above: true,
        arrow: true,
        create: (view) => {
          return {
            dom: formatter(cursorData as FoundCursorData),
          };
        },
      };
    } catch {
      return null;
    }
  }
}
