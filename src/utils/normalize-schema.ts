import { mapSubschemas } from "./schema-walk";

/**
 * JSON Schema 2020-12 treats `$ref` as an applicator that combines with any
 * sibling keywords (the implicit "and" of all assertions on the same object).
 * Earlier drafts (4/7) instead said a `$ref` replaces its siblings entirely.
 *
 * `json-schema-library` resolves a `$ref` by replacing the node with its
 * target, dropping sibling keywords — the old draft-4/7 behaviour — even when
 * the schema declares draft 2020-12. That silently discards constructs like:
 *
 *   { "$ref": "#/$defs/cbc.Key", "oneOf": [ { "const": "..." }, ... ] }
 *
 * where the `oneOf` carries the meaningful constraint (e.g. the list of
 * available `$addons` keys in a GOBL invoice). The resolved schema becomes a
 * bare string, so no enum/const completions are offered and the constraint is
 * not validated.
 *
 * This normalizer rewrites such nodes into the equivalent, draft-agnostic form
 *
 *   { "allOf": [ { "$ref": "#/$defs/cbc.Key" }, { "oneOf": [ ... ] } ] }
 *
 * which every draft (and `json-schema-library`) handles identically: both
 * members must hold, and the sibling keywords survive `getNode()` resolution.
 * Pure annotation keywords (title, description, …) are left alongside the new
 * `allOf` so property name/hover metadata is preserved.
 */

// Keywords that annotate rather than constrain. They are kept at the top level
// (next to the generated `allOf`) so consumers reading them directly — e.g.
// property-name completion and hover — still see them.
const ANNOTATION_KEYWORDS = new Set([
  "title",
  "description",
  "default",
  "examples",
  "deprecated",
  "readOnly",
  "writeOnly",
  "$comment",
  "$id",
  "$anchor",
  "$schema",
  "$defs",
  "definitions",
  "$dynamicAnchor",
  "$vocabulary",
]);

// Drafts in which `$ref` replaces its siblings, matched like
// json-schema-library matches `$schema`. Schemas without `$schema` use its
// latest draft, 2020-12.
const LEGACY_DRAFT = /draft-0[467]/;

/**
 * Recursively rewrites every `$ref` that has constraining sibling keywords into
 * an `allOf` of the bare `$ref` and those siblings, so draft 2020-12 `$ref`
 * sibling semantics are honoured regardless of the resolver's default draft.
 *
 * Schemas that declare draft-04, -06 or -07 in `$schema` are left as they
 * are, since those drafts ignore `$ref` siblings. A nested `$schema` applies
 * to its subschemas.
 *
 * The transform is idempotent: a second pass finds the `$ref` alone inside an
 * `allOf` member (no constraining siblings) and leaves it untouched.
 */
export function normalizeRefSiblings<T>(schema: T, legacy = false): T {
  if (schema === null || typeof schema !== "object" || Array.isArray(schema)) {
    return schema;
  }

  const input = schema as Record<string, unknown>;
  if (typeof input.$schema === "string") {
    legacy = LEGACY_DRAFT.test(input.$schema);
  }
  const out = mapSubschemas(input, (subschema) =>
    normalizeRefSiblings(subschema, legacy),
  );

  if (!legacy && typeof out.$ref === "string") {
    const constraintKeys = Object.keys(out).filter(
      (key) => key !== "$ref" && !ANNOTATION_KEYWORDS.has(key),
    );
    if (constraintKeys.length > 0) {
      const ref = out.$ref as string;
      const constraints: Record<string, unknown> = {};
      for (const key of constraintKeys) {
        constraints[key] = out[key];
        delete out[key];
      }
      delete out.$ref;
      out.allOf = [{ $ref: ref }, constraints];
    }
  }

  return out as unknown as T;
}
