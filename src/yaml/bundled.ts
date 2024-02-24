import { JSONSchema7 } from "json-schema";
import { yaml, yamlLanguage } from "@codemirror/lang-yaml";
import { hoverTooltip } from "@codemirror/view";
import { handleRefresh } from "../features/validation";
import { stateExtensions } from "../features/state";

import { linter } from "@codemirror/lint";
import { yamlSchemaLinter } from "./validation";
import { yamlCompletion } from "./completion";
import { yamlSchemaHover } from "./hover";

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
