# `cm6-json-schema`

Provides a json-schema enabled mode that extends `@codemirror/lang-json`'s grammar for codemirror 6 that:

- [x] `lint`s: validates json strings with positional information for json schema errors
- [x] `hint`s: provides code completion
- [x] `info`s: provides hover info
- [ ] leverages `$schema` path url if provided in the JSON string, or a json schema that is provided to the mode API, preferring the former.

Coming soon: `json5` support using `codemirror-json5`'s grammar! Utilities already exist :)

### Usage

You can start with the [deployed example](https://github.com/acao/cm6-json-schema/blob/main/dev/index.ts) to learn how to use it. Many more docs to come!

## Current constraints:

- only linting & hover is available for `oneOf`, `anyOf`, `allOf` and other [schema combination methods](https://json-schema.org/understanding-json-schema/reference/combining.html)
- it only works with one json schema instance at a time, and doesn't yet fetch remote schemas

## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!

## Goals
- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
- json5 + json schema for all!
