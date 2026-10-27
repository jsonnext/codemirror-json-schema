---
"codemirror-json-schema": patch
---

Honor keywords next to `$ref`, as draft 2020-12 requires. A schema such as `{ "$ref": "#/$defs/key", "oneOf": [{ "const": "a" }, …] }` is normalized to `{ "allOf": [{ "$ref": … }, { "oneOf": … }] }`, so its values are completed and validated instead of being dropped. Schemas that declare draft-04, -06 or -07, where `$ref` replaces its siblings, are left unchanged.
