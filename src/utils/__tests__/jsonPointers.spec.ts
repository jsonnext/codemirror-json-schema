import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";
import { json5 } from "codemirror-json5";

import { getJsonPointers, jsonPointerForPosition } from "../jsonPointers.js";
import { EditorState } from "@codemirror/state";

const getPointer = (jsonString: string, pos: number) => {
  const state = EditorState.create({
    doc: jsonString,
    extensions: [json()],
  });
  return jsonPointerForPosition(state, pos, 1);
};

const getJSON5Pointer = (jsonString: string, pos: number) => {
  const state = EditorState.create({ doc: jsonString, extensions: [json5()] });
  return jsonPointerForPosition(state, pos, 1);
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
  it("should return full pointer path for a position for a deep associative array", () => {
    expect(
      getPointer(
        '[{"object": [{ "foo": { "example": true } }], "bar": 123}]',
        27
      )
    ).toEqual("/0/object/0/foo/example");
  });
});

describe("jsonPointerForPosition for json5", () => {
  it("should return full pointer path for a position", () => {
    expect(
      getJSON5Pointer('{"object": { "foo": true }, "bar": 123}', 14)
    ).toEqual("/object/foo");
  });
  it("should return full pointer path for a position for associative array", () => {
    expect(
      getJSON5Pointer(`[{"object": [{ foo: true }], 'bar': 123}]`, 16)
    ).toEqual("/0/object/0/foo");
  });
  it("should return full pointer path for a position for a deep associative array", () => {
    expect(
      getJSON5Pointer(
        '[{"object": [{ "foo": { example: true } }], "bar": 123}]',
        25
      )
    ).toEqual("/0/object/0/foo/example");
  });
});

describe("getJsonPointers", () => {
  it("should return a map of all pointers for a document", () => {
    const state = EditorState.create({
      doc: '{"object": { "foo": true }, "bar": 123}',
      extensions: [json()],
    });
    const pointers = getJsonPointers(state);
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

describe("getJsonPointers for json5", () => {
  it("should return a map of all pointers for a json5 document", () => {
    const state = EditorState.create({
      doc: '{"object": { foo: true }, bar: 123}',
      extensions: [json5()],
    });

    const pointers = getJsonPointers(state, "json5");
    expect(pointers.get("/object/foo")).toEqual({
      keyFrom: 13,
      keyTo: 16,
      valueFrom: 18,
      valueTo: 22,
    });
    expect(pointers.get("/bar")).toEqual({
      keyFrom: 26,
      keyTo: 29,
      valueFrom: 31,
      valueTo: 34,
    });
  });
});
