import { EditorState } from "@codemirror/state";
import { gutter, EditorView, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { history } from "@codemirror/commands";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import { JSONSchema7 } from "json-schema";

// sample data
import { jsonText, json5Text } from "./sample-text";
import packageJsonSchema from "./package.schema.json";

// json4
import { jsonSchema } from "../src";

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
  basicSetup,
  closeBrackets(),
  history(),
  autocompletion(),
  lineNumbers(),
  lintGutter(),
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

new EditorView({
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

new EditorView({
  state: json5State,
  parent: document.querySelector("#editor-json5")!,
});

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }
