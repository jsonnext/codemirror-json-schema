# `codemirror-json-schema`

Builds on `@codemirror/lang-json`'s and `codemirror-json5`'s grammars with JSONSchema support!

## json4

- [x] `lint`s: validates json against schema
- [x] `hint`s: provides code completion (no complex types yet)
- [x] `info`s: provides hover tooltip

## json5

- [x] `lint`s: validates json against schema
- [x] `info`s: provides hover tooltip
- [ ] `hint`s: provides code completion

### Usage

You will need to install the relevant language mode for our library to use.

## json4

```
npm install --save @codemirror/lang-json codemirror-json-schema
```

```ts
import { json } from "@codemirror/lang-json";
import { jsonSchemaLinting, jsonSchemaHover } from "codemirror-json-schema";

const state = EditorState.create({
  doc: jsonText,
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

## json5

```
npm install --save codemirror-json codemirror-json-schema json5
```

```ts
import { json5 } from "codemirror-json5";
import {
  jsonSchemaLinting,
  jsonSchemaHover,
} from "codemirror-json-schema/json5";

const json5State = EditorState.create({
  doc: json5Text,
  extensions: [
    ...commonExtensions,
    json5(),
    linter(json5ParseLinter()),
    linter(json5SchemaLinter(schema)),
    hoverTooltip(json5SchemaHover(schema)),
  ],
});
```

You can start with the [deployed example](https://github.com/acao/cm6-json-schema/blob/main/dev/index.ts) to learn advanced usage. Many more docs to come!

## Current constraints:

- only linting & hover is available for `oneOf`, `anyOf`, `allOf` and other [schema combination methods](https://json-schema.org/understanding-json-schema/reference/combining.html)
- it only works with one json schema instance at a time, and doesn't yet fetch remote schemas. schema service coming soon!

## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!

## Our Goals

- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
- json5 + json4 json schema features for all!
