import { JSONMode, JSONPointersMap } from "../types";
import { MODES } from "../constants";
import { EditorState } from "@codemirror/state";
import { parseJSONDocumentState } from "./json-parser";
import { parseJSON5DocumentState } from "./json5-parser";
import { parseYAMLDocumentState } from "./yaml-parser";

export const getDefaultParser = (mode: JSONMode): DocumentParser => {
  switch (mode) {
    case MODES.JSON:
      return parseJSONDocumentState;
    case MODES.JSON5:
      return parseJSON5DocumentState;
    case MODES.YAML:
      return parseYAMLDocumentState;
  }
};

export type DocumentParser = (
  state: EditorState,
  bestEffort?: boolean
) => {
  data: unknown;
  pointers: JSONPointersMap;
};
