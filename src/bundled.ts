import { JSONSchema7 } from "json-schema";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { hoverTooltip } from "@codemirror/view";
import { jsonCompletion } from "./json-completion";
import { jsonSchemaLinter } from "./json-validation";
import { jsonSchemaHover } from "./json-hover";

import { linter } from "@codemirror/lint";

/**
 * Full featured cm6 extension for json, including `@codemirror/lang-json`
 * @group Bundled Codemirror Extensions
 */
export function jsonSchema(schema: JSONSchema7) {
  return [
    json(),
    linter(jsonParseLinter()),
    linter(jsonSchemaLinter(schema)),
    jsonLanguage.data.of({
      autocomplete: jsonCompletion(schema),
    }),
    hoverTooltip(jsonSchemaHover(schema)),
  ];
}
