import type { EditorView } from "@codemirror/view";
import type { Diagnostic } from "@codemirror/lint";
import type { JSONSchema7 } from "json-schema";
import { Draft04, type Draft, type JsonError } from "json-schema-library";
import { joinWithOr } from "./utils/formatting";
import { parseJSONDocument } from "./utils/jsonPointerForPosition";

// return an object path that matches with the json-source-map pointer
const getErrorPath = (error: JsonError): string => {
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

export class JSONValidation {
  private schema: Draft;
  public constructor(schema: JSONSchema7) {
    // TODO: support other versions of json schema.
    // most standard schemas are draft 4 for some reason, probably
    // backwards compatibility
    //
    // ajv did not support draft 4, so I used json-schema-library
    this.schema = new Draft04(schema);
  }
  private get schemaTitle() {
    return this.schema.getSchema().title ?? "json-schema";
  }

  // rewrite the error message to be more human readable
  private rewriteError = (error: JsonError): string => {
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

  // validate using view as the linter extension signature requires
  public doValidation(view: EditorView) {
    if (!this.schema) return [];
    const text = view.state.doc.toString();

    // ignore blank json strings
    if (!text || text.trim().length < 3) return [];
      
    const json = parseJSONDocument(view);

    let errors: JsonError[] = [];
    try {
      errors = this.schema.validate(json.data);
    } catch {}

    if (!errors.length) return [];
    // reduce() because we want to filter out errors that don't have a pointer
    return errors.reduce((acc, error) => {
      const errorPath = getErrorPath(error);
      const pointer = json.pointers.get(errorPath);
      if (pointer) {
        // if the error is a property error, use the key position
        const isPropertyError = error.name === "NoAdditionalPropertiesError";
        acc.push({
          from: isPropertyError ? pointer.keyFrom : pointer.valueFrom,
          to: isPropertyError ? pointer.keyTo : pointer.valueTo,
          // TODO: create a domnode and replace `` with <code></code>
          // renderMessage: () => error.message,
          message: this.rewriteError(error),
          severity: "error",
          source: this.schemaTitle,
        });
      }
      return acc;
    }, [] as Diagnostic[]);
  }
}

// TODO: this will probably be more performant.
// An attempt at using codemirror AST instead of json-source-map
// const document = syntaxTree(view.state);

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

// return validate.errors
