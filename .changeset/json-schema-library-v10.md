---
"codemirror-json-schema": minor
---

Upgrade json-schema-library from v9 to v10. Completion, hover and validation now use its `compileSchema` API, `$ref` combined with sibling keywords such as `oneOf` offers value completions, and hover shows the type of each `oneOf` option.
