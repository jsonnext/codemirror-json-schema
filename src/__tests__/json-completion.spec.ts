import { describe, it, expect } from "vitest";

import { json, jsonLanguage } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { jsonCompletion } from "../json-completion";
import { JSONSchema7 } from "json-schema";
import { testSchema2 } from "./__fixtures__/schemas";

async function expectCompletion(
  doc: string,
  results: CompletionResult["options"],
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
  let result = await state.languageDataAt<CompletionSource>(
    "autocomplete",
    cur
  )[0](new CompletionContext(state, cur, !!conf.explicit));
  if (!result) {
    return expect(result).toEqual(results);
  }

  const filteredResults = result.options.map(
    ({ detail, info, label, type }) => ({ detail, info, label, type })
  );
  expect(filteredResults).toEqual(results);
}

describe("jsonCompletion", () => {
  console.log("hello");
  it("should return completion data for simple types", async () => {
    await expectCompletion('{ "f| }', [
      {
        label: "foo",
        type: "property",
        detail: "string",
        info: "",
      },
    ]);
  });
  it("should return completion data for simple types", async () => {
    await expectCompletion('{ "one| }', [
      {
        label: "oneOfEg",
        type: "property",
        detail: "",
        info: "an example oneOf",
      },
      {
        label: "oneOfEg2",
        type: "property",
        detail: "",
        info: "",
      },
    ]);
  });
});
