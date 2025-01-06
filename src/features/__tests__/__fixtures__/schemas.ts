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
    stringWithDefault: {
      type: "string",
      description: "a string with a default value",
      default: "defaultString",
    },
    bracedStringDefault: {
      type: "string",
      description: "a string with a default value containing braces",
      default: "✨ A message from %{whom}: ✨",
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
    objectWithRef: {
      $ref: "#/definitions/fancyObject",
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
      additionalProperties: false,
    },
    fancyObject2: {
      type: "object",
      properties: {
        apple: { type: "string" },
        banana: { type: "number" },
      },
      additionalProperties: false,
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

export const testSchemaConditionalProperties = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["Test_1", "Test_2"],
    },
    props: {
      type: "object",
    },
  },
  allOf: [
    {
      if: {
        properties: {
          type: { const: "Test_1" },
        },
      },
      then: {
        properties: {
          props: {
            properties: {
              test1Props: { type: "string" },
            },
            additionalProperties: false,
          },
        },
      },
    },
    {
      if: {
        properties: {
          type: { const: "Test_2" },
        },
      },
      then: {
        properties: {
          props: {
            properties: {
              test2Props: { type: "number" },
            },
            additionalProperties: false,
          },
        },
      },
    },
  ],
} as JSONSchema7;

export const testSchemaConditionalPropertiesOnSameObject = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["type1", "type2"],
    },
  },
  allOf: [
    {
      if: {
        properties: {
          type: { const: "type1" },
        },
      },
      then: {
        properties: {
          type1Prop: { type: "string" },
          commonEnum: {
            enum: ["common1", "common2"],
          },
          commonEnumWithDifferentValues: {
            enum: ["type1Specific", "common"],
          },
        },
        required: ["type1Prop", "commonEnum", "commonEnumWithDifferentValues"],
      },
    },
    {
      if: {
        properties: {
          type: { const: "type2" },
        },
      },
      then: {
        properties: {
          type2Prop: { type: "string" },
          commonEnum: {
            enum: ["common1", "common2"],
          },
          commonEnumWithDifferentValues: {
            enum: ["type2Specific", "common"],
          },
        },
        required: ["type2Prop", "commonEnum", "commonEnumWithDifferentValues"],
      },
    },
  ],
  unevaluatedProperties: false,
  required: ["type"],
} as JSONSchema7;

export const wrappedTestSchemaConditionalPropertiesOnSameObject = {
  type: "object",
  properties: {
    original: testSchemaConditionalPropertiesOnSameObject,
  },
  required: ["original"],
} as JSONSchema7;
