import { JSONSchema7 } from "json-schema";
import { JSONValidation } from "../json-validation";
import type { Diagnostic } from "@codemirror/lint";
import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";

import { testSchema, testSchema2 } from "./__fixtures__/schemas.js";
import { stateExtensions } from "../state";

const getErrors = (jsonString: string, schema?: JSONSchema7) => {
  const view = new EditorView({
    doc: jsonString,
    extensions: [json(), stateExtensions(schema ?? testSchema)],
  });
  return new JSONValidation().doValidation(view);
};
const expectErrors = (
  jsonString: string,
  errors: [from: number | undefined, to: number | undefined, message: string][],
  schema?: JSONSchema7
) => {
  expect(getErrors(jsonString, schema)).toEqual(
    errors.map(([from, to, message]) => ({ ...common, from, to, message }))
  );
};

const common = {
  severity: "error" as Diagnostic["severity"],
  source: "json-schema",
};

describe("json-validation", () => {
  it("should provide range for a value error", () => {
    expectErrors('{"foo": 123}', [
      [8, 11, "Expected `string` but received `number`"],
    ]);
  });
  it("should provide range for an unknown key error", () => {
    expectErrors('{"foo": "example", "bar": 123}', [
      [19, 24, "Additional property `bar` in `#` is not allowed"],
    ]);
  });
  it("should not handle invalid json", () => {
    expectErrors('{"foo": "example" "bar": 123}', [
      [undefined, undefined, "Expected `object` but received `null`"],
    ]);
  });
  it("should provide range for invalid multline json", () => {
    expectErrors(
      `{
        "foo": "example",
    "bar": "something else"
  }`,
      [[32, 37, "Additional property `bar` in `#` is not allowed"]]
    );
  });
  it("should provide formatted error message when required fields are missing", () => {
    expectErrors(
      `{
        "foo": "example",
        "object": {}
  }`,
      [[46, 48, "The required property `foo` is missing at `object`"]],
      testSchema2
    );
  });
  it("should provide formatted error message for oneOf fields with more than 2 items", () => {
    expectErrors(
      `{
        "foo": "example",
        "object": { "foo": "true" },
    "oneOfEg": 123
  }`,
      [[80, 83, 'Expected one of `"string"`, `"array"`, or `"boolean"`']],
      testSchema2
    );
  });
  it("should provide formatted error message for oneOf fields with less than 2 items", () => {
    expectErrors(
      `{
        "foo": "example",
        "object": { "foo": "true" },
    "oneOfEg2": 123
  }`,
      [[81, 84, 'Expected one of `"string"` or `"array"`']],
      testSchema2
    );
  });
});
