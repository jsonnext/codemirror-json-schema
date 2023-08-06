import { describe, it } from "vitest";

import { expectCompletion } from "./__helpers__/completion";

describe("jsonCompletion", () => {
  it("should return completion data for simple types", async () => {
    await expectCompletion('{ "f| }', [
      {
        label: "foo",
        type: "property",
        detail: "string",
        info: "",
        template: '"foo": "#{}"',
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
        template: '"oneOfEg": ',
      },
      {
        label: "oneOfEg2",
        type: "property",
        detail: "",
        info: "",
        template: '"oneOfEg2": ',
      },
      {
        detail: "",
        info: "",
        label: "oneOfObject",
        template: '"oneOfObject": ',
        type: "property",
      },
    ]);
  });
  it("should include defaults for enum when available", async () => {
    await expectCompletion('{ "en| }', [
      {
        label: "enum1",
        type: "property",
        detail: "",
        info: "an example enum with default bar",
        template: '"enum1": "${bar}"',
      },
      {
        label: "enum2",
        type: "property",
        detail: "",
        info: "an example enum without default",
        template: '"enum2": #{}',
      },
    ]);
  });
  it("should include value completions for enum", async () => {
    await expectCompletion('{ "enum1": "|" }', [
      {
        label: '"foo"',
        info: "an example enum with default bar",
      },
      {
        label: '"bar"',
        detail: "Default value",
      },
    ]);
  });
  it("should include defaults for boolean when available", async () => {
    await expectCompletion('{ "booleanW| }', [
      {
        type: "property",
        detail: "boolean",
        info: "an example boolean with default",
        label: "booleanWithDefault",
        template: '"booleanWithDefault": ${true}',
      },
    ]);
  });
  // TODO: should provide true/false completions
  it("should include value completions for boolean", async () => {
    await expectCompletion('{ "booleanWithDefault": | }', []);
  });
  it("should include insert text for objects", async () => {
    await expectCompletion('{ "ob| }', [
      {
        type: "property",
        detail: "object",
        info: "",
        label: "object",
        template: '"object": {#{}}',
      },
    ]);
  });
  // this has regressed for json4 only for some reason
  it("should include insert text for nested object properties", async () => {
    await expectCompletion('{ "object": { "|" } }', [
      {
        detail: "string",
        info: "an elegant string",
        label: "foo",
        template: '"foo": "#{}"',
        type: "property",
      },
    ]);
  });
  // TODO: accidentally steps up to the parent pointer
  it.skip("should include insert text for nested object properties", async () => {
    await expectCompletion(`{ "object": { '| } }`, [
      {
        detail: "string",
        info: "an elegant string",
        label: "foo",
        template: '"foo": "#{}"',
        type: "property",
      },
    ]);
  });
  it("should include insert text for nested object properties with filter", async () => {
    await expectCompletion('{ "object": { "f|" } }', [
      {
        detail: "string",
        info: "an elegant string",
        label: "foo",
        template: '"foo": "#{}"',
        type: "property",
      },
    ]);
  });
  it("should autocomplete for oneOf with nested definitions and filter", async () => {
    await expectCompletion('{ "oneOfObject": { "f|" } }', [
      {
        detail: "string",
        info: "",
        label: "foo",
        template: '"foo": "#{}"',
        type: "property",
      },
    ]);
  });
  it("should autocomplete for oneOf with nested definitions", async () => {
    await expectCompletion('{ "oneOfObject": { "|" } }', [
      {
        detail: "string",
        info: "",
        label: "foo",
        template: '"foo": "#{}"',
        type: "property",
      },
      {
        detail: "number",
        info: "",
        label: "bar",
        template: '"bar": #{0}',
        type: "property",
      },
      {
        detail: "string",
        info: "",
        label: "apple",
        template: '"apple": "#{}"',
        type: "property",
      },
      {
        detail: "number",
        info: "",
        label: "banana",
        template: '"banana": #{0}',
        type: "property",
      },
    ]);
    it("should autocomplete for oneOf without quotes", async () => {
      await expectCompletion('{ "oneOfObject": { | } }', [
        {
          detail: "string",
          info: "",
          label: "foo",
          template: '"foo": "#{}"',
          type: "property",
        },
        {
          detail: "number",
          info: "",
          label: "bar",
          template: '"bar": #{0}',
          type: "property",
        },
        {
          detail: "string",
          info: "",
          label: "apple",
          template: '"apple": "#{}"',
          type: "property",
        },
        {
          detail: "number",
          info: "",
          label: "banana",
          template: '"banana": #{0}',
          type: "property",
        },
      ]);
    });
  });
});

describe("json5Completion", () => {
  it("should return bare property key when no quotes are used", async () => {
    await expectCompletion(
      "{ f| }",
      [
        {
          label: "foo",
          type: "property",
          detail: "string",
          info: "",
          template: "foo: '#{}'",
        },
      ],
      { mode: "json5" }
    );
  });
  it("should return template for '", async () => {
    await expectCompletion(
      "{ 'one|' }",
      [
        {
          label: "oneOfEg",
          type: "property",
          detail: "",
          info: "an example oneOf",
          template: "'oneOfEg': ",
        },
        {
          label: "oneOfEg2",
          type: "property",
          detail: "",
          info: "",
          template: "'oneOfEg2': ",
        },
        {
          detail: "",
          info: "",
          label: "oneOfObject",
          template: "'oneOfObject': ",
          type: "property",
        },
      ],
      { mode: "json5" }
    );
  });
  it("should include defaults for enum when available", async () => {
    await expectCompletion(
      '{ "en|" }',
      [
        {
          label: "enum1",
          type: "property",
          detail: "",
          info: "an example enum with default bar",
          template: '"enum1": "${bar}"',
        },
        {
          label: "enum2",
          type: "property",
          detail: "",
          info: "an example enum without default",
          template: '"enum2": #{}',
        },
      ],
      { mode: "json5" }
    );
  });
  it("should include defaults for boolean when available", async () => {
    await expectCompletion(
      "{ booleanW| }",
      [
        {
          type: "property",
          detail: "boolean",
          info: "an example boolean with default",
          label: "booleanWithDefault",
          template: "booleanWithDefault: ${true}",
        },
      ],
      { mode: "json5" }
    );
  });
  it("should include insert text for nested object properties", async () => {
    await expectCompletion(
      "{ object: { f|  }",
      [
        {
          type: "property",
          detail: "string",
          info: "an elegant string",
          label: "foo",
          template: "foo: '#{}'",
        },
      ],
      { mode: "json5" }
    );
  });
  it("should include insert text for nested oneOf object properties with a single quote", async () => {
    await expectCompletion(
      "{ oneOfObject: { '|'  }",
      [
        {
          type: "property",
          detail: "string",
          info: "",
          label: "foo",
          template: "'foo': '#{}'",
        },
        {
          type: "property",
          detail: "number",
          info: "",
          label: "bar",
          template: "'bar': #{0}",
        },
        {
          type: "property",
          detail: "string",
          info: "",
          label: "apple",
          template: "'apple': '#{}'",
        },
        {
          type: "property",
          detail: "number",
          info: "",
          label: "banana",
          template: "'banana': #{0}",
        },
      ],
      { mode: "json5" }
    );
  });
});
