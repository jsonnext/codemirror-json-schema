import { syntaxTree } from "@codemirror/language";
import { EditorState, Text } from "@codemirror/state";
import { SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import { JSONPointersMap, Side } from "../types";

const VAL_NODE_NAME = /^(?:Null|True|False|Object|Array|String|Number)$/;

export type JSONMode = "json4" | "json5";

// borrowed from `codemirror-json5`
// TODO: determine from spec if {"prop'name": example} is valid in json5
// JSON5 parse doesn't support parsing individual strings like JSON.parse does

function json5PropNameParser(s: string) {
  if (s.length < 2) return s;
  let first = s[0];
  let last = s[s.length - 1];
  if ((first === `'` && last === `'`) || (first === `"` && last === `"`)) {
    s = s.slice(1, -1);
  }
  return s;
}

const propNameParsers: Record<JSONMode, typeof JSON.parse> = {
  json4: JSON.parse,
  json5: json5PropNameParser,
};

/**
 * get a JSON4/5 pointer for a given node in the editor
 *
 * adapted from https://discuss.codemirror.net/t/json-pointer-at-cursor-seeking-implementation-critique/4793/3
 * this could be useful for other things later!
 * @group Utilities
 * @internal
 */
export function getJsonPointerAt(
  docText: Text,
  node: SyntaxNode,
  mode: JSONMode = "json4"
): string {
  const path: string[] = [];
  // retrieve a simple parser for parsing the property name
  const parse = propNameParsers[mode];
  for (let n: SyntaxNode | null = node; n && n.parent; n = n.parent) {
    switch (n.parent.name) {
      case "Property": {
        const name = n.parent.getChild("PropertyName");
        if (name) {
          path.unshift(
            parse(docText.sliceString(name.from, name.to)).replace(
              /[\/~]/g,
              (v: string) => (v === "~" ? "~0" : "~1")
            )
          );
        }
        break;
      }
      case "Array": {
        if (VAL_NODE_NAME.test(n.name)) {
          let index = 0;
          for (let s = n.prevSibling; s; s = s.prevSibling) {
            if (VAL_NODE_NAME.test(s.name)) {
              index++;
            }
          }
          path.unshift("" + index);
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
  side: Side,
  mode: JSONMode = "json4"
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
  mode: JSONMode = "json4"
): JSONPointersMap => {
  const json = syntaxTree(state);
  const pointers: JSONPointersMap = new Map();
  json.iterate({
    enter: (type: SyntaxNodeRef) => {
      if (type.name === "PropertyName") {
        const pointer = getJsonPointerAt(state.doc, type.node, mode);

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
