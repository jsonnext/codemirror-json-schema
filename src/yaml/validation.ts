import { EditorView } from "@codemirror/view";
import {
  JSONValidation,
  type JSONValidationOptions,
} from "../json-validation.js";
import { parseYAMLDocumentState } from "../utils/parse-yaml-document.js";
import { MODES } from "../constants.js";

/**
 * Instantiates a JSONValidation instance with the YAML mode
 * @group Codemirror Extensions
 */
export function yamlSchemaLinter(options?: JSONValidationOptions) {
  const validation = new JSONValidation({
    jsonParser: parseYAMLDocumentState,
    mode: MODES.YAML,
    ...options,
  });
  return (view: EditorView) => {
    return validation.doValidation(view);
  };
}
