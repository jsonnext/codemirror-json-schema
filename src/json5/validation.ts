import { EditorView } from "@codemirror/view";
import {
  JSONValidation,
  type JSONValidationOptions,
} from "../features/validation";
import { parseJSON5DocumentState } from "../utils/parse-json5-document";
import { MODES } from "../constants";

/**
 * Instantiates a JSONValidation instance with the JSON5 mode
 * @group Codemirror Extensions
 */
export function json5SchemaLinter(options?: JSONValidationOptions) {
  const validation = new JSONValidation({
    jsonParser: parseJSON5DocumentState,
    mode: MODES.JSON5,
    ...options,
  });
  return (view: EditorView) => {
    return validation.doValidation(view);
  };
}
