import { describe, expect, it } from "vitest";
import { JSONMode } from "../../types";
import { MODES } from "../../constants";
import { EditorState } from "@codemirror/state";
import { getNodeAtPosition } from "../node";
import { getExtensions } from "../../__tests__/__helpers__";

// complex data structure for testing. Keep these in sync.
const testJsonData = `
{
  "bog": {
    "array": [
      {
        "foo": true
      },
      {
        "bar": 123
      }
    ]
  },
  "bar": 123,
  "baz": [1, 2, 3]
}
`;

const testJson5Data = `
{
  bog: {
    array: [
      {
        'foo': true
      },
      {
        'bar': 123
      }
    ]
  },
  'bar': 123,
  'baz': [1, 2, 3]
}
`;

const testYamlData = `---
bog:
  array:
    - foo: true
    - bar: 123
bar: 123
baz: [1, 2, 3]
`;

const getTestData = (mode: JSONMode) => {
  switch (mode) {
    case MODES.JSON:
      return testJsonData;
    case MODES.JSON5:
      return testJson5Data;
    case MODES.YAML:
      return testYamlData;
  }
};

describe("getNodeAtPosition", () => {
  it.each([
    {
      mode: MODES.JSON,
      pos: 1,
      expectedName: "JsonText",
    },
    {
      mode: MODES.JSON,
      pos: 6,
      expectedName: "PropertyName",
    },
    {
      mode: MODES.JSON,
      pos: 13,
      expectedName: "{",
    },
    {
      mode: MODES.JSON,
      pos: 28,
      expectedName: "[",
    },
    {
      mode: MODES.JSON,
      pos: 53,
      expectedName: "True",
    },
    {
      mode: MODES.JSON,
      pos: 121,
      expectedName: "Property",
    },
    // JSON5
    {
      mode: MODES.JSON5,
      pos: 1,
      expectedName: "File",
    },
    {
      mode: MODES.JSON5,
      pos: 6,
      expectedName: "PropertyName",
    },
    {
      mode: MODES.JSON5,
      pos: 11,
      expectedName: "{",
    },
    {
      mode: MODES.JSON5,
      pos: 24,
      expectedName: "[",
    },
    {
      mode: MODES.JSON5,
      pos: 49,
      expectedName: "True",
    },
    {
      mode: MODES.JSON5,
      pos: 85,
      expectedName: "Property",
    },
    // YAML
    {
      mode: MODES.YAML,
      pos: 1,
      expectedName: "DirectiveEnd",
    },
    {
      mode: MODES.YAML,
      pos: 4,
      expectedName: "Document",
    },
    {
      mode: MODES.YAML,
      pos: 5,
      expectedName: "Literal",
    },
    {
      mode: MODES.YAML,
      pos: 11,
      expectedName: "Pair",
    },
    {
      mode: MODES.YAML,
      pos: 16,
      expectedName: "Literal",
    },
    {
      mode: MODES.YAML,
      pos: 22,
      expectedName: "Pair",
    },
    {
      mode: MODES.YAML,
      pos: 30,
      expectedName: "Literal",
    },
    {
      mode: MODES.YAML,
      pos: 38,
      expectedName: "BlockSequence",
    },
    {
      mode: MODES.YAML,
      pos: 54,
      expectedName: "Pair",
    },
  ])(
    "should return node at position $pos (mode: $mode)",
    ({ mode, expectedName, pos }) => {
      const state = EditorState.create({
        doc: getTestData(mode),
        extensions: [getExtensions(mode)],
      });
      const node = getNodeAtPosition(state, pos);
      expect(node.name).toBe(expectedName);
    }
  );
});
