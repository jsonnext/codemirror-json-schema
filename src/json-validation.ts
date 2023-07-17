import { EditorView } from "@codemirror/view";
import { Text } from "@codemirror/state";
import { Diagnostic } from "@codemirror/lint";
import { JSONSchema7 } from "json-schema";
import { Draft04, Draft, JsonError } from "json-schema-library";
import JsonMap from "json-source-map";

// from @codemirror/lang-json jsonParseLinter
function getErrorPosition(error: SyntaxError, doc: Text): number {
  let m;
  if ((m = error.message.match(/at position (\d+)/))) {
    return Math.min(+m[1], doc.length);
  }
  if ((m = error.message.match(/at line (\d+) column (\d+)/))) {
    return Math.min(doc.line(+m[1]).from + +m[2] - 1, doc.length);
  }
  return 0;
}
// return an object path that matches with the json-source-map pointer
const getErrorPath = (error: JsonError) => {
  // if a pointer is present, return without #
  if (error?.data?.pointer && error?.data?.pointer !== "#") {
    return error.data.pointer.slice(1);
  }
  // return plain data.property if present
  if (error?.data?.property) {
    return `/${error.data.property}`;
  }
  // else, return the empty pointer to represent the whole document
  return "";
};

// a little english-centric utility
// to join members of an array with commas and "or"
const joinWithOr = (arr: string[], getPath?: (err: any) => any) => {
  const needsComma = arr.length > 2;
  let data = arr.map((err: any, i: number) => {
    const result = `\`` + (getPath ? JSON.stringify(getPath(err)) : err) + `\``;
    if (i === arr.length - 1) return "or " + result;
    return result;
  });
  if (needsComma) {
    return data.join(", ");
  }
  return data.join(" ");
};

// rewrite the error message to be more readable
const rewriteError = (error: JsonError): string => {
  if (error.code === "one-of-error") {
    return `Expected one of ${joinWithOr(
      error?.data?.errors,
      (data) => data.data.expected
    )}`;
  }
  if (error.code === "type-error") {
    return `Expected \`${
      error?.data?.expected && Array.isArray(error?.data?.expected)
        ? joinWithOr(error?.data?.expected)
        : error?.data?.expected
    }\` but received \`${error?.data?.received}\``;
  }
  const message = error.message.replaceAll("#/", "").replace("/", ".");

  return message;
};

// get the errors with locations
// from the json schema library and json-source-map
export function getJSONValidationErrors(
  view: EditorView,
  schema: Draft
): Diagnostic[] {
  if (!schema) return [];

  // first see if the json can parse
  let json = {} as JsonMap.ParsedJSON;
  const text = view.state.doc.toString();

  // ignore blank texts
  if (!text) return [];

  try {
    json = JsonMap.parse(text);
  } catch {
    // skip because @codemirror/lang-json already provides syntax error handling
  }
  if (!json.data) {
    return [];
  }
  let errors: JsonError[] = [];
  try {
    errors = schema.validate(json.data);
  } catch {}

  if (!errors.length) return [];
  // reduce() because we want to filter out errors that don't have a pointer
  return errors.reduce((acc, error) => {
    const errorPath = getErrorPath(error);
    const pointer = json.pointers[errorPath];
    if (pointer) {
      // if the error is a property error, use the key position
      const isPropertyError = error.name === "NoAdditionalPropertiesError";
      acc.push({
        from: isPropertyError ? pointer.key.pos : pointer.value.pos,
        to: isPropertyError ? pointer.keyEnd.pos : pointer.valueEnd.pos,
        // todo: create a domnode and replace `` with <code></code>
        // renderMessage: () => error.message,
        message: rewriteError(error),
        severity: "error",
        source: `${schema.getSchema().title ?? "json-schema"}`,
      } as Diagnostic);
    }
    return acc;
  }, [] as Diagnostic[]);
}

export class JSONValidation {
  private _schema: Draft;
  public constructor(schema: JSONSchema7) {
    // todo: support other versions of json schema.
    // most standard schemas are draft 4 for some reason.
    // ajv did not support draft 4, so I used json-schema-library
    this._schema = new Draft04(schema);
  }
  public doValidation(view: EditorView) {
    return getJSONValidationErrors(view, this._schema);
  }
}

// TODO: this will probably be more performant
// attempt at using codemirror AST instead of json-source-map
// const document = syntaxTree(view.state);

// const errorPathNames = validate.errors?.map((error) => {
//   if(error.instancePath) return error.instancePath.slice(1).replace(/\//g, '.')
//   if(error.keyword === 'additionalProperties') {
//     return error.params.additionalProperty
//   }
//   if(error.keyword === 'required') {
//     return error.params.missingProperty
//   }
// })

// const locations = {}

// document.iterate({
//   from: 0,
//   to: view.state.doc.length,
//   enter: (type, from, to) => {
//     console.log(type.type.name)
//     let key = ''
//     if(type.type.name === 'Object') {
//     }
//     if(type.type.name === 'PropertyName') {
//       const original = view.state.doc.sliceString(
//         type.from,
//         type.to
//       );
//       console.log(original)
//       let parent = false;

//       return true
//     }
//     return true
//   },
// })

// return validate.errors?.map((error) => {

//  return error
// })
