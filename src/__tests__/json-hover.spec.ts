import * as matchers from "vitest-dom/matchers";
import { describe, it, expect } from "vitest";
expect.extend(matchers);
import "vitest-dom/extend-expect";

import { JSONSchema7 } from "json-schema";
import { JSONHover } from "../json-hover";

import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { testSchema, testSchema2 } from "./__fixtures__/schemas";

const getHoverData = (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({ doc: jsonString, extensions: [json()] });
  return new JSONHover(schema || testSchema).getDataForCursor(view, pos, 1);
};

const getHoverResult = async (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({ doc: jsonString, extensions: [json()] });
  const hoverResult = await new JSONHover(schema || testSchema).doHover(
    view,
    pos,
    1
  );
  return hoverResult;
};

describe("JSONHover#getDataForCursor", () => {
  it("should return schema descriptions as expected", () => {
    expect(
      getHoverData('{"object": { "foo": true }, "bar": 123}', 14, testSchema2)
    ).toEqual({
      pointer: "/object/foo",
      schema: {
        description: "an elegant string",
        type: "string",
      },
    });
  });
});

describe("JSONHover#doHover", () => {
  it("should return Tooltip data", async () => {
    const hoverResult = await getHoverResult(
      '{"object": { "foo": true }, "bar": 123}',
      14,
      testSchema2
    );
    expect(hoverResult).toEqual({
      above: true,
      arrow: true,
      end: 14,
      pos: 14,
      create: expect.any(Function),
    });
    const hoverEl = hoverResult?.create(new EditorView({})).dom;
    expect(hoverEl).toContainHTML(
      '<div class="cm6-json-schema-hover"><div>an elegant string</div><div><code>string</code></div></div>'
    );
  });
  it("should not fail for oneOf", async () => {
    const hoverResult = await getHoverResult(
      '{"oneOfEg": { "foo": true }, "bar": 123}',
      3,
      testSchema2
    );
    expect(hoverResult).toBeTruthy();
  });
});
