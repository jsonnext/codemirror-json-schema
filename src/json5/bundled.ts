import { JSONSchema7 } from "json-schema";
import { json5, json5Language, json5ParseLinter } from "codemirror-json5";
import { hoverTooltip } from "@codemirror/view";
import { json5Completion } from "./completion.js";
import { json5SchemaLinter } from "./validation.js";
import { json5SchemaHover } from "./hover.js";

import { linter } from "@codemirror/lint";
import { handleRefresh } from "../json-validation.js";
import { stateExtensions } from "../state.js";

/**
 * Full featured cm6 extension for json5, including `codemirror-json5`
 * @group Bundled Codemirror Extensions
 */
export function json5Schema(schema?: JSONSchema7) {
  return [
    json5(),
    linter(json5ParseLinter()),
    linter(json5SchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
    json5Language.data.of({
      autocomplete: json5Completion(),
    }),
    hoverTooltip(json5SchemaHover()),
    stateExtensions(schema),
  ];
}
