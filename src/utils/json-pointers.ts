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
  mode: JSONMode
): string {
  const path: string[] = [];
  for (let n: SyntaxNode | null = node; n?.parent; n = n.parent) {
    switch (resolveTokenName(n.parent.name, mode)) {
      case TOKENS.PROPERTY: {
        const name = getMatchingChildNode(n.parent, TOKENS.PROPERTY_NAME, mode);
        if (name) {
          path.unshift(
            getWord(docText, name).replace(/[/~]/g, (v: string) =>
              v === "~" ? "~0" : "~1"
            )
          );
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
  path.unshift("");

  return path.join("/");
}

/**
 * retrieve a JSON pointer for a given position in the editor
 * @group Utilities
 */
export const jsonPointerForPosition = (
  state: EditorState,
  pos: number,
  side: Side = -1,
  mode: JSONMode
) => {
  return getJsonPointerAt(
    state.doc,
    syntaxTree(state).resolve(pos, side),
    mode
  );
};

/**
 * retrieve a Map of all the json pointers in a document
 * @group Utilities
 */
export const getJsonPointers = (
  state: EditorState,
  mode: JSONMode
): JSONPointersMap => {
  const tree = syntaxTree(state);
  const pointers: JSONPointersMap = new Map();
  tree.iterate({
    enter: (type: SyntaxNodeRef) => {
      const tokenName = resolveTokenName(type.name, mode) as any;

      if ([TOKENS.PROPERTY_NAME].includes(tokenName)) {
        const pointer = getJsonPointerAt(state.doc, type.node, mode);
        const { from: keyFrom, to: keyTo } = type.node;

        // TODO: Make this generic enough to avoid mode-specific checks
        const nextNode =
          mode === MODES.JSON
            ? type.node?.nextSibling?.node
            : type.node?.nextSibling?.node?.nextSibling?.node;
        if (!nextNode) {
          pointers.set(pointer, { keyFrom, keyTo });
          return true;
        }
        const { from: valueFrom, to: valueTo } = nextNode as SyntaxNode;
        pointers.set(pointer, { keyFrom, keyTo, valueFrom, valueTo });
        return true;
      } else if (
        [
          TOKENS.NULL,
          TOKENS.FALSE,
          TOKENS.TRUE,
          TOKENS.NUMBER,
          TOKENS.STRING,
          TOKENS.OBJECT,
        ].includes(tokenName)
      ) {
        const pointer = getJsonPointerAt(state.doc, type.node, mode);
        // if the pointer already exists, it's been created by the above, and therefore we can skip
        if (pointers.has(pointer)) {
          return true;
        }
        // otherwise, we're in a value node with no key (parent is an array or we're a root)
        const { from, to } = type.node;
        const data = {
          valueFrom: from,
          valueTo: to,
        };
        pointers.set(pointer, data);
        return true;
      }
    },
  });
  return pointers;
};
