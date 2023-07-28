import { JSONSchema7 } from "json-schema";
import { json5, json5Language, json5ParseLinter } from "codemirror-json5";
import { hoverTooltip } from "@codemirror/view";
import { json5Completion } from "./json-completion";
import { json5SchemaLinter } from "./json5-validation";
import { json5SchemaHover } from "./json5-hover";

import { linter } from "@codemirror/lint";

/**
 * Full featured cm6 extension for json5, including `codemirror-json5`
 * @group Bundled Codemirror Extensions
 */
export function json5Schema(schema: JSONSchema7) {
  return [
    json5(),
    linter(json5ParseLinter()),
    linter(json5SchemaLinter(schema)),
    json5Language.data.of({
      autocomplete: json5Completion(schema),
    }),
    hoverTooltip(json5SchemaHover(schema)),
  ];
}
