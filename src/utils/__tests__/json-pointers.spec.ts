import { describe, it, expect } from "vitest";

import { getJsonPointers, jsonPointerForPosition } from "../json-pointers";
import { EditorState } from "@codemirror/state";
import { MODES } from "../../constants";
import { getExtensions } from "../../features/__tests__/__helpers__/index";

describe("jsonPointerForPosition", () => {
  it.each([
    {
      name: "simple",
      doc: '{"object": { "foo": true }, "bar": 123}',
      pos: 14,
      expected: "/object/foo",
      mode: MODES.JSON,
    },
    {
      name: "associative array",
      doc: '[{"object": [{ "foo": true }], "bar": 123}]',
      pos: 16,
      expected: "/0/object/0/foo",
      mode: MODES.JSON,
    },
    {
      name: "deep associative array",
      doc: '[{"object": [{ "foo": { "example": true } }], "bar": 123}]',
      pos: 27,
      expected: "/0/object/0/foo/example",
      mode: MODES.JSON,
    },
    {
      name: "simple - json5",
      doc: '{"object": { "foo": true }, "bar": 123}',
      pos: 14,
      expected: "/object/foo",
      mode: MODES.JSON5,
    },
    {
      name: "associative array - json5",
      doc: '[{"object": [{ "foo": true }], "bar": 123}]',
      pos: 16,
      expected: "/0/object/0/foo",
      mode: MODES.JSON5,
    },
    {
      name: "deep associative array - json5",
      doc: '[{"object": [{ "foo": { example: true } }], "bar": 123}]',
      pos: 25,
      expected: "/0/object/0/foo/example",
      mode: MODES.JSON5,
    },
    // ...
    {
      name: "simple - yaml",
      doc: `---
object:
  foo: true
bar: 123
`,
      pos: 14,
      expected: "/object/foo",
      mode: MODES.YAML,
    },
    {
      name: "associative array - yaml",
      doc: `---
- object:
    - foo: true
  bar: 123
`,
      pos: 20,
      expected: "/0/object/0/foo",
      mode: MODES.YAML,
    },
    {
      name: "deep associative array - yaml",
      doc: `---
- object:
    - foo:
        example: true
  bar: 123
`,
      pos: 34,
      expected: "/0/object/0/foo/example",
      mode: MODES.YAML,
    },
  ])(
    "should return full pointer path for a position for $name, mode: $mode",
    ({ doc, mode, pos, expected }) => {
      const state = EditorState.create({
        doc,
        extensions: [getExtensions(mode)],
      });
      const pointer = jsonPointerForPosition(state, pos, 1, mode);
      expect(pointer).toEqual(expected);
    },
  );
});

describe("getJsonPointers", () => {
  it.each(Object.values(MODES))(
    "escapes property names and preserves ranges for nested arrays (%s)",
    (mode) => {
      const doc = '{"a/b~c": [[0, "invalid"]]}';
      const state = EditorState.create({
        doc,
        extensions: [getExtensions(mode)],
      });
      const pointers = getJsonPointers(state, mode);
      expect(pointers.get("/a~1b~0c/0/1")).toEqual({
        valueFrom: doc.indexOf('"invalid"'),
        valueTo: doc.indexOf('"invalid"') + '"invalid"'.length,
      });
      expect(pointers.get("/a~1b~0c/0")).toEqual({
        valueFrom: doc.indexOf('[0, "invalid"]'),
        valueTo: doc.indexOf('[0, "invalid"]') + '[0, "invalid"]'.length,
      });
    },
  );

  it.each([
    { mode: MODES.JSON, doc: '{"value":' },
    { mode: MODES.JSON5, doc: "{value:" },
    { mode: MODES.YAML, doc: "value:" },
  ])(
    "keeps key-only ranges for unfinished properties (%s)",
    ({ mode, doc }) => {
      const state = EditorState.create({
        doc,
        extensions: [getExtensions(mode)],
      });
      const pointers = getJsonPointers(state, mode);
      const key = mode === MODES.JSON ? '"value"' : "value";
      expect(pointers.get("/value")).toEqual({
        keyFrom: doc.indexOf(key),
        keyTo: doc.indexOf(key) + key.length,
      });
    },
  );

  it.each([
    {
      doc: '{"object": { "foo": true }, "bar": 123, "baz": [1,2,3], "boop": [{"foo": true}]}',
      mode: MODES.JSON,
      expected: {
        "": {
          valueFrom: 0,
          valueTo: 80,
        },
        "/bar": {
          keyFrom: 28,
          keyTo: 33,
          valueFrom: 35,
          valueTo: 38,
        },
        "/baz": {
          keyFrom: 40,
          keyTo: 45,
          valueFrom: 47,
          valueTo: 54,
        },
        "/baz/0": { valueFrom: 48, valueTo: 49 },
        "/baz/1": { valueFrom: 50, valueTo: 51 },
        "/baz/2": { valueFrom: 52, valueTo: 53 },
        "/boop": {
          keyFrom: 56,
          keyTo: 62,
          valueFrom: 64,
          valueTo: 79,
        },
        "/boop/0": {
          valueFrom: 65,
          valueTo: 78,
        },
        "/boop/0/foo": {
          keyFrom: 66,
          keyTo: 71,
          valueFrom: 73,
          valueTo: 77,
        },
        "/object": {
          keyFrom: 1,
          keyTo: 9,
          valueFrom: 11,
          valueTo: 26,
        },
        "/object/foo": {
          keyFrom: 13,
          keyTo: 18,
          valueFrom: 20,
          valueTo: 24,
        },
      },
    },
    {
      doc: `{"object": { foo: true }, bar: 123, 'baz': [1,2,3], boop: [{foo: true}]}`,
      mode: MODES.JSON5,
      expected: {
        "": {
          valueFrom: 0,
          valueTo: 72,
        },
        "/bar": {
          keyFrom: 26,
          keyTo: 29,
          valueFrom: 31,
          valueTo: 34,
        },
        "/baz": {
          keyFrom: 36,
          keyTo: 41,
          valueFrom: 43,
          valueTo: 50,
        },
        "/baz/0": { valueFrom: 44, valueTo: 45 },
        "/baz/1": { valueFrom: 46, valueTo: 47 },
        "/baz/2": { valueFrom: 48, valueTo: 49 },
        "/boop": {
          keyFrom: 52,
          keyTo: 56,
          valueFrom: 58,
          valueTo: 71,
        },
        "/boop/0": {
          valueFrom: 59,
          valueTo: 70,
        },
        "/boop/0/foo": {
          keyFrom: 60,
          keyTo: 63,
          valueFrom: 65,
          valueTo: 69,
        },
        "/object": {
          keyFrom: 1,
          keyTo: 9,
          valueFrom: 11,
          valueTo: 24,
        },
        "/object/foo": {
          keyFrom: 13,
          keyTo: 16,
          valueFrom: 18,
          valueTo: 22,
        },
      },
    },
    {
      doc: `---
object:
  foo: true
bar: 123
baz:
  - 1
  - 2
  - 3
boop:
  - foo: true
`,
      mode: MODES.YAML,
      expected: {
        "": {
          valueFrom: 0,
          valueTo: 75,
        },
        "/bar": {
          keyFrom: 24,
          keyTo: 27,
          valueFrom: 29,
          valueTo: 32,
        },
        "/baz": {
          keyFrom: 33,
          keyTo: 36,
          valueFrom: 40,
          valueTo: 55,
        },
        "/baz/0": { valueFrom: 42, valueTo: 43 },
        "/baz/1": { valueFrom: 48, valueTo: 49 },
        "/baz/2": { valueFrom: 54, valueTo: 55 },
        "/boop": {
          keyFrom: 56,
          keyTo: 60,
          valueFrom: 64,
          valueTo: 75,
        },
        "/boop/0": {
          valueFrom: 66,
          valueTo: 75,
        },
        "/boop/0/foo": {
          keyFrom: 66,
          keyTo: 69,
          valueFrom: 71,
          valueTo: 75,
        },
        "/object": {
          keyFrom: 4,
          keyTo: 10,
          valueFrom: 14,
          valueTo: 23,
        },
        "/object/foo": {
          keyFrom: 14,
          keyTo: 17,
          valueFrom: 19,
          valueTo: 23,
        },
      },
    },
  ])(
    "should return a map of all pointers for a document (mode: $mode)",
    ({ doc, mode, expected }) => {
      const state = EditorState.create({
        doc,
        extensions: [getExtensions(mode)],
      });
      const pointers = getJsonPointers(state, mode);
      expect(Object.fromEntries(pointers.entries())).toEqual(expected);
    },
  );
});
