import { JSONCompletion } from "../dist/";
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets, CompletionContext } from '@codemirror/autocomplete';
import { bracketMatching, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import {jsonText} from './sample-text';
import packageJsonSchema from './package.schema.json';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { JSONSchema7 } from 'json-schema';

const jsonCompletion = new JSONCompletion(packageJsonSchema as JSONSchema7);
const state = EditorState.create({
  doc: jsonText,
  extensions: [
    bracketMatching(),
    closeBrackets(),
    history(),
    autocompletion(),
    lineNumbers(),
    oneDark,
    syntaxHighlighting(oneDarkHighlightStyle),
    json(),
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
