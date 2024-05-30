export {
  jsonCompletion,
  JSONCompletion,
  type JSONCompletionOptions,
} from "./json-completion.js";

export {
  jsonSchemaLinter,
  JSONValidation,
  type JSONValidationOptions,
  handleRefresh,
} from "./json-validation.js";

export {
  jsonSchemaHover,
  JSONHover,
  type HoverOptions,
  type FoundCursorData,
  type CursorData,
} from "./json-hover.js";

export { jsonSchema } from "./bundled.js";

export type {
  JSONPointersMap,
  JSONPointerData,
  JSONPartialPointerData,
} from "./types.js";

export * from "./utils/parseJSONDocument.js";
export * from "./utils/jsonPointers.js";

export * from "./state.js";
