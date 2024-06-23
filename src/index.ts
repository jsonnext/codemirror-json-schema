export {
  jsonCompletion,
  JSONCompletion,
  type JSONCompletionOptions,
} from "./features/completion";

export {
  jsonSchemaLinter,
  JSONValidation,
  type JSONValidationOptions,
  handleRefresh,
} from "./features/validation";

export {
  jsonSchemaHover,
  JSONHover,
  type HoverOptions,
  type FoundCursorData,
  type CursorData,
} from "./features/hover";

export { jsonSchema } from "./json/bundled";

export type {
  JSONPointersMap,
  JSONPointerData,
  JSONPartialPointerData,
} from "./types";

export * from "./parsers/json-parser";
export * from "./utils/json-pointers";

export * from "./features/state";
