export const TOKENS = {
  STRING: "String",
  NUMBER: "Number",
  TRUE: "True",
  FALSE: "False",
  NULL: "Null",
  OBJECT: "Object",
  ARRAY: "Array",
  PROPERTY: "Property",
  PROPERTY_NAME: "PropertyName",
  PROPERTY_COLON: "PropertyColon", // used in json5 grammar
  ITEM: "Item", // used in yaml grammar
  JSON_TEXT: "JsonText",
  INVALID: "⚠",
} as const;

// TODO: To ensure that the YAML tokens are always mapped correctly,
// we should change the TOKENS values to some other values and also create
// mappings for the JSON tokens, which will force us to update all the token mappings whenever there is a change.
export const YAML_TOKENS_MAPPING: Record<
  string,
  (typeof TOKENS)[keyof typeof TOKENS]
> = {
  Pair: TOKENS.PROPERTY,
  Key: TOKENS.PROPERTY_NAME,
  BlockSequence: TOKENS.ARRAY,
  BlockMapping: TOKENS.OBJECT,
  QuotedLiteral: TOKENS.STRING,
  Literal: TOKENS.STRING, // best guess
  Stream: TOKENS.JSON_TEXT,
  Document: TOKENS.OBJECT,
};
export const JSON5_TOKENS_MAPPING: Record<
  string,
  (typeof TOKENS)[keyof typeof TOKENS]
> = {
  File: TOKENS.JSON_TEXT,
};

export const PRIMITIVE_TYPES = [
  TOKENS.STRING,
  TOKENS.NUMBER,
  TOKENS.TRUE,
  TOKENS.FALSE,
  TOKENS.NULL,
];
export const COMPLEX_TYPES = [TOKENS.OBJECT, TOKENS.ARRAY, TOKENS.ITEM];

export const MODES = {
  JSON5: "json5",
  JSON: "json4",
  YAML: "yaml",
} as const;
