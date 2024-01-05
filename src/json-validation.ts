import type { EditorView, ViewUpdate } from "@codemirror/view";
import { type Diagnostic } from "@codemirror/lint";
import { Draft04, type Draft, type JsonError } from "json-schema-library";

import { getJSONSchema, schemaStateField } from "./state.js";
import { joinWithOr } from "./utils/formatting.js";
import { JSONPointerData } from "./types.js";
import { parseJSONDocumentState } from "./utils/parseJSONDocument.js";
import { RequiredPick } from "./types.js";
import { el } from "./utils/dom.js";

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

export type JSONValidationOptions = {
  formatError?: (error: JsonError) => string;
  jsonParser?: typeof parseJSONDocumentState;
};

type JSONValidationSettings = RequiredPick<JSONValidationOptions, "jsonParser">;

export const handleRefresh = (vu: ViewUpdate) => {
  return (
    vu.startState.field(schemaStateField) !== vu.state.field(schemaStateField)
  );
};

/**
 * Helper for simpler class instantiaton
 * @group Codemirror Extensions
 */
export function jsonSchemaLinter(options?: JSONValidationOptions) {
  const validation = new JSONValidation(options);
  return (view: EditorView) => {
    return validation.doValidation(view);
  };
}

// all the error types that apply to a specific key or value
const positionalErrors = [
  "NoAdditionalPropertiesError",
  "RequiredPropertyError",
  "InvalidPropertyNameError",
  "ForbiddenPropertyError",
  "UndefinedValueError",
];

export class JSONValidation {
  private schema: Draft | null = null;

  private options: JSONValidationSettings;
  public constructor(options?: JSONValidationOptions) {
    this.options = {
      jsonParser: parseJSONDocumentState,
      ...options,
    };

    // TODO: support other versions of json schema.
    // most standard schemas are draft 4 for some reason, probably
    // backwards compatibility
    //
    // ajv did not support draft 4, so I used json-schema-library
  }
  private get schemaTitle() {
    return this.schema?.getSchema()?.title ?? "json-schema";
  }

  // rewrite the error message to be more human readable
  private rewriteError = (error: JsonError): string => {
    const errorData = error?.data;
    const errors = errorData?.errors as string[];
    if (error.code === "one-of-error" && errors?.length) {
      return `Expected one of ${joinWithOr(
        errors as string[],
        (data) => data.data.expected
      )}`;
    }
    if (error.code === "type-error") {
      return `Expected <code>${
        error?.data?.expected && Array.isArray(error?.data?.expected)
          ? joinWithOr(error?.data?.expected)
          : error?.data?.expected
      }</code> but received <code>${error?.data?.received}</code>`;
    }
    const message = error.message
      // don't mention root object
      .replaceAll("in `#` ", "")
      .replaceAll("/", ".")
      .replaceAll("#.", "")
      // replace backticks with <code> tags
      .replaceAll(/`([^`]*)`/gm, "<code>$1</code>");
    return message;
  };

  // validate using view as the linter extension signature requires
  public doValidation(view: EditorView) {
    const schema = getJSONSchema(view.state);
    if (!schema) {
      return [];
    }
    this.schema = new Draft04(schema);

    if (!this.schema) return [];
    const text = view.state.doc.toString();

    // ignore blank json strings
    if (!text || text.trim().length < 3) return [];

    const json = this.options.jsonParser(view.state);

    let errors: JsonError[] = [];
    try {
      errors = this.schema.validate(json.data);
    } catch {}
    if (!errors.length) return [];
    // reduce() because we want to filter out errors that don't have a pointer
    return errors.reduce((acc, error) => {
      const pushRoot = () => {
        const errorString = this.rewriteError(error);
        acc.push({
          from: 0,
          to: 0,
          message: errorString,
          severity: "error",
          source: this.schemaTitle,
          renderMessage: () => {
            const dom = el("div", {});
            dom.innerHTML = errorString;
            return dom;
          },
        });
      };
      const errorPath = getErrorPath(error);
      const pointer = json.pointers.get(errorPath) as JSONPointerData;
      if (
        error.name === "MaxPropertiesError" ??
        error.name === "MinPropertiesError"
      ) {
        pushRoot();
      }
      if (pointer) {
        // if the error is a property error, use the key position
        const isKeyError = positionalErrors.includes(error.name);
        const errorString = this.rewriteError(error);
        const from = isKeyError ? pointer.keyFrom : pointer.valueFrom;
        const to = isKeyError ? pointer.keyTo : pointer.valueTo;
        // skip error if no from/to value is found
        if (to !== undefined && from !== undefined) {
          acc.push({
            from,
            to,
            // TODO: create a domnode and replace `` with <code></code>
            // renderMessage: () => error.message,
            message: errorString,
            renderMessage: () => {
              const dom = el("div", {});
              dom.innerHTML = errorString;
              return dom;
            },
            severity: "error",
            source: this.schemaTitle,
          });
        }
      }
      return acc;
    }, [] as Diagnostic[]);
  }
}
