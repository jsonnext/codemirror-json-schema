export { JSONCompletion } from "./json-completion";
export {
  JSONValidation,
  lintJSONSchema,
  type JSONValidationOptions,
} from "./json-validation";
export { JSONHover, type HoverOptions, hoverJsonSchema } from "./json-hover";

// export utilities for general use
export * from "./utils/parseJSONDocument";
export * from "./utils/jsonPointers";
export * from "./utils/parseJSON5Document";

// json5
export { lintJSON5Schema } from "./json5-validation";
export { hoverJson5Schema } from "./json5-hover";
