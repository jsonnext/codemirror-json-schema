import { JSONSchema7 } from "json-schema";
import { JSONHover } from "../json-hover";
import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { testSchema, testSchema2 } from "./__fixtures__/schemas";

const getHoverSchema = (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({ doc: jsonString, extensions: [json()] });
  return new JSONHover(schema || testSchema).getDataForCursor(view, pos, 1);
};

describe("JSONHover", () => {
  it("should return schema descriptions as expected", () => {
    expect(
      getHoverSchema('{"object": { "foo": true }, "bar": 123}', 14, testSchema2)
    ).toEqual({
      pointer: "/object/foo",
      schema: {
        description: "an elegant string",
        type: "string",
      },
    });
  });
});
