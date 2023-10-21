import { EditorState, StateEffect, StateField } from "@codemirror/state";
import {
  gutter,
  EditorView,
  lineNumbers,
  drawSelection,
  keymap,
  highlightActiveLineGutter,
} from "@codemirror/view";
// import { basicSetup } from "@codemirror/basic-setup";
import { lintGutter } from "@codemirror/lint";
import { lintKeymap } from "@codemirror/lint";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";

import { JSONSchema7 } from "json-schema";

// sample data
import { jsonText, json5Text } from "./sample-text";
import packageJsonSchema from "./package.schema.json";

// json4
import { jsonSchema, updateSchema } from "../src/index";

// json5
import { json5Schema } from "../src/json5";

const schema = packageJsonSchema as JSONSchema7;

/**
 * none of these are required for json4 or 5
 * but they will improve the DX
 */
const commonExtensions = [
  gutter({ class: "CodeMirror-lint-markers" }),
  bracketMatching(),
  highlightActiveLineGutter(),
  // basicSetup,
  closeBrackets(),
  history(),
  autocompletion(),
  lineNumbers(),
  lintGutter(),
  indentOnInput(),
  drawSelection(),
  foldGutter(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),

  oneDark,
  EditorView.lineWrapping,
  EditorState.tabSize.of(2),
  syntaxHighlighting(oneDarkHighlightStyle),
];

/**
 * json4!
 */

const state = EditorState.create({
  doc: jsonText,
  extensions: [commonExtensions, jsonSchema(schema)],
});

const editor1 = new EditorView({
  state,
  parent: document.querySelector("#editor")!,
});

/**
 * json5!
 */
const json5State = EditorState.create({
  doc: json5Text,
  extensions: [commonExtensions, json5Schema(schema)],
});

const editor2 = new EditorView({
  state: json5State,
  parent: document.querySelector("#editor-json5")!,
});

const handleSchemaChange = (newSchema: JSONSchema7) => {
  updateSchema(editor1, newSchema);
  updateSchema(editor2, newSchema);
};

// new EditorState.fi(editor1, editor2);
// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }

const schemaSelect = document.getElementById("schema-selection");

schemaSelect!.onchange = async (e) => {
  const val = e.target!.value!;
  if (!val) {
    return;
  }
  const data = await (
    await fetch(`https://json.schemastore.org/${val}`)
  ).json();
  handleSchemaChange(data);
};
