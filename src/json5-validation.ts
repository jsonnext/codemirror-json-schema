import { EditorView } from "@codemirror/view";
import {
  JSONValidation,
  type JSONValidationOptions,
} from "./json-validation.js";
import { parseJSON5DocumentState } from "./utils/parseJSON5Document.js";

/**
 * Instantiates a JSONValidation instance with the JSON5 mode
 * @group Codemirror Extensions
 */
export function json5SchemaLinter(options?: JSONValidationOptions) {
  const validation = new JSONValidation({
    jsonParser: parseJSON5DocumentState,
    ...options,
  });
  return (view: EditorView) => {
    return validation.doValidation(view);
  };
}
