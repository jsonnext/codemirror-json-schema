import { JSONSchema7 } from "json-schema";
import { yaml, yamlLanguage } from "@codemirror/lang-yaml";
import YAML from "yaml";
import { hoverTooltip } from "@codemirror/view";
import { jsonCompletion } from "./json-completion.js";
import { handleRefresh, jsonSchemaLinter } from "./json-validation.js";
import { jsonSchemaHover } from "./json-hover.js";
import { stateExtensions } from "./state.js";

import { linter } from "@codemirror/lint";
import { MODES } from "./constants.js";
import { parseYAMLDocumentState } from "./utils/parse-yaml-document.js";

/**
 * Full featured cm6 extension for json, including `@codemirror/lang-json`
 * @group Bundled Codemirror Extensions
 */
export function yamlSchema(schema?: JSONSchema7) {
  return [
    yaml(),
    linter(
      jsonSchemaLinter({
        mode: MODES.YAML,
        jsonParser: parseYAMLDocumentState,
      }),
      {
        needsRefresh: handleRefresh,
      }
    ),
    yamlLanguage.data.of({
      autocomplete: jsonCompletion({
        mode: MODES.YAML,
      }),
    }),
    hoverTooltip(
      jsonSchemaHover({
        mode: MODES.YAML,
        parser: YAML.parse,
      })
    ),
    stateExtensions(schema),
  ];
}
