export { jsonCompletion } from "./json-completion";

export {
  jsonSchemaLinter,
  type JSONValidationOptions,
} from "./json-validation";

export {
  jsonSchemaHover,
  type HoverOptions,
  type FoundCursorData,
  type CursorData,
} from "./json-hover";

export type {
  JSONPointersMap,
  JSONPointerData,
  JSONPartialPointerData,
} from "./types";

/**
 * @group Utilities
 */
export * from "./utils/parseJSONDocument";
export * from "./utils/jsonPointers";
