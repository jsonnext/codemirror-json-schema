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

// --- Dynamic mode ---

const dynamicDefaultDoc = `{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "my-project",
  "version": "1.0.0"
}`;

async function fetchSchemaByURL(url: string): Promise<any | undefined> {
  try {
    const res = await fetch(url);
    return res.ok ? res.json() : undefined;
  } catch {
    return undefined;
  }
}

let isDynamic = false;

function createDynamicEditor(parent: Element): EditorView {
  let activeSchemaURL: string | null = null;

  const loadSchemaFromDoc = debounce(async (view: EditorView) => {
    try {
      const text = view.state.doc.toString();
      const m = text.match(/"\$schema"\s*:\s*"([^"]+)"/);
      const url = m?.[1];
      if (!url || url === activeSchemaURL) return;
      activeSchemaURL = url;
      console.log("Loading schema:", url);
      const schema = await fetchSchemaByURL(url);
      // The editor may have been replaced while the schema loaded.
      if (schema && view === editor1) updateSchema(view, schema);
    } catch (e) {
      console.warn("Schema loading failed:", e);
    }
  }, 500);

  const view = new EditorView({
    state: EditorState.create({
      doc: ls.getItem("json4") || dynamicDefaultDoc,
      extensions: [
        commonExtensions,
        jsonSchema({
          fetchSchema: fetchSchemaByURL,
        }),
        persistEditorStateOnChange("json4"),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            loadSchemaFromDoc(update.view);
          }
        }),
      ],
    }),
    parent,
  });

  // Load schema from the initial document
  loadSchemaFromDoc(view);

  return view;
}

function createStaticEditor(
  parent: Element,
  initialSchema: JSONSchema7,
): EditorView {
  return new EditorView({
    state: EditorState.create({
      doc: ls.getItem("json4") ?? jsonText,
      extensions: [
        commonExtensions,
        jsonSchema(initialSchema),
        persistEditorStateOnChange("json4"),
      ],
    }),
    parent,
  });
}

// --- Editors ---

const jsonParent = document.querySelector("#editor-json")!;
let editor1: EditorView = createStaticEditor(jsonParent, schema);

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

// --- Schema switching ---

const handleSchemaChange = (newSchema: JSONSchema7) => {
  if (!isDynamic) updateSchema(editor1, newSchema);
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

const schemaSelect = document.getElementById(
  "schema-selection",
) as HTMLSelectElement;
const schemaValue = localStorage.getItem("selectedSchema")!;

const setFileName = (value: any) => {
  document.querySelectorAll("h2 code span").forEach((el) => {
    el.textContent = value;
  });
};

function switchToDynamic() {
  isDynamic = true;
  editor1.destroy();
  editor1 = createDynamicEditor(jsonParent);
  setFileName("dynamic");
}

function switchToStatic(val: string) {
  if (isDynamic) {
    isDynamic = false;
    editor1.destroy();
    editor1 = createStaticEditor(jsonParent, schema);
  }
  getSchema(val);
  setFileName(val.split(".")[0]);
}

(async () => {
  if (schemaValue) {
    schemaSelect.value = schemaValue;
    if (schemaValue === "__dynamic__") {
      switchToDynamic();
    } else {
      await getSchema(schemaValue);
      setFileName(schemaValue.split(".")[0]);
    }
  }
})();

schemaSelect.onchange = async (e) => {
  const val = (e.target as HTMLSelectElement).value;
  if (!val) return;
  ls.setItem("selectedSchema", val);
  if (val === "__dynamic__") {
    switchToDynamic();
  } else {
    switchToStatic(val);
  }
};

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timeout: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => fn.apply(this, args), ms);
  } as any;
}
