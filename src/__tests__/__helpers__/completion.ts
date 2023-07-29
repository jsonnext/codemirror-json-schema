import { describe, it, expect, vitest, Mock } from "vitest";

import { json, jsonLanguage } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import {
  Completion,
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { jsonCompletion } from "../../json-completion";
import { JSONSchema7 } from "json-schema";
import { testSchema2 } from "../__fixtures__/schemas";
import { EditorView } from "@codemirror/view";

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
  schema?: JSONSchema7,
  conf: { explicit?: boolean } = {}
) {
  let cur = doc.indexOf("|"),
    currentSchema = schema || testSchema2;
  doc = doc.slice(0, cur) + doc.slice(cur + 1);
  let state = EditorState.create({
    doc,
    selection: { anchor: cur },
    extensions: [
      json(),
      jsonLanguage.data.of({
        autocomplete: jsonCompletion(currentSchema),
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
