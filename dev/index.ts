import { EditorState } from "@codemirror/state";
import {
  gutter,
  EditorView,
  lineNumbers,
  hoverTooltip,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { history } from "@codemirror/commands";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { linter, lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import { JSONSchema7 } from "json-schema";

// sample data
import { jsonText, json5Text } from "./sample-text";
import packageJsonSchema from "./package.schema.json";

// json4
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { jsonSchemaLinter, jsonSchemaHover, jsonCompletion } from "../src";

// json5
import { json5, json5ParseLinter } from "codemirror-json5";
import { json5SchemaLinter, json5SchemaHover } from "../src/json5";

const schema = packageJsonSchema as JSONSchema7;

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

const state = EditorState.create({
  doc: jsonText,
  extensions: [
    ...commonExtensions,
    json(),
    linter(jsonParseLinter()),
    linter(jsonSchemaLinter(schema)),
    jsonLanguage.data.of({
      autocomplete: jsonCompletion(schema),
    }),
    hoverTooltip(jsonSchemaHover(schema)),
  ],
});

new EditorView({
  state,
  parent: document.querySelector("#editor")!,
});

const json5State = EditorState.create({
  doc: json5Text,
  extensions: [
    ...commonExtensions,
    json5(),
    linter(json5ParseLinter()),
    linter(json5SchemaLinter(schema)),
    hoverTooltip(json5SchemaHover(schema)),
  ],
});

new EditorView({
  state: json5State,
  parent: document.querySelector("#editor-json5")!,
});

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }
