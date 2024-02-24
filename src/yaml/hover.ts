import { type EditorView } from "@codemirror/view";
import { type HoverOptions, JSONHover } from "../features/hover";
import YAML from "yaml";
import { Side } from "../types";
import { MODES } from "../constants";

export type YAMLHoverOptions = Exclude<HoverOptions, "mode">;

/**
 * Instantiates a JSONHover instance with the YAML mode
 * @group Codemirror Extensions
 */
export function yamlSchemaHover(options?: YAMLHoverOptions) {
  const hover = new JSONHover({
    ...options,
    parser: YAML.parse,
    mode: MODES.YAML,
  });
  return async function jsonDoHover(view: EditorView, pos: number, side: Side) {
    return hover.doHover(view, pos, side);
  };
}
