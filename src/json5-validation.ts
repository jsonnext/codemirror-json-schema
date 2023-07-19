import { EditorView } from "@codemirror/view";
import { JSONValidation, type JSONValidationOptions } from "./json-validation";
import type { JSONSchema7 } from "json-schema";
import { parseJSON5DocumentState } from "./utils/parseJSON5Document";

/**
 * Instantiates a JSONValidation instance with the JSON5 mode
 * @group Codemirror Extensions
 */
export function json5SchemaLinter(
  schema: JSONSchema7,
  options?: JSONValidationOptions
) {
  const validation = new JSONValidation(schema, {
    jsonParser: parseJSON5DocumentState,
    ...options,
  });
  return function json5DoLint(view: EditorView) {
    return validation.doValidation(view);
  };
}
