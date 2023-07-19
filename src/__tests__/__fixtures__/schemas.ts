import { JSONSchema7 } from "json-schema";

export const testSchema = {
  type: "object",
  properties: {
    foo: {
      type: "string",
    },
  },
  required: ["foo"],
  additionalProperties: false,
} as JSONSchema7;

export const testSchema2 = {
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
          description: "an elegant string",
        },
      },
      additionalProperties: false,
    },
    oneOfEg: {
      description: "an example oneOf",
      title: "oneOfEg",
      oneOf: [{ type: "string" }, { type: "array" }, { type: "boolean" }],
    },
    oneOfEg2: {
      oneOf: [{ type: "string" }, { type: "array" }],
    },
  },
  required: ["foo", "object.foo"],
  additionalProperties: false,
} as JSONSchema7;
