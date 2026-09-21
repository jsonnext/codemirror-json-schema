---
"codemirror-json-schema": patch
---

Fix diagnostic ranges for primitive and nested array items in JSON, JSON5, and YAML. Locate property values by their syntax nodes rather than fixed sibling offsets, so newer JSON grammars highlight the invalid value instead of its colon. Preserve property key ranges for object-valued properties and keep missing-required-property diagnostics on their containing values.
