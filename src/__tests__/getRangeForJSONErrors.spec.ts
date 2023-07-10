import { JSONSchema7Type, JSONSchema7TypeName, JSONSchema7 } from "json-schema";
import { getRangeForJSONErrors } from "../getRangeForJSONErrors";
import { describe, it, expect } from "vitest";
import { EditorState, Text, TextIterator, Transaction } from '@codemirror/state'
import { syntaxParserRunning} from '@codemirror/language'
import { json } from '@codemirror/lang-json'


const testSchema = {
  type: "object" as JSONSchema7TypeName,
  properties: {
    foo: {
      type: "string" as JSONSchema7TypeName,
    },
  },
  required: ["foo"],
  additionalProperties: false
} as JSONSchema7;

const getErrors = (jsonString: string, schema?: JSONSchema7) => {
    const state = EditorState.create({doc: jsonString, extensions: [json()]})
    return getRangeForJSONErrors(state.doc, schema || testSchema);
}

describe("getRangeForJSONErrors", () => {
  it("should provide range for a value error", () => {
    expect(getErrors('{"foo": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          range: {
            start: { line: 0, column: 8, pos: 8 },
            end: { line: 0, column: 11, pos: 11 },
          },
          message: "must be string at line 1, column 8",
        },
      ])
    );
  });
  it("should provide range for an unknown key error", () => {
    expect(getErrors('{"foo": "example", "bar": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          range: {
            start: { line: 0, column: 8, pos: 8 },
            end: { line: 0, column: 11, pos: 11 },
          },
          message: "property 'foo' is unknown at line 1, column 16",
        },
      ])
    );
  });
  it("should provide range for invalid json", () => {
    expect(getErrors('{"foo": "example" "bar": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          range: {
            start: { line: 0, column: 8, pos: 8 },
            end: { line: 0, column: 11, pos: 11 },
          },
          message: "property 'foo' is unknown at line 1, column 16",
        },
      ])
    );
  });
  it("should provide range for invalid multline json", () => {
    expect(getErrors(`{
        "foo": "example",
    "bar": "something else
}`, testSchema)).toEqual(
      expect.arrayContaining([
        {
          range: {
            start: { line: 0, column: 8, pos: 8 },
            end: { line: 0, column: 11, pos: 11 },
          },
          message: "property 'foo' is unknown at line 1, column 16",
        },
      ])
    );
  });
});
