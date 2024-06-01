/**
 * Mimics the behavior of `json-source-map`'s `parseJSONDocument` function using codemirror EditorState... for YAML
 */

import { yaml } from "@codemirror/lang-yaml";
import YAML from "yaml";
import { EditorState } from "@codemirror/state";
import { getJsonPointers } from "./json-pointers";
import { MODES } from "../constants";

/**
 * Return parsed data and YAML pointers for a given codemirror EditorState
 * @group Utilities
 */
export function parseYAMLDocumentState(state: EditorState) {
  let data = null;
  try {
    data = YAML.parse(state.doc.toString());
    // return pointers regardless of whether YAML.parse succeeds
  } catch {}
  const pointers = getJsonPointers(state, MODES.YAML);
  return { data, pointers };
}
