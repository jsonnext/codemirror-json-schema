import * as matchers from "vitest-dom/matchers";
import { describe, it, expect } from "vitest";
expect.extend(matchers);
import "vitest-dom/extend-expect";

import { JSONSchema7 } from "json-schema";
import { FoundCursorData, JSONHover } from "../json-hover.js";

import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { testSchema, testSchema2 } from "./__fixtures__/schemas.js";
import { Draft } from "json-schema-library";
import { stateExtensions } from "../state.js";

const getHoverData = (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({
    doc: jsonString,
    extensions: [json(), stateExtensions(schema || testSchema)],
  });
  return new JSONHover().getDataForCursor(view, pos, 1);
};

const getHoverResult = async (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({
    doc: jsonString,
    extensions: [json(), stateExtensions(schema || testSchema)],
  });
  const hoverResult = await new JSONHover().doHover(view, pos, 1);
  return hoverResult;
};

const getHoverTexts = async (
  jsonString: string,
  pos: number,
  schema?: JSONSchema7
) => {
  const view = new EditorView({
    doc: jsonString,
    extensions: [json(), stateExtensions(schema || testSchema)],
  });
  const hover = new JSONHover();
  const data = hover.getDataForCursor(view, pos, 1) as FoundCursorData;
  const hoverResult = hover.getHoverTexts(data, schema as Draft);
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

describe("JSONHover#getHoverTexts", () => {
  it("should provide oneOf texts despite invalid values", async () => {
    const hoverTexts = await getHoverTexts(
      '{"oneOfEg": { "foo": true }, "bar": 123}',
      3,
      testSchema2
    );
    expect(hoverTexts).toEqual({
      message: "an example oneOf",
      typeInfo:
        "oneOf: <code>string</code>, <code>array</code>, or <code>boolean</code>",
    });
  });
  it("should provide oneOf texts with valid values", async () => {
    const hoverTexts = await getHoverTexts(
      '{"oneOfEg": { "foo": "example" }, "bar": 123}',
      3,
      testSchema2
    );
    expect(hoverTexts).toEqual({
      message: "an example oneOf",
      typeInfo:
        "oneOf: <code>string</code>, <code>array</code>, or <code>boolean</code>",
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
      arrow: true,
      end: 14,
      pos: 14,
      above: true,
      create: expect.any(Function),
    });
    const hoverEl = hoverResult?.create(new EditorView({})).dom;
    expect(hoverEl).toContainHTML(
      [
        `<div class="cm6-json-schema-hover"><div class="cm6-json-schema-hover--description">an elegant string</div>`,
        `<div class="cm6-json-schema-hover--code-wrapper"><code class="cm6-json-schema-hover--code">string</code></div></div>`,
      ].join("")
    );
  });

  it("should return just typeInfo if there is no description", async () => {
    const hoverResult = await getHoverResult('{ "foo": true }', 4, testSchema2);
    expect(hoverResult).toEqual({
      arrow: true,
      end: 4,
      pos: 4,
      above: true,
      create: expect.any(Function),
    });
    const hoverEl = hoverResult?.create(new EditorView({})).dom.toString();
    expect(hoverEl).toContain("cm6-json-schema-hover--code-wrapper");
    expect(hoverEl).toContain("cm6-json-schema-hover--code");
    expect(hoverEl).toContain("string</code>");
    expect(hoverEl).not.toContain("cm6-json-schema-hover--description");
  });
});
