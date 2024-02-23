import { JSONSchema7 } from "json-schema";
import { yaml, yamlLanguage } from "@codemirror/lang-yaml";
import { hoverTooltip } from "@codemirror/view";
import { handleRefresh } from "../json-validation.js";
import { stateExtensions } from "../state.js";

import { linter } from "@codemirror/lint";
import { yamlSchemaLinter } from "./validation.js";
import { yamlCompletion } from "./completion.js";
import { yamlSchemaHover } from "./hover.js";

/**
 * Full featured cm6 extension for json, including `@codemirror/lang-json`
 * @group Bundled Codemirror Extensions
 */
export function yamlSchema(schema?: JSONSchema7) {
  return [
    yaml(),
    linter(yamlSchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
    yamlLanguage.data.of({
      autocomplete: yamlCompletion(),
    }),
    hoverTooltip(yamlSchemaHover()),
    stateExtensions(schema),
  ];
}
