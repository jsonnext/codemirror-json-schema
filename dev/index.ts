import { JSONCompletion, JSONValidation } from "../src";
import { EditorState } from '@codemirror/state';
import { gutter, EditorView, lineNumbers } from '@codemirror/view';
import { basicSetup } from 'codemirror'
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets, CompletionContext } from '@codemirror/autocomplete';
import { linter, lintGutter } from '@codemirror/lint';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import {jsonText} from './sample-text';
import packageJsonSchema from './package.schema.json';
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json';
import { JSONSchema7 } from 'json-schema';

const jsonCompletion = new JSONCompletion(packageJsonSchema as JSONSchema7);
const jsonLinting =  new JSONValidation(packageJsonSchema as JSONSchema7);

const state = EditorState.create({
  doc: jsonText,
  extensions: [
    gutter({class: 'CodeMirror-lint-markers'}),
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
    json(),
    linter(jsonParseLinter()),
    linter((view) => jsonLinting.doValidation(view)),
    jsonLanguage.data.of({
      autocomplete: (ctx: CompletionContext) => jsonCompletion.doComplete(ctx),
    }),
  ],
});

new EditorView({
  state,
  parent: document.querySelector('#editor')!,
});

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }
