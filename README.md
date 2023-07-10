# `cm6-language-json-schema`

WIP: Working on underlying libraries using TDD for now :)`

Provide a mode for codemirror 6 that:

1. `lint`s:  validates json strings with positional information, for parsing errors and json schema errors
2. `hint`s: provides code completion for json schema
3. `info`s: provides hover info for json schema

## Using:

`$schema` url if provided in the JSON string, or a json schema that is provided to the mode API, preferring the former.

## Inspiration

`monaco-json` and `monaco-yaml` both provide these features, and I want the nascent codemirror 6 to have them as well!
