import { EditorView } from "@codemirror/view";
import type { JSONSchema7 } from "json-schema";
import { describe, expect, it } from "vitest";
import { MODES } from "../../constants";
import { JSONValidation } from "../validation";
import { getExtensions } from "./__helpers__";

const integerArray: JSONSchema7 = {
  type: "array",
  items: { type: "integer" },
};

const cases: {
  name: string;
  doc: string;
  schema: JSONSchema7;
  highlighted: string;
}[] = [
  {
    name: "a property value, not its colon",
    doc: '{"count": "invalid"}',
    schema: { type: "object", properties: { count: { type: "integer" } } },
    highlighted: '"invalid"',
  },
  ...['"invalid"', "1.5", "true", "null", "{}", "[]"].map((value) => ({
    name: `an invalid array item (${value})`,
    doc: `{"values": [0, ${value}, 2]}`,
    schema: { type: "object", properties: { values: integerArray } },
    highlighted: value,
  })),
  {
    name: "a primitive item in a root array",
    doc: '[0, "invalid", 2]',
    schema: integerArray,
    highlighted: '"invalid"',
  },
  {
    name: "an item in a nested array",
    doc: '{"groups": [[0], [1, "invalid"]]}',
    schema: {
      type: "object",
      properties: { groups: { type: "array", items: integerArray } },
    },
    highlighted: '"invalid"',
  },
  {
    name: "an invalid object value without losing its property range",
    doc: '{"value": {"child": 1}}',
    schema: { type: "object", properties: { value: { type: "string" } } },
    highlighted: '{"child": 1}',
  },
  {
    name: "an additional property key with an object value",
    doc: '{"extra": {"child": 1}}',
    schema: { type: "object", additionalProperties: false },
    highlighted: '"extra"',
  },
  {
    name: "an array object missing a required property",
    doc: '[{"present": 1}]',
    schema: {
      type: "array",
      items: { type: "object", required: ["missing"] },
    },
    highlighted: '{"present": 1}',
  },
];

describe.each(Object.values(MODES))("diagnostic ranges (%s)", (mode) => {
  const languageCases =
    mode === MODES.YAML
      ? ([
          {
            name: "a block sequence item without its dash",
            doc: "values:\n  - 0\n  - invalid\n  - 2\n",
            schema: { type: "object", properties: { values: integerArray } },
            highlighted: "invalid",
          },
          {
            name: "an item in a nested block sequence",
            doc: "groups:\n  - values:\n      - 0\n      - invalid\n",
            schema: {
              type: "object",
              properties: {
                groups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { values: integerArray },
                  },
                },
              },
            },
            highlighted: "invalid",
          },
        ] satisfies typeof cases)
      : mode === MODES.JSON5
        ? ([
            {
              name: "a property value separated by comments",
              doc: "{count /* key */: /* value */ 'invalid'}",
              schema: {
                type: "object",
                properties: { count: { type: "integer" } },
              },
              highlighted: "'invalid'",
            },
          ] satisfies typeof cases)
        : [];
  it.each([...cases, ...languageCases])(
    "highlights $name",
    ({ doc, schema, highlighted }) => {
      const view = new EditorView({
        doc,
        extensions: [getExtensions(mode, schema)],
      });
      try {
        const diagnostics = new JSONValidation({ mode }).doValidation(view);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0]).toMatchObject({
          from: doc.indexOf(highlighted),
          to: doc.indexOf(highlighted) + highlighted.length,
          severity: "error",
        });
      } finally {
        view.destroy();
      }
    },
  );
});
