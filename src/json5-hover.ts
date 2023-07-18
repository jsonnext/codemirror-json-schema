import { type EditorView } from "codemirror";
import { type HoverOptions, JSONHover } from "./json-hover";
import { type JSONSchema7 } from "json-schema";

/**
 * Instantiates a JSONHover instance with the JSON5 mode
 */
export function hoverJson5Schema(schema: JSONSchema7, options?: HoverOptions) {
  const hover = new JSONHover(schema, { mode: "json5", ...options });
  return async function jsonDoHover(
    view: EditorView,
    pos: number,
    side: -1 | 1
  ) {
    return hover.doHover(view, pos, side);
  };
}
