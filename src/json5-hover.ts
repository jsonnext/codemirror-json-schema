import { type EditorView } from "@codemirror/view";
import { type HoverOptions, JSONHover } from "./json-hover";
import { type JSONSchema7 } from "json-schema";

export type JSON5HoverOptions = Exclude<HoverOptions, "mode">;

/**
 * Instantiates a JSONHover instance with the JSON5 mode
 * @group Codemirror Extensions
 */
export function json5SchemaHover(
  schema: JSONSchema7,
  options?: JSON5HoverOptions
) {
  const hover = new JSONHover(schema, { ...options, mode: "json5" });
  return async function jsonDoHover(
    view: EditorView,
    pos: number,
    side: -1 | 1
  ) {
    return hover.doHover(view, pos, side);
  };
}
