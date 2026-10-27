// Keywords whose value is a subschema, or an array of subschemas.
const SCHEMA_KEYWORDS = new Set([
  "additionalItems",
  "additionalProperties",
  "allOf",
  "anyOf",
  "contains",
  "contentSchema",
  "else",
  "if",
  "items",
  "not",
  "oneOf",
  "prefixItems",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties",
]);

// Keywords whose value maps names to subschemas. "dependencies" may also map
// to arrays of property names, which are left as they are.
const SCHEMA_MAP_KEYWORDS = new Set([
  "$defs",
  "definitions",
  "dependencies",
  "dependentSchemas",
  "patternProperties",
  "properties",
]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value);

/**
 * Returns a shallow copy of a schema with `fn` applied to each of its direct
 * subschemas. Only schema-bearing keywords are followed, so data such as
 * `const`, `enum`, `default` and `examples` is never treated as a schema, and
 * the names in maps such as `properties` are never mistaken for keywords.
 */
export function mapSubschemas(
  schema: Record<string, unknown>,
  fn: (subschema: unknown) => unknown,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (SCHEMA_KEYWORDS.has(key)) {
      out[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    } else if (SCHEMA_MAP_KEYWORDS.has(key) && isObject(value)) {
      const map: Record<string, unknown> = {};
      for (const [name, entry] of Object.entries(value)) {
        map[name] = isObject(entry) ? fn(entry) : entry;
      }
      out[key] = map;
    } else {
      out[key] = value;
    }
  }
  return out;
}
