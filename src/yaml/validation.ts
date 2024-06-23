import { EditorView } from "@codemirror/view";
import {
  JSONValidation,
  type JSONValidationOptions,
} from "../features/validation";
import { MODES } from "../constants";
import { parseYAMLDocumentState } from "../parsers/yaml-parser";

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
