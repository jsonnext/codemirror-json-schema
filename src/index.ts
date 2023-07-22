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

export { jsonSchema } from "./bundled";

export type {
  JSONPointersMap,
  JSONPointerData,
  JSONPartialPointerData,
} from "./types";

export * from "./utils/parseJSONDocument";
export * from "./utils/jsonPointers";
