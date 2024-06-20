import { EditorView } from "@codemirror/view";
import {
  JSONValidation,
  type JSONValidationOptions,
} from "../features/validation";
import { MODES } from "../constants";
import { parseJSON5DocumentState } from "@parsers/json5-parser";

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
