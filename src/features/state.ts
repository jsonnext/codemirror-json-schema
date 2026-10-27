import { type EditorState, StateEffect, StateField } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { JSONSchema7 } from "json-schema";
import type { SchemaNode } from "json-schema-library";
import { normalizeRefSiblings } from "../utils/normalize-schema";

const schemaEffect = StateEffect.define<JSONSchema7 | undefined>();

export const schemaStateField = StateField.define<JSONSchema7 | void>({
  create() {},
  update(schema, tr) {
    for (const e of tr.effects) {
      if (e.is(schemaEffect)) {
        return e.value;
      }
    }

    return schema;
  },
});

export const updateSchema = (view: EditorView, schema?: JSONSchema7) => {
  view.dispatch({
    effects: schemaEffect.of(schema ? normalizeRefSiblings(schema) : schema),
  });
};

export const getJSONSchema = (state: EditorState) => {
  return state.field(schemaStateField);
};

// Compiled schema with remote refs resolved
export const compiledSchemaEffect = StateEffect.define<
  SchemaNode | undefined
>();

export const compiledSchemaStateField = StateField.define<
  SchemaNode | undefined
>({
  create() {
    return undefined;
  },
  update(compiled, tr) {
    // Invalidate when raw schema changes
    for (const e of tr.effects) {
      if (e.is(schemaEffect)) {
        return undefined;
      }
      if (e.is(compiledSchemaEffect)) {
        return e.value;
      }
    }
    return compiled;
  },
});

export const getCompiledSchema = (state: EditorState) => {
  return state.field(compiledSchemaStateField, false);
};

export const updateCompiledSchema = (
  view: EditorView,
  node: SchemaNode | undefined,
) => {
  view.dispatch({
    effects: compiledSchemaEffect.of(node),
  });
};

export const stateExtensions = (schema?: JSONSchema7) => [
  schemaStateField.init(() => (schema ? normalizeRefSiblings(schema) : schema)),
  compiledSchemaStateField,
];
