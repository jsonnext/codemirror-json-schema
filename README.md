# `cm6-language-json-schema`

Provides a mode for codemirror 6 that:

- [x] `lint`s:  validates json strings with positional information, for parsing errors and json schema errors
- [x] `hint`s: provides code completion for json schema
- [x] `info`s: provides hover info for json schema
- [] leverages`$schema` path url if provided in the JSON string, or a json schema that is provided to the mode API, preferring the former.

## Notes:
only linting is available for `oneOf`, `anyOf`, `allOf` and other [schema combination methods](https://json-schema.org/understanding-json-schema/reference/combining.html)
## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!

## Goals
- working GeoJSON spec linter & completion
- working variables json mode for `cm6-graphql`, ala `monaco-graphql`
