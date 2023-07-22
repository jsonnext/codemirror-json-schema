Codemirror 6 extensions that provide full [JSON Schema](https://json-schema.org/) support for `@codemirror/lang-json` & `codemirror-json5` language modes

<a href="https://npmjs.com/codemirror-json-schema">
<img alt="npm" src="https://img.shields.io/npm/dm/codemirror-json-schema?label=npm%20downloads">
</a>

![screenshot of the examples with json4 and json5 support enabled](./dev/public/example.png)

## Features

This is now a full-featured library for both json4 (aka json) and json5, but the APIs may still have breakages.

So far mostly tested with standard json4 schema specs. See

### json4

- ✅ validates json
- ✅ autocompletion
- ✅ hover tooltips from schema

### json5

- ✅ validates json5
- ✅ autocompletion
- ✅ hover tooltips

## Usage

To give you as much flexibility as possible, everything codemirror related is a peer or optional dependency

Based on whether you want to support json4, json5 or both, you will need to install the relevant language mode for our library to use.

### json4

with `auto-install-peers true` or similar:

```
npm install --save @codemirror/lang-json codemirror-json-schema
```

without `auto-install-peers true`:

```
npm install --save @codemirror/lang-json codemirror-json-schema @codemirror/language @codemirror/lint @codemirror/view @codemirror/state @lezer/common
```

#### Minimal Usage

This sets up `@codemirror/lang-json` and our extension for you.
If you'd like to have more control over the related configurations, see custom usage below

```ts
import { EditorState } from "@codemirror/state";
import { jsonSchema } from "codemirror-json-schema";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const json5State = EditorState.create({
  doc: "{ example: true }",
  extensions: [jsonSchema(schema)],
});
```

#### Custom Usage

This approach allows you to configure the json mode and parse linter, as well as our linter, hovers, etc more specifically.

```ts
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { jsonSchemaLinter, jsonSchemaHover } from "codemirror-json-schema";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const state = EditorState.create({
  doc: `{ "example": true }`,
  extensions: [
    json(),
    linter(jsonParseLinter(), {
      // default is 750ms
      delay: 300
    }),
    linter(jsonSchemaLinter(schema)),
    jsonLanguage.data.of({
      autocomplete: jsonCompletion(schema),
    }),
    hoverTooltip(jsonSchemaHover(schema)),
  ];
})
```

### json5

with `auto-install-peers true` or similar:

```
npm install --save codemirror-json5 codemirror-json-schema
```

without `auto-install-peers true`:

```
npm install --save codemirror-json5 codemirror-json-schema @codemirror/language @codemirror/lint @codemirror/view @codemirror/state @lezer/common
```

#### Minimal Usage

This sets up `codemirror-json5` mode for you.
If you'd like to have more control over the related configurations, see custom usage below

```ts
import { EditorState } from "@codemirror/state";
import { json5Schema } from "codemirror-json-schema/json5";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const json5State = EditorState.create({
  doc: `{
    example: true,
    // json5 is awesome!
  }`,
  extensions: [json5Schema(schema)],
});
```

#### Custom Usage

This approach allows you to configure the json5 mode and parse linter, as well as our linter, hovers, etc more specifically.

```ts
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { json5, json5ParseLinter, json5Language } from "codemirror-json5";
import { jsonCompletion } from "codemirror-json-schema";
import {
  json5SchemaLinter,
  json5SchemaHover,
} from "codemirror-json-schema/json5";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const json5State = EditorState.create({
  doc: `{
    example: true,
    // json5 is awesome!
  }`,
  extensions: [
    json5(),
    linter(json5ParseLinter(), {
      // the default linting delay is 750ms
      delay: 300,
    }),
    linter(json5SchemaLinter(schema)),
    hoverTooltip(json5SchemaHover(schema)),
    json5Language.data.of({
      autocomplete: jsonCompletion(schema),
    }),
  ],
});
```

### Complete demo

You can start with the [deployed example](https://github.com/acao/cm6-json-schema/blob/main/dev/index.ts) to see a more comprehensive setup.

### API Docs

For more information, see the [API Docs](./docs/)

## Current Constraints:

- it only works with one json schema instance at a time, and doesn't yet fetch remote schemas. schema service coming soon!
- currently only tested with standard schemas using json4 spec. results may vary
- doesn't place cursor inside known insert text yet
- currently you can only override the texts and rendering of a hover. we plan to add the same for validation errors and autocomplete
- json5 properties on autocompletion selection will insert surrounding double quotes, but we plan to make it insert without delimiters

## Inspiration

`monaco-json` and `monaco-yaml` both provide json schema features for json, cson and yaml, and we want the nascent codemirror 6 to have them as well!

Also, json5 is slowly growing in usage, and it needs full language support for the browser!

## Our Goals

- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
- json5 support for `graphiql` as a plugin!
- perhaps use @lezer to make a json5 language service for monaco-editor + json5?
- json5 + json4 json schema features for all!
