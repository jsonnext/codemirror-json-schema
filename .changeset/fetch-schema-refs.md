---
"codemirror-json-schema": minor
---

Resolve external `$ref` URLs with a `fetchSchema` hook. Pass `{ schema, fetchSchema }` to `jsonSchema`, `json5Schema` or `yamlSchema`: external refs, including transitive ones, are fetched in parallel, cached and registered with the compiled schema, so completion, hover and validation cover referenced types. Features work straight away with the local schema and update when the remote schemas arrive. `RefResolver` and `collectExternalRefs` are exported for use outside the bundled extensions.
