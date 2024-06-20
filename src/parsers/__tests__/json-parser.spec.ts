import { it, describe, expect } from "vitest";
import { parseJSONDocument } from "../json-parser";
import { parseJSON5Document } from "../json5-parser";

describe("parseJSONDocument", () => {
  it("should return a map of all pointers for a json4 document", () => {
    const doc = parseJSONDocument(`{"object": { "foo": true }, "bar": 123}`);
    expect(doc.data).toEqual({ object: { foo: true }, bar: 123 });
    expect(Array.from(doc.pointers.keys())).toEqual([
      "",
      "/object",
      "/object/foo",
      "/bar",
    ]);
  });
});

describe("parseJSON5Document", () => {
  it("should return a map of all pointers for a json5 document", () => {
    const doc = parseJSON5Document(`{'obj"ect': { foo: true }, "bar": 123}`);
    expect(doc.data).toEqual({ ['obj"ect']: { foo: true }, bar: 123 });
    expect(Array.from(doc.pointers.keys())).toEqual([
      "",
      '/obj"ect',
      '/obj"ect/foo',
      "/bar",
    ]);
  });
});
