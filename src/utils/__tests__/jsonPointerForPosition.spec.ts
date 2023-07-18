import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";

import {
  getJsonPointers,
  jsonPointerForPosition,
} from "../jsonPointerForPosition";
import { EditorView } from "@codemirror/view";

const getPointer = (jsonString: string, pos: number) => {
  const view = new EditorView({ doc: jsonString, extensions: [json()] });
  return jsonPointerForPosition(view, pos, 1);
};

describe("jsonPointerForPosition", () => {
  it("should return full pointer path for a position", () => {
    expect(getPointer('{"object": { "foo": true }, "bar": 123}', 14)).toEqual(
      "/object/foo"
    );
  });
  it("should return full pointer path for a position for associative array", () => {
    expect(
      getPointer('[{"object": [{ "foo": true }], "bar": 123}]', 16)
    ).toEqual("/0/object/0/foo");
  });
});

describe("getJsonPointers", () => {
  it("should return a map of all pointers for a document", () => {
    const view = new EditorView({
      doc: '{"object": { "foo": true }, "bar": 123}',
      extensions: [json()],
    });
    const pointers = getJsonPointers(view);
    expect(pointers.get("/object/foo")).toEqual({
      keyFrom: 13,
      keyTo: 18,
      valueFrom: 20,
      valueTo: 24,
    });
    expect(pointers.get("/bar")).toEqual({
      keyFrom: 28,
      keyTo: 33,
      valueFrom: 35,
      valueTo: 38,
    });
  });
});
