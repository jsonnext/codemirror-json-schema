---
"codemirror-json-schema": patch
---

Validate `if`/`then`/`else` in linear time. json-schema-library v10 copies the whole validation path for every `if`, which made validation quadratic in document size: a 380KB document took ~30s with a schema that selects definitions by `if`/`then`. Schemas are now compiled with an `if` validator that trims the shared path instead.
