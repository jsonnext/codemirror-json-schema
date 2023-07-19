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

You will need to install the relevant language mode for our library to use.

### json4

```
npm install --save @codemirror/lang-json codemirror-json-schema
```

```ts
import { json } from "@codemirror/lang-json";
import { jsonSchemaLinting, jsonSchemaHover } from "codemirror-json-schema";

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

```
npm install --save codemirror-json codemirror-json-schema json5
```

```ts
import { json5 } from "codemirror-json5";
import {
  jsonSchemaLinting,
  jsonSchemaHover,
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
