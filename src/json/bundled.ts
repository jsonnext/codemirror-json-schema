import { JSONSchema7 } from "json-schema";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { hoverTooltip } from "@codemirror/view";
import { jsonCompletion } from "../features/completion";
import { handleRefresh, jsonSchemaLinter } from "../features/validation";
import { jsonSchemaHover } from "../features/hover";
import { stateExtensions } from "../features/state";
import { isSchemaOptions, schemaConfigFacet } from "../features/schema-config";
import { schemaResolverPlugin } from "../features/schema-resolver";
import { type FetchSchemaFn } from "../features/ref-resolver";

import { linter } from "@codemirror/lint";

export interface JsonSchemaOptions {
  schema?: JSONSchema7;
  fetchSchema?: FetchSchemaFn;
}

/**
 * Full featured cm6 extension for json, including `@codemirror/lang-json`
 * @group Bundled Codemirror Extensions
 */
export function jsonSchema(schemaOrOpts?: JSONSchema7 | JsonSchemaOptions) {
  let schema: JSONSchema7 | undefined;
  let fetchSchema: FetchSchemaFn | undefined;

  if (isSchemaOptions(schemaOrOpts)) {
    schema = schemaOrOpts.schema;
    fetchSchema = schemaOrOpts.fetchSchema;
  } else {
    schema = schemaOrOpts;
  }

  const extensions = [
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

  if (fetchSchema) {
    extensions.push(
      schemaConfigFacet.of({ fetchSchema }),
      schemaResolverPlugin,
    );
  }

  return extensions;
}
