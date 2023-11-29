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
      required: ["foo"],
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
    oneOfObject: {
      oneOf: [
        { $ref: "#/definitions/fancyObject" },
        { $ref: "#/definitions/fancyObject2" },
      ],
    },
    arrayOfObjects: {
      type: "array",
      items: {
        $ref: "#/definitions/fancyObject",
      },
    },
    arrayOfOneOf: {
      type: "array",
      items: {
        oneOf: [
          { $ref: "#/definitions/fancyObject" },
          { $ref: "#/definitions/fancyObject2" },
        ],
      },
    },
    enum1: {
      description: "an example enum with default bar",
      enum: ["foo", "bar"],
      default: "bar",
    },
    enum2: {
      description: "an example enum without default",
      enum: ["foo", "bar"],
    },
    booleanWithDefault: {
      description: "an example boolean with default",
      default: true,
      type: "boolean",
    },
  },
  required: ["foo", "object"],
  additionalProperties: false,
  definitions: {
    fancyObject: {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "number" },
      },
    },
    fancyObject2: {
      type: "object",
      properties: {
        apple: { type: "string" },
        banana: { type: "number" },
      },
    },
  },
} as JSONSchema7;

export const testSchema3 = {
  $ref: "#/definitions/fancyObject",
  definitions: {
    fancyObject: {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "number" },
      },
    },
  },
} as JSONSchema7;

export const testSchema4 = {
  allOf: [
    {
      $ref: "#/definitions/fancyObject",
    },
  ],
  definitions: {
    fancyObject: {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "number" },
      },
    },
  },
} as JSONSchema7;
