export { JSONCompletion } from "./json-completion";
export {
  JSONValidation,
  jsonSchemaLiner,
  type JSONValidationOptions,
} from "./json-validation";
export { JSONHover, type HoverOptions, jsonSchemaHover } from "./json-hover";

// export utilities for general use
export * from "./utils/parseJSONDocument";
export * from "./utils/jsonPointers";
export * from "./utils/parseJSON5Document";

// json5
export { json5SchemaLinter } from "./json5-validation";
export { json5SchemaHover } from "./json5-hover";
