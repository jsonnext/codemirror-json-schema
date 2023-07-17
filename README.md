# `cm6-language-json-schema`

Provide a mode for codemirror 6 that:

- [x] `lint`s:  validates json strings with positional information, for parsing errors and json schema errors
- [x] `hint`s: provides code completion for json schema
- [] `info`s: provides hover info for json schema
- [] leverages`$schema` path url if provided in the JSON string, or a json schema that is provided to the mode API, preferring the former.

## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!

## Goals
- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
