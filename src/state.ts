import { type EditorState, StateEffect, StateField } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { JSONSchema7 } from "json-schema";
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
    effects: schemaEffect.of(schema),
  });
};

export const getJSONSchema = (state: EditorState) => {
  return state.field(schemaStateField);
};

export const stateExtensions = (schema?: JSONSchema7) => [
  schemaStateField.init(() => schema),
];
