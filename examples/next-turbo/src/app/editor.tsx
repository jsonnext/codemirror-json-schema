"use client";
import { EditorState } from "@codemirror/state";
import { useEffect, useRef } from "react";

import { gutter, EditorView, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { history } from "@codemirror/commands";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import { JSONSchema7 } from "json-schema";

// sample data
import { jsonText } from "../../../../dev/sample-text";
import packageJsonSchema from "../../../../dev/package.schema.json";

// json4
import { jsonSchema } from "../../../../dist";

console.log({ jsonSchema });

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

// because of react strict mode
let isRendered = false;

export const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const state = EditorState.create({
    doc: jsonText,
    extensions: [commonExtensions, jsonSchema(schema)],
  });

  useEffect(() => {
    if (editorRef.current && !isRendered) {
      new EditorView({
        state,
        parent: editorRef.current!,
      });
      isRendered = true;
    }

    return () => {
      // editorRef.current?.remove();
    };
  }, [editorRef.current]);
  return <div ref={editorRef}></div>;
};
