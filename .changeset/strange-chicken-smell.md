---
"codemirror-json-schema": minor
---

**breaking change**: only impacts those following the "custom usage" approach, it _does not_ effect users using the high level, "bundled" `jsonSchema()` or `json5Schema()` modes.

Previously, we ask you to pass schema to each of the linter, completion and hover extensions.

Now, we ask you to use these new exports to instantiate your schema like this, with `stateExtensions(schema)` as a new extension, and the only one that you pass schema to, like so:

```ts
import type { JSONSchema7 } from "json-schema";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { hoverTooltip } from "@codemirror/view";
import { linter } from "@codemirror/lint";

import {
  jsonCompletion,
  handleRefresh,
  jsonSchemaLinter,
  jsonSchemaHover,
  stateExtensions,
} from "codemirror-json-schema";

import schema from "./myschema.json";

// ...
extensions: [
  json(),
  linter(jsonParseLinter()),
  linter(jsonSchemaLinter(), {
    needsRefresh: handleRefresh,
  }),
  jsonLanguage.data.of({
    autocomplete: jsonCompletion(),
  }),
  hoverTooltip(jsonSchemaHover()),
  // this is where we pass the schema!
  // very important!!!!
  stateExtensions(schema),
];
```
