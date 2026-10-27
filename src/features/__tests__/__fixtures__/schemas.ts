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

export const testSchemaArrayOfObjects = {
  type: "array",
  items: {
    type: "object",
  },
} as JSONSchema7;

export const testSchemaStringValidation = {
  type: "object",
  properties: {
    code: {
      type: "string",
      minLength: 1,
      maxLength: 10,
      pattern: "^[A-Z]+$",
    },
    name: {
      type: "string",
      minLength: 2,
    },
  },
  required: ["code"],
  additionalProperties: false,
} as JSONSchema7;

export const testSchemaWithExternalRef = {
  type: "object",
  properties: {
    code: { $ref: "https://example.com/schemas/code" },
  },
  $defs: {
    Code: {
      $id: "https://example.com/schemas/code",
      type: "string",
      minLength: 1,
      maxLength: 10,
      pattern: "^[A-Z]+$",
    },
  },
} as JSONSchema7;

export const testSchemaRefWithOneOf = {
  type: "object",
  properties: {
    invoiceType: {
      $ref: "#/definitions/keyType",
      oneOf: [
        {
          const: "standard",
          title: "Standard",
          description: "Standard invoice",
        },
        {
          const: "proforma",
          title: "Proforma",
          description: "Proforma invoice",
        },
      ],
      title: "Type",
      description: "Type of invoice document.",
    },
  },
  definitions: {
    keyType: { type: "string" },
  },
} as JSONSchema7;

// Mirrors a GOBL invoice bundle: a root-level $ref, an array property whose
// items carry a $ref alongside a sibling oneOf listing the available values
// (e.g. the `$addons` keys). Exercises $ref-sibling handling inside array
// items resolved through draft 2020-12.
export const testSchemaArrayItemsRefWithOneOf = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://gobl.org/draft-0/bill/invoice",
  $ref: "#/$defs/bill.Invoice",
  $defs: {
    "bill.Invoice": {
      type: "object",
      properties: {
        $addons: {
          $ref: "#/$defs/tax.AddonList",
          title: "Addons",
          description: "Tax addons applied to the document.",
        },
      },
    },
    "tax.AddonList": {
      type: "array",
      items: {
        $ref: "#/$defs/cbc.Key",
        oneOf: [
          {
            const: "es-verifactu-v1",
            title: "Spain VERI*FACTU V1",
            description: "Spain VERI*FACTU invoicing.",
          },
          {
            const: "mx-cfdi-v4",
            title: "Mexican SAT CFDI v4.X",
            description: "Mexican SAT CFDI invoicing.",
          },
        ],
      },
    },
    "cbc.Key": { type: "string", pattern: "^[a-z][a-z0-9-]*$" },
  },
} as JSONSchema7;
