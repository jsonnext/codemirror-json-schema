import { EditorView } from "@codemirror/view";
import { Text } from "@codemirror/state";
import { Diagnostic } from "@codemirror/lint";
import { JSONSchema7 } from "json-schema";
import { Draft04, Draft, JsonError } from "json-schema-library";
import JsonMap from "json-source-map";

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

const getErrorPath = (error: JsonError) => {
  // if a pointer is present, return without #
  if (error?.data?.pointer && error?.data?.pointer !== "#") {
    return error.data.pointer.slice(1);
  }
  // return plain data.property if present
  if (error?.data?.property) {
    return `/${error.data.property}`;
  }
  // else, return the pointer to represent the whole document
  return "";
};

const joinWithOr = (arr: string[], getPath?: (err: any) => any) => {
  const needsComma = arr.length > 2;
  let data = arr.map((err: any, i: number) => {
    const result = `\`` + (getPath ? JSON.stringify(getPath(err)) : err) + `\``;
    if (i === arr.length - 1) return "or " + result ;
    return result;
  });
  if (needsComma) {
    return data.join(", ");
  }
  return data.join(" ");
};

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
  const message = error.message
    .replaceAll("#/", "")
    .replace('/', ".")

  return message;
};

export function getRangeForJSONErrors(
  view: EditorView,
  schema: Draft
): Diagnostic[] {
  if (!schema) return [];

  // first see if the json can parse
  let json: any;
  const text = view.state.doc.toString();

  // ignore blank texts
  if (!text) return [];

  try {
    json = JsonMap.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // parse the error message and report the line numbers
      const pos = getErrorPosition(error as SyntaxError, view.state.doc);

      return [
        {
          from: pos,
          to: pos + 1,
          severity: "error",
          message: error.message,
          source: 'SyntaxError'
        },
      ];
    }
  }
  let errors: JsonError[] = [];
  try {
    errors = schema.validate(json.data);
  } catch {}

  if (!errors.length) return [];
  return errors.reduce((acc: Diagnostic[], error) => {
    const errorPath = getErrorPath(error);
    let pointer = json.pointers[errorPath];
    if (errorPath && pointer) {
      const isPropertyError = error.name === "NoAdditionalPropertiesError";
      acc.push({
        from: isPropertyError ? pointer.key.pos : pointer.value.pos,
        to: isPropertyError ? pointer.keyEnd.pos : pointer.valueEnd.pos,
        // renderMessage: () => error.message,
        message: rewriteError(error),
        severity: "error",
        source: `${schema.getSchema().title ?? "json-schema"}`,
      } as Diagnostic);
    }
    return acc;
  }, []);
}

export class JSONValidation {
  private _schema: Draft;
  public constructor(private schema: JSONSchema7) {
    this._schema = new Draft04(schema);
  }
  public doValidation(view: EditorView) {
    return getRangeForJSONErrors(view, this._schema);
  }
}

// the attempt at using codemirror AST
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
