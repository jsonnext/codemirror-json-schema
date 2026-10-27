import {
  compileSchema as compileWithDrafts,
  draft04,
  draft06,
  draft07,
  draft2019,
  draft2020,
  extendDraft,
  type CompileOptions,
  type Draft,
  type JsonSchema,
  type JsonSchemaValidatorParams,
  type SchemaNode,
} from "json-schema-library";

/**
 * `json-schema-library` validates `if` against a copy of the validation path
 * (`[...path]`) so that nodes evaluated by `if` aren't recorded. That path
 * holds every node visited so far in the document and is never trimmed, so
 * each `if` costs time proportional to everything validated before it, and
 * validation is quadratic in the size of the document. Schemas that select
 * definitions with `if`/`then` (a common way to write discriminated unions)
 * take seconds for documents of a few hundred kilobytes and can exhaust the
 * memory of a browser tab beyond that. This affects v10 and v11.
 *
 * This validator does the same without the copy: it validates `if` against
 * the shared path and then truncates the path back to its previous length.
 * The `if` subschema still sees the full dynamic scope for `$dynamicRef` and
 * `$recursiveRef`, and the entries it adds are discarded as before.
 */
function validateIf({ node, data, pointer, path }: JsonSchemaValidatorParams) {
  if (node.if == null) return;
  const length = path.length;
  const matched = node.if.validate(data, pointer, path);
  path.length = length;
  const branch =
    matched.errors.length === 0 && matched.errorsAsync.length === 0
      ? node.then
      : node.else;
  if (branch == null) return;
  const { errors, errorsAsync } = branch.validate(data, pointer, path);
  return [...errors, ...errorsAsync];
}

function withValidateIf(draft: Draft): Draft {
  const keyword = draft.keywords.find((k) => k.keyword === "if");
  if (keyword == null) return draft;
  return extendDraft(draft, {
    keywords: [{ ...keyword, validate: validateIf }],
  });
}

// The library's default drafts, in its order, with validateIf.
const drafts = [draft04, draft06, draft07, draft2019, draft2020].map(
  withValidateIf,
);

/**
 * compileSchema wraps `compileSchema` from `json-schema-library` to use
 * drafts that validate `if` in linear time. Use it instead of the library's.
 */
export function compileSchema(
  schema: JsonSchema,
  options: CompileOptions = {},
): SchemaNode {
  return compileWithDrafts(schema, { drafts, ...options });
}
