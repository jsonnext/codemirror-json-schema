// using ajv and json-source-map, provide a function that returns the ranges and messages
// for json schema validation errors in json strings
// it should provide line numbers and columns for the errors
// it should provide the error messages

import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
import { parse } from 'json-source-map';

const ajv = new Ajv({ allErrors: true });

export function getRangeForJSONErrors(
  json: string,
  schema: JSONSchema7,
): { range: { start: number; end: number }; message: string }[] {
  const validate = ajv.compile(schema);
  const parsed = parse(json);
  const valid = validate(parsed.data);
  if (valid) {
    return [];
  }
  return validate.errors!.map(error => {
    const instance = parsed.pointers[error.instancePath];
    console.log({ instance })
    const { line, column } = instance.value;
    return {
      range: {
        start: instance.value,
        end: instance.valueEnd,
      },
      message: `${error.message} at line ${line + 1}, column ${column}`,
    };
  });
}
