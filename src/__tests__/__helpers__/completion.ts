import { expect, vitest } from "vitest";

import { json, jsonLanguage } from "@codemirror/lang-json";
import { json5, json5Language } from "codemirror-json5";

import { EditorState } from "@codemirror/state";
import {
  Completion,
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { jsonCompletion } from "../../json-completion.js";
import { JSONSchema7 } from "json-schema";
import { testSchema2 } from "../__fixtures__/schemas.js";
import { EditorView } from "@codemirror/view";
import { stateExtensions } from "../../state.js";

vitest.mock("@codemirror/autocomplete", async () => {
  const mod = await vitest.importActual<
    typeof import("@codemirror/autocomplete")
  >("@codemirror/autocomplete");
  return {
    ...mod,
    snippetCompletion(template: string, completion: Completion) {
      const c = {
        ...completion,
        // pass the snippet template to the completion result
        // to make it easier to test
        TESTONLY_template: template,
      };
      return mod.snippetCompletion(template, c);
    },
  };
});

type MockedCompletionResult = CompletionResult["options"][0] & {
  template?: string;
};

export async function expectCompletion(
  doc: string,
  results: MockedCompletionResult[],

  conf: {
    explicit?: boolean;
    schema?: JSONSchema7;
    mode?: "json" | "json5";
  } = {}
) {
  let cur = doc.indexOf("|"),
    currentSchema = conf?.schema || testSchema2;
  doc = doc.slice(0, cur) + doc.slice(cur + 1);
  const jsonMode = conf?.mode === "json5" ? json5 : json;
  const jsonLang = conf?.mode === "json5" ? json5Language : jsonLanguage;

  let state = EditorState.create({
    doc,
    selection: { anchor: cur },
    extensions: [
      jsonMode(),
      stateExtensions(currentSchema),
      jsonLang.data.of({
        autocomplete: jsonCompletion({ mode: conf.mode }),
      }),
    ],
  });
  const view = new EditorView({ state });

  let result = await state.languageDataAt<CompletionSource>(
    "autocomplete",
    cur
  )[0](new CompletionContext(state, cur, !!conf.explicit));
  if (!result) {
    return expect(result).toEqual(results);
  }
  const filteredResults = result.options.map((item) => ({
    detail: item.detail,
    info: item.info,
    label: item.label,
    type: item.type,
    // @ts-expect-error
    template: item?.TESTONLY_template as string | undefined,
  }));
  expect(filteredResults).toEqual(results);
}
