import {
  JSONCompletion,
  lintJSONSchema,
  hoverJsonSchema,
  lintJSON5Schema,
  hoverJson5Schema,
} from "../src";
import { EditorState } from "@codemirror/state";
import {
  gutter,
  EditorView,
  lineNumbers,
  hoverTooltip,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { history } from "@codemirror/commands";
import {
  autocompletion,
  closeBrackets,
  CompletionContext,
} from "@codemirror/autocomplete";
import { linter, lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import { json5, json5ParseLinter } from "codemirror-json5";
import { jsonText, json5Text } from "./sample-text";
import packageJsonSchema from "./package.schema.json";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { JSONSchema7 } from "json-schema";

const schema = packageJsonSchema as JSONSchema7;

const jsonCompletion = new JSONCompletion(packageJsonSchema as JSONSchema7);

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
    linter(lintJSONSchema(schema)),
    jsonLanguage.data.of({
      autocomplete: (ctx: CompletionContext) => jsonCompletion.doComplete(ctx),
    }),
    hoverTooltip(hoverJsonSchema(schema)),
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
    linter(lintJSON5Schema(schema)),
    hoverTooltip(hoverJson5Schema(schema)),
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
