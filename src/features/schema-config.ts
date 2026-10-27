import { Facet } from "@codemirror/state";
import type { JSONSchema7 } from "json-schema";
import type { FetchSchemaFn } from "./ref-resolver";

export interface SchemaConfig {
  fetchSchema?: FetchSchemaFn;
}

export const schemaConfigFacet = Facet.define<SchemaConfig, SchemaConfig>({
  combine: (configs) => Object.assign({}, ...configs),
});

const OPTION_KEYS = new Set(["schema", "fetchSchema"]);

/**
 * Reports whether the argument of a bundled extension is its options object,
 * `{ schema, fetchSchema }`, rather than a raw schema. Neither key is a JSON
 * Schema keyword, so an object with only these keys is options, as is any
 * object with a `fetchSchema` function.
 */
export function isSchemaOptions(
  arg: unknown,
): arg is { schema?: JSONSchema7; fetchSchema?: FetchSchemaFn } {
  if (arg == null || typeof arg !== "object" || Array.isArray(arg)) {
    return false;
  }
  if (typeof (arg as SchemaConfig).fetchSchema === "function") return true;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.every((key) => OPTION_KEYS.has(key));
}
