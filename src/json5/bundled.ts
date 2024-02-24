import { JSONSchema7 } from "json-schema";
import { json5, json5Language, json5ParseLinter } from "codemirror-json5";
import { hoverTooltip } from "@codemirror/view";
import { json5Completion } from "./completion";
import { json5SchemaLinter } from "./validation";
import { json5SchemaHover } from "./hover";

import { linter } from "@codemirror/lint";
import { handleRefresh } from "../features/validation";
import { stateExtensions } from "../features/state";

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
