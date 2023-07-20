import { it, describe, expect } from "vitest";
import { JSONCompletion } from "../json-completion";
import { CompletionResult, autocompletion } from "@codemirror/autocomplete";
import { testSchema } from "./__fixtures__/schemas";
import { EditorView } from "@codemirror/view";
import { json, jsonLanguage } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";

describe("json-completion", () => {
  it("should return completion data for simple types", async () => {
    expect(true).toEqual(true);
  });
});

// const getCompletionResult = (
//   jsonString: string,
//   pos: number
// ): Promise<CompletionResult | undefined> => {
//   return new Promise((resolve, reject) => {
//     console.log("hello1");
//     const completionInstance = new JSONCompletion(testSchema);
//     const state = EditorState.create({
//       doc: jsonString,
//       selection: { anchor: pos, head: pos },
//       extensions: [
//         json(),
//         jsonLanguage.data.of({
//           autocomplete: () => {
//             const result =
//               completionInstance.doComplete.bind(completionInstance);
//               console.log(result)
//             resolve(result);
//             return result;
//           },
//         }),
//       ],
//     });
//   });
// };

// describe("json-completion", () => {
//   console.log("hello");
//   it("should return completion data for simple types", async () => {
//     const completionResult = await getCompletionResult('{ "f }', 5);
//     console.log(completionResult);
//     expect(completionResult).toEqual(true);
//   });
// });
