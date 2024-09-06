import { EditorState } from "@codemirror/state";
import {
  gutter,
  EditorView,
  lineNumbers,
  drawSelection,
  keymap,
  highlightActiveLineGutter,
  ViewUpdate,
} from "@codemirror/view";
import { lintKeymap, lintGutter } from "@codemirror/lint";
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
import { jsonText, json5Text, yamlText } from "./sample-text";
import packageJsonSchema from "./package.schema.json";

// json4
import { jsonSchema, updateSchema } from "../src/index";

// json5
import { json5Schema } from "../src/json5";

import { yamlSchema } from "../src/yaml";

const schema = packageJsonSchema as JSONSchema7;
const ls = localStorage;

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

const persistEditorStateOnChange = (key: string) => {
  return EditorView.updateListener.of(
    debounce((v: ViewUpdate) => {
      if (v.docChanged) {
        ls.setItem(key, v.state.doc.toString());
      }
    }, 300),
  );
};

/**
 * json4!
 */

const state = EditorState.create({
  doc: ls.getItem("json4") ?? jsonText,
  extensions: [
    commonExtensions,
    jsonSchema(schema),
    persistEditorStateOnChange("json4"),
  ],
});

const editor1 = new EditorView({
  state,
  parent: document.querySelector("#editor-json")!,
});

/**
 * json5!
 */
const json5State = EditorState.create({
  doc: ls.getItem("json5") ?? json5Text,
  extensions: [
    commonExtensions,
    json5Schema(schema),
    persistEditorStateOnChange("json5"),
  ],
});

const editor2 = new EditorView({
  state: json5State,
  parent: document.querySelector("#editor-json5")!,
});

/**
 * yaml!
 */
const yamlState = EditorState.create({
  doc: ls.getItem("yaml") ?? yamlText,
  extensions: [
    commonExtensions,
    yamlSchema(schema),
    persistEditorStateOnChange("yaml"),
  ],
});

const editor3 = new EditorView({
  state: yamlState,
  parent: document.querySelector("#editor-yaml")!,
});

const handleSchemaChange = (newSchema: JSONSchema7) => {
  updateSchema(editor1, newSchema);
  updateSchema(editor2, newSchema);
  updateSchema(editor3, newSchema);
};

const schemaCache = new Map<string, JSONSchema7>([["package.json", schema]]);

const getSchema = async (val: string) => {
  const cachedSchema = schemaCache.get(val);
  if (cachedSchema) {
    handleSchemaChange(cachedSchema);
    return;
  }

  const data = await (
    await fetch(`https://json.schemastore.org/${val}`)
  ).json();
  schemaCache.set(val, data);
  handleSchemaChange(data);
};

const schemaSelect = document.getElementById("schema-selection");
const schemaValue = localStorage.getItem("selectedSchema")!;

const setFileName = (value: any) => {
  document.querySelectorAll("h2 code span").forEach((el) => {
    el.textContent = value;
  });
};

(async () => {
  if (schemaValue) {
    schemaSelect!.value = schemaValue;
    await getSchema(schemaValue);
    document.querySelectorAll("h2 code span").forEach((el) => {
      el.textContent = schemaValue.split(".")[0];
    });
    setFileName(schemaValue.split(".")[0]);
  }
})();

schemaSelect!.onchange = async (e) => {
  const val = e.target!.value!;
  if (!val) {
    return;
  }
  ls.setItem("selectedSchema", val);
  await getSchema(val);
  setFileName(val.split(".")[0]);
};

function debounce(fn: Function, ms: number) {
  let timeout: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => fn.apply(this, args), ms);
  };
}
