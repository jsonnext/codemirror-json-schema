import { JSONSchema7 } from "json-schema";
import { JSONValidation } from "../validation";
import type { Diagnostic } from "@codemirror/lint";
import { describe, it, expect } from "vitest";
import { EditorView } from "@codemirror/view";

import { testSchema, testSchema2 } from "./__fixtures__/schemas";
import { JSONMode } from "../../types";
import { getExtensions } from "./__helpers__/index";
import { MODES } from "../../constants";

const getErrors = (
  jsonString: string,
  mode: JSONMode,
  schema?: JSONSchema7
) => {
  const view = new EditorView({
    doc: jsonString,
    extensions: [getExtensions(mode, schema ?? testSchema)],
  });
  return new JSONValidation({ mode }).doValidation(view);
};

const common = {
  severity: "error" as Diagnostic["severity"],
  source: "json-schema",
};

const expectErrors = (
  jsonString: string,
  errors: [from: number | undefined, to: number | undefined, message: string][],
  mode: JSONMode,
  schema?: JSONSchema7
) => {
  const filteredErrors = getErrors(jsonString, mode, schema).map(
    ({ renderMessage, ...error }) => error
  );
  expect(filteredErrors).toEqual(
    errors.map(([from, to, message]) => ({ ...common, from, to, message }))
  );
};

describe("json-validation", () => {
  const jsonSuite = [
    {
      name: "provide range for a value error",
      mode: MODES.JSON,
      doc: '{"foo": 123}',
      errors: [
        {
          from: 8,
          to: 11,
          message: "Expected `string` but received `number`",
        },
      ],
    },
    {
      name: "provide range for an unknown key error",
      mode: MODES.JSON,
      doc: '{"foo": "example", "bar": 123}',
      errors: [
        {
          from: 19,
          to: 24,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "not handle invalid json",
      mode: MODES.JSON,
      doc: '{"foo": "example" "bar": 123}',
      errors: [],
    },
    {
      name: "provide range for invalid multiline json",
      mode: MODES.JSON,
      doc: `{
        "foo": "example",
    "bar": "something else"
  }`,
      errors: [
        {
          from: 32,
          to: 37,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "provide formatted error message when required fields are missing",
      mode: MODES.JSON,
      doc: `{
        "foo": "example",
        "object": {}
  }`,
      errors: [
        {
          from: 46,
          to: 48,
          message: "The required property `foo` is missing at `object`",
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with more than 2 items",
      mode: MODES.JSON,
      doc: `{
        "foo": "example",
        "object": { "foo": "true" },
    "oneOfEg": 123
  }`,
      errors: [
        {
          from: 80,
          to: 83,
          message: "Expected one of `string`, `array`, or `boolean`",
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with less than 2 items",
      mode: MODES.JSON,
      doc: `{
        "foo": "example",
        "object": { "foo": "true" },
    "oneOfEg2": 123
  }`,
      errors: [
        {
          from: 81,
          to: 84,
          message: "Expected one of `string` or `array`",
        },
      ],
      schema: testSchema2,
    },
  ];
  it.each([
    ...jsonSuite,
    // JSON5
    {
      name: "provide range for a value error",
      mode: MODES.JSON5,
      doc: "{foo: 123}",
      errors: [
        {
          from: 6,
          to: 9,
          message: "Expected `string` but received `number`",
        },
      ],
    },
    {
      name: "provide range for an unknown key error",
      mode: MODES.JSON5,
      doc: "{foo: 'example', bar: 123}",
      errors: [
        {
          from: 17,
          to: 20,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "not handle invalid json",
      mode: MODES.JSON5,
      doc: "{foo: 'example' 'bar': 123}",
      errors: [],
    },
    {
      name: "provide range for invalid multiline json",
      mode: MODES.JSON5,
      doc: `{
        foo: 'example',
    bar: 'something else'
  }`,
      errors: [
        {
          from: 30,
          to: 33,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "provide formatted error message when required fields are missing",
      mode: MODES.JSON5,
      doc: `{
        foo: 'example',
        object: {}
  }`,
      errors: [
        {
          from: 42,
          to: 44,
          message: "The required property `foo` is missing at `object`",
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with more than 2 items",
      mode: MODES.JSON5,
      doc: `{
        foo: 'example',
        object: { foo: 'true' },
    oneOfEg: 123
  }`,
      errors: [
        {
          from: 72,
          to: 75,
          message: "Expected one of `string`, `array`, or `boolean`",
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with less than 2 items",
      mode: MODES.JSON5,
      doc: `{
        foo: 'example',
        object: { foo: 'true' },
    oneOfEg2: 123
  }`,
      errors: [
        {
          from: 73,
          to: 76,
          message: "Expected one of `string` or `array`",
        },
      ],
      schema: testSchema2,
    },
    // YAML
    ...jsonSuite.map((t) => ({ ...t, mode: MODES.YAML })),
    {
      name: "provide range for a value error",
      mode: MODES.YAML,
      doc: "foo: 123",
      errors: [
        {
          from: 5,
          to: 8,
          message: "Expected `string` but received `number`",
        },
      ],
    },
    {
      name: "provide range for an unknown key error",
      mode: MODES.YAML,
      doc: "foo: example\nbar: 123",
      errors: [
        {
          from: 13,
          to: 16,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "not handle invalid yaml",
      mode: MODES.YAML,
      doc: "foo: example\n- - -bar: 123",
      errors: [],
    },
    {
      name: "provide range for invalid multiline yaml",
      mode: MODES.YAML,
      doc: `foo: example
bar: something else
  `,
      errors: [
        {
          from: 13,
          to: 16,
          message: "Additional property `bar` is not allowed",
        },
      ],
    },
    {
      name: "provide formatted error message when required fields are missing",
      mode: MODES.YAML,
      doc: `foo: example
object: {}
  `,
      errors: [
        {
          from: 21,
          to: 23,
          message: "The required property `foo` is missing at `object`",
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with more than 2 items",
      mode: MODES.YAML,
      doc: `foo: example
object: { foo: true }
oneOfEg: 123
  `,
      errors: [
        {
          from: 28,
          message: "Expected `string` but received `boolean`",
          to: 32,
        },
        {
          from: 44,
          message: "Expected one of `string`, `array`, or `boolean`",
          to: 47,
        },
      ],
      schema: testSchema2,
    },
    {
      name: "provide formatted error message for oneOf fields with less than 2 items",
      mode: MODES.YAML,
      doc: `foo: example
object: { foo: true }
oneOfEg2: 123
  `,
      errors: [
        {
          from: 28,
          message: "Expected `string` but received `boolean`",
          to: 32,
        },
        {
          from: 45,
          message: "Expected one of `string` or `array`",
          to: 48,
        },
      ],
      schema: testSchema2,
    },
  ])("$name (mode: $mode)", ({ doc, mode, errors, schema }) => {
    expectErrors(
      doc,
      errors.map((error) => [error.from, error.to, error.message]),
      mode,
      schema
    );
  });
});
