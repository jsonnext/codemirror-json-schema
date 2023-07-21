import { syntaxTree } from "@codemirror/language";
import { EditorState, Text } from "@codemirror/state";
import { SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import { JSONPointersMap, Side } from "../types";
import { TOKENS } from "../constants";
import { findNodeIndexInArrayNode, getWord, isValueNode } from "./node";

export type JSONMode = "json4" | "json5";

// adapted from https://discuss.codemirror.net/t/json-pointer-at-cursor-seeking-implementation-critique/4793/3
// this could be useful for other things later!
export function getJsonPointerAt(docText: Text, node: SyntaxNode): string {
  const path: string[] = [];
  for (let n: SyntaxNode | null = node; n?.parent; n = n.parent) {
    switch (n.parent.name) {
      case TOKENS.PROPERTY: {
        const name = n.parent.getChild(TOKENS.PROPERTY_NAME);
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
        if (isValueNode(n)) {
          const index = findNodeIndexInArrayNode(n.parent, n);
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
  side: Side = -1
) => {
  return getJsonPointerAt(state.doc, syntaxTree(state).resolve(pos, side));
};

/**
 * retrieve a Map of all the json pointers in a document
 * @group Utilities
 */
export const getJsonPointers = (
  state: EditorState,
  mode: JSONMode = "json4"
): JSONPointersMap => {
  const json = syntaxTree(state);
  const pointers: JSONPointersMap = new Map();
  json.iterate({
    enter: (type: SyntaxNodeRef) => {
      if (type.name === "PropertyName") {
        const pointer = getJsonPointerAt(state.doc, type.node);

        const { from: keyFrom, to: keyTo } = type.node;
        // if there's no value, we can't get the valueFrom/to
        if (!type.node?.nextSibling?.node) {
          pointers.set(pointer, { keyFrom, keyTo });
          return true;
        }
        const nextNode =
          mode === "json4"
            ? type.node?.nextSibling?.node
            : type.node?.nextSibling?.node?.nextSibling?.node;
        if (!nextNode) {
          pointers.set(pointer, { keyFrom, keyTo });
          return true;
        }
        const { from: valueFrom, to: valueTo } = nextNode as SyntaxNode;
        pointers.set(pointer, { keyFrom, keyTo, valueFrom, valueTo });
        return true;
      }
    },
  });
  return pointers;
};
