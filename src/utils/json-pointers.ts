import { syntaxTree } from "@codemirror/language";
import { EditorState, Text } from "@codemirror/state";
import { SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import { JSONMode, JSONPointersMap, Side } from "../types";
import {
  JSON5_TOKENS_MAPPING,
  MODES,
  TOKENS,
  YAML_TOKENS_MAPPING,
} from "../constants";
import {
  findNodeIndexInArrayNode,
  getMatchingChildNode,
  getWord,
  isValueNode,
} from "./node";

export const resolveTokenName = (nodeName: string, mode: JSONMode) => {
  switch (mode) {
    case MODES.YAML:
      return YAML_TOKENS_MAPPING[nodeName] ?? nodeName;
    case MODES.JSON5:
      return JSON5_TOKENS_MAPPING[nodeName] ?? nodeName;
    default:
      return nodeName;
  }
};

// adapted from https://discuss.codemirror.net/t/json-pointer-at-cursor-seeking-implementation-critique/4793/3
// this could be useful for other things later!
export function getJsonPointerAt(
  docText: Text,
  node: SyntaxNode,
  mode: JSONMode,
): string {
  const path: string[] = [];
  for (let n: SyntaxNode | null = node; n?.parent; n = n.parent) {
    switch (resolveTokenName(n.parent.name, mode)) {
      case TOKENS.PROPERTY: {
        const name = getMatchingChildNode(n.parent, TOKENS.PROPERTY_NAME, mode);
        if (name) {
          let word = getWord(docText, name).replace(/[/~]/g, (v: string) =>
            v === "~" ? "~0" : "~1",
          );
          // TODO generally filter out pointers to objects being started?
          // if (word !== '') {
          path.unshift(word);
          // }
        }
        break;
      }
      case TOKENS.ARRAY: {
        if (isValueNode(n, mode)) {
          const index = findNodeIndexInArrayNode(n.parent, n, mode);
          path.unshift(`${index}`);
        }
        break;
      }
    }
  }
  if (path.length === 0) {
    // TODO json-schema-library does not seem to like / as root pointer (it probably just uses split and it will return two empty strings). So is this fine? And why is it not prefixed with #?
    return "";
  }
  return "/" + path.join("/");
}

/**
 * retrieve a JSON pointer for a given position in the editor
 * @group Utilities
 */
export const jsonPointerForPosition = (
  state: EditorState,
  pos: number,
  side: Side = -1,
  mode: JSONMode,
) => {
  return getJsonPointerAt(
    state.doc,
    syntaxTree(state).resolve(pos, side),
    mode,
  );
};

/**
 * retrieve a Map of all the json pointers in a document
 * @group Utilities
 */
export const getJsonPointers = (
  state: EditorState,
  mode: JSONMode,
): JSONPointersMap => {
  const tree = syntaxTree(state);
  const pointers: JSONPointersMap = new Map();
  tree.iterate({
    enter: (type: SyntaxNodeRef) => {
      const node = type.node;
      const tokenName = resolveTokenName(node.name, mode);
      if (tokenName === TOKENS.PROPERTY_NAME) {
        const pointer = getJsonPointerAt(state.doc, type.node, mode);

        const { from: keyFrom, to: keyTo } = node;
        // Grammar versions differ in whether punctuation is a named node.
        // Find the value instead of assuming a fixed number of siblings.
        let value = node.nextSibling;
        while (
          value &&
          (!isValueNode(value, mode) || value.from === value.to)
        ) {
          value = value.nextSibling;
        }
        pointers.set(
          pointer,
          value
            ? { keyFrom, keyTo, valueFrom: value.from, valueTo: value.to }
            : { keyFrom, keyTo },
        );
        // YAML keys contain scalar nodes; those are not property values.
        return false;
      }
      if (isValueNode(node, mode) && tokenName !== TOKENS.ITEM) {
        const pointer = getJsonPointerAt(state.doc, node, mode);
        // Preserve property key/value ranges when visiting their value nodes.
        // Root values and array items have no property key of their own.
        if (!pointers.has(pointer)) {
          pointers.set(pointer, { valueFrom: node.from, valueTo: node.to });
        }
      }
    },
  });
  return pointers;
};
