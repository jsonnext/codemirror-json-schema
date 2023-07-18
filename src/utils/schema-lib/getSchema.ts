import gp from "@sagold/json-pointer";

import {
  isJsonError,
  type Draft,
  type JsonSchema,
  type JsonPointer,
} from "json-schema-library";

import step from "./step";

const emptyObject = {};

/**
 * Returns the json-schema of a data-json-pointer.
 *
 *  Notes
 *      - Uses draft.step to walk through data and schema
 *
 * @param draft
 * @param pointer - json pointer in data to get the json schema for
 * @param [data] - the data object, which includes the json pointers value. This is optional, as
 *    long as no oneOf, anyOf, etc statement is part of the pointers schema
 * @param [schema] - the json schema to iterate. Defaults to draft.rootSchema
 * @return json schema object of the json-pointer or an error
 */
export default function getSchema(
  draft: Draft,
  pointer: JsonPointer,
  data?: unknown,
  schema: JsonSchema = draft.rootSchema
): JsonSchema {
  const frags = gp.split(pointer);
  schema = draft.resolveRef(schema);
  return _get(draft, schema, frags, pointer, data);
}

function _get(
  draft: Draft,
  schema: JsonSchema,
  frags: Array<string>,
  pointer: JsonPointer,
  data: unknown = emptyObject
): JsonSchema {
  if (frags.length === 0) {
    return draft.resolveRef(schema);
  }

  const key = frags.shift(); // step key
  // @ts-expect-error
  schema = step(draft, key, schema, data, pointer); // step schema
  if (isJsonError(schema)) {
    return schema;
  }
  // @ts-expect-error
  data = data[key]; // step data
  return _get(draft, schema, frags, `${pointer}/${key}`, data);
}
