Codemirror extensions that add on `@codemirror/lang-json`'s and `codemirror-json5`'s grammars to add JSONSchema support!

![screenshot of the examples with json4 and json5 support enabled](./dev/public/example.png)

## Features

It's at a very early stage, but usable.

### json4

- ✅ `lint`s: validates json against schema
- ✅ `hint`s: provides code completion (no complex types yet)
- ✅ `info`s: provides hover tooltip

### json5

- ✅ `lint`s: validates json against schema
- ✅ `info`s: provides hover tooltip

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
    linter(jsonParseLinter()),
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

```ts
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { json5, json5ParseLinter } from "codemirror-json5";
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
  doc: `{ example: true }`,
  extensions: [
    json5(),
    linter(json5ParseLinter()),
    linter(json5SchemaLinter(schema)),
    hoverTooltip(json5SchemaHover(schema)),
  ],
});
```

### Demo

You can start with the [deployed example](https://github.com/acao/cm6-json-schema/blob/main/dev/index.ts) to see a more comprehensive setup.

### API Docs

For more information, see the [API Docs](./docs/)

## Current Constraints:

- only linting & hover is available for `oneOf`, `anyOf`, `allOf` and other [schema combination methods](https://json-schema.org/understanding-json-schema/reference/combining.html)
- it only works with one json schema instance at a time, and doesn't yet fetch remote schemas. schema service coming soon!
- currently only tested with standard schemas using json4 spec. results may vary
- doesn't provide insert text on completion yet
- currently you can override the rendering of a hover. we plan to add the same for validation errors and autocomplete

## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!

also, json5 is slowly growing in usage, and it needs full language support!

## Our Goals

- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
- json5 + json4 json schema features for all!
