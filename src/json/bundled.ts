import { JSONSchema7 } from "json-schema";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { hoverTooltip } from "@codemirror/view";
import { jsonCompletion } from "../features/completion";
import { handleRefresh, jsonSchemaLinter } from "../features/validation";
import { jsonSchemaHover } from "../features/hover";
import { stateExtensions } from "../features/state";

import { linter } from "@codemirror/lint";

/**
 * Full featured cm6 extension for json, including `@codemirror/lang-json`
 * @group Bundled Codemirror Extensions
 */
export function jsonSchema(schema?: JSONSchema7) {
  return [
    json(),
    linter(jsonParseLinter()),
    linter(jsonSchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
    jsonLanguage.data.of({
      autocomplete: jsonCompletion(),
    }),
    hoverTooltip(jsonSchemaHover()),
    stateExtensions(schema),
  ];
}
