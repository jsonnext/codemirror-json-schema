import { EditorView } from "codemirror";
import { JSONValidation, type JSONValidationOptions } from "./json-validation";
import type { JSONSchema7 } from "json-schema";
import { parseJSON5DocumentState } from "./utils/parseJSON5Document";

/**
 * Instantiates a JSONValidation instance with the JSON5 mode
 */
export function lintJSON5Schema(
  schema: JSONSchema7,
  options?: JSONValidationOptions
) {
  const validation = new JSONValidation(schema, {
    jsonParser: parseJSON5DocumentState,
    ...options,
  });
  return (view: EditorView) => {
    return validation.doValidation(view);
  };
}
