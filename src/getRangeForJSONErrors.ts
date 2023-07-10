// using ajv and json-source-map, provide a function that returns the ranges and messages
// for json schema validation errors in json strings
// it should provide line numbers and columns for the errors
// it should provide the error messages

import Ajv from "ajv";
import { JSONSchema7 } from "json-schema";
import { ParsedJSON, Position, parse } from "json-source-map";
import type { Text } from "@codemirror/state";

const ajv = new Ajv({ allErrors: true })

/**
 * from https://github.com/codemirror/lang-json/blob/main/src/lint.ts
 */
function getErrorPosition(error: SyntaxError, doc: Text): Position {
  let m;
  if ((m = error.message.match(/at position (\d+)/))) {
    const pos = Math.min(+m[1], doc.length);
    return { column: pos, pos, line: 0 };
  }
  if ((m = error.message.match(/at line (\d+) column (\d+)/))) {
    const pos = Math.min(doc.line(+m[1]).from + +m[2] - 1, doc.length);
    return { column: +m[2] - 1, pos, line: doc.line(+m[1]).number };
  }
  if ((m = error.message.match(/Unexpected end of JSON input (\d+)/))) {
    const pos = doc.length;
    return { column: pos, pos, line: 0 };
  }
  return { pos: 0, column: 0, line: 0 };
}

export function getRangeForJSONErrors(
  json: Text,
  schema: JSONSchema7
): { range: { start: Position; end: Position }; message: string }[] {
  const validate = ajv.compile(schema);
  let parsed: ParsedJSON;
  try {
    parsed = parse(json.toString());
  } catch (err) {
    if (err instanceof SyntaxError) {
      const pos = getErrorPosition(err, json);
      return [
        {
          range: {
            start: pos,
            end: { ...pos, column: +pos.column },
          },
          message: err.message,
        },
      ];
    }
    return [];
  }
  const valid = validate(parsed.data);
  if (valid) {
    return [];
  }
  return validate.errors!.map((error) => {
    const instance = parsed.pointers[error.instancePath];
    console.log({ instance });
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
