import { syntaxTree } from "@codemirror/language";
import { Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { SyntaxNode, SyntaxNodeRef } from "@lezer/common";

const VAL_NODE_NAME = /^(?:Null|True|False|Object|Array|String|Number)$/;

// from https://discuss.codemirror.net/t/json-pointer-at-cursor-seeking-implementation-critique/4793/3
// this could be useful for other things later!
export function getJsonPointerAt(docText: Text, node: SyntaxNode): string {
  const path: string[] = [];
  for (let n: SyntaxNode | null = node; n && n.parent; n = n.parent) {
    switch (n.parent.name) {
      case "Property": {
        const name = n.parent.getChild("PropertyName");
        if (name) {
          path.unshift(
            JSON.parse(docText.sliceString(name.from, name.to)).replace(
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

export const jsonPointerForPosition = (
  view: EditorView,
  pos: number,
  side: -1 | 1
) => {
  return getJsonPointerAt(
    view.state.doc,
    syntaxTree(view.state).resolve(pos, side)
  );
};

// retrieve a Map of all the json pointers in a document
export const getJsonPointers = (view: EditorView) => {
  const json = syntaxTree(view.state);
  const pointers = new Map<
    string,
    { keyFrom: number; keyTo: number; valueFrom: number; valueTo: number }
  >();
  json.iterate({
    // @ts-expect-error
    enter: (type: SyntaxNodeRef) => {
      if (type.name === "PropertyName") {
        const pointer = getJsonPointerAt(view.state.doc, type.node);

        const { from: keyFrom, to: keyTo } = type.node;
        if (!type.node?.nextSibling) {
          return { keyFrom, keyTo };
        }
        const { from: valueFrom, to: valueTo } = type.node?.nextSibling?.node;
        pointers.set(pointer, { keyFrom, keyTo, valueFrom, valueTo });
      }
    },
  });
  return pointers;
};

export function parseJSONDocument(view: EditorView) {
  let data = null;
  try {
    data = JSON.parse(view.state.doc.toString());
  } catch {}
  const pointers = getJsonPointers(view);
  return { data, pointers };
}
