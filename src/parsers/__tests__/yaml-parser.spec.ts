import { it, describe, expect } from "vitest";

import { yaml } from "@codemirror/lang-yaml";
import { EditorState } from "@codemirror/state";
import { parseYAMLDocumentState } from "../yaml-parser";

const testDoc = `---
object:
  foo: true
bar: 123`;

describe("parseYAMLDocumentState", () => {
  it("should return a map of all pointers for a json4 document", () => {
    const state = EditorState.create({ doc: testDoc, extensions: [yaml()] });
    const doc = parseYAMLDocumentState(state);
    expect(doc.data).toEqual({ object: { foo: true }, bar: 123 });
    expect(Array.from(doc.pointers.keys())).toEqual([
      "",
      "/object",
      "/object/foo",
      "/bar",
    ]);
  });
});
