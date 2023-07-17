import { JSONSchema7 } from "json-schema";
import { JSONValidation } from "../json-validation";
import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";

const testSchema = {
  type: "object",
  properties: {
    foo: {
      type: "string",
    },
  },
  required: ["foo"],
  additionalProperties: false,
} as JSONSchema7;

const testSchema2 = {
  type: "object",
  properties: {
    foo: {
      type: "string",
    },
    object: {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
    oneOfEg: {
      oneOf: [{"type": "string"}, {"type": "array"}]
    }
  },
  required: ["foo", "object.foo"],
  additionalProperties: false,
} as JSONSchema7;

const getErrors = (jsonString: string, schema?: JSONSchema7) => {
  const view = new EditorView({ doc: jsonString, extensions: [json()] });
  return new JSONValidation(schema || testSchema).doValidation(view);
};

// console.log(getErrors('{"foo": "example", "bar": 123}', testSchema))
// console.log(getErrors('{"foo": 3, "bar": 123}', testSchema))

// console.log(getErrors('{"object": { "foo": true, "bar": true }, "foo": 3, "bar": 123 }', testSchema2))

describe("json-validation", () => {
  it("should provide range for a value error", () => {
    expect(getErrors('{"foo": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          from: 8,
          to: 11,
          message: "Expected `string` but received `number`",
          severity: "error",
          source: 'json-schema'
        },
      ])
    );
  });
  it("should provide range for an unknown key error", () => {
    expect(getErrors('{"foo": "example", "bar": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          from: 19,
          to: 24,
          message: "Additional property `bar` in `#` is not allowed",
          severity: "error",
          source: 'json-schema'
        },
      ])
    );
  });
  it("should provide range for invalid json", () => {
    expect(getErrors('{"foo": "example" "bar": 123}', testSchema)).toEqual(
      expect.arrayContaining([
        {
          from: 18,
          to: 19,
          message: 'Unexpected token " in JSON at position 18',
          severity: "error",
          source: 'SyntaxError'
        },
      ])
    );
  });
  it("should provide range for invalid multline json", () => {
    expect(
      getErrors(
        `{
        "foo": "example",
    "bar": "something else"
  }`,
        testSchema
      )
    ).toEqual(
      expect.arrayContaining([
        {
          from: 32,
          to: 37,
          message: "Additional property `bar` in `#` is not allowed",
          severity: "error",
          source: 'json-schema'
        },
      ])
    );
  });
  it("should provide formatted error message for oneOf fields", () => {
    expect(
      getErrors(
        `{
        "foo": "example",
    "oneOfEg": 123
  }`,
        testSchema2
      )
    ).toEqual(
      expect.arrayContaining([
        {
          from: 43,
          to: 46,
          message: "Expected one of `\"string\"` or `\"array\"`",
          severity: "error",
          source: 'json-schema'
        },
      ])
    );
  });
});
