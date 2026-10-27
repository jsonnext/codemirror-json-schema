import { JSONSchema7 } from "json-schema";
import { yaml, yamlLanguage } from "@codemirror/lang-yaml";
import { hoverTooltip } from "@codemirror/view";
import { handleRefresh } from "../features/validation";
import { stateExtensions } from "../features/state";

import { linter } from "@codemirror/lint";
import { yamlSchemaLinter } from "./validation";
import { yamlCompletion } from "./completion";
import { yamlSchemaHover } from "./hover";
import { isSchemaOptions, schemaConfigFacet } from "../features/schema-config";
import { schemaResolverPlugin } from "../features/schema-resolver";
import { type FetchSchemaFn } from "../features/ref-resolver";

export interface YamlSchemaOptions {
  schema?: JSONSchema7;
  fetchSchema?: FetchSchemaFn;
}

/**
 * Full featured cm6 extension for yaml, including `@codemirror/lang-yaml`
 * @group Bundled Codemirror Extensions
 */
export function yamlSchema(schemaOrOpts?: JSONSchema7 | YamlSchemaOptions) {
  let schema: JSONSchema7 | undefined;
  let fetchSchema: FetchSchemaFn | undefined;

  if (isSchemaOptions(schemaOrOpts)) {
    schema = schemaOrOpts.schema;
    fetchSchema = schemaOrOpts.fetchSchema;
  } else {
    schema = schemaOrOpts;
  }

  const extensions = [
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

  if (fetchSchema) {
    extensions.push(
      schemaConfigFacet.of({ fetchSchema }),
      schemaResolverPlugin,
    );
  }

  return extensions;
}
