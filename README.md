Codemirror 6 extensions that provide full [JSON Schema](https://json-schema.org/) support for `@codemirror/lang-json`, `codemirror-json5` & `@codemirror/lang-yaml` language modes

<a href="https://npmjs.com/codemirror-json-schema">
<img alt="npm" src="https://img.shields.io/npm/dm/codemirror-json-schema?label=npm%20downloads">
</a>

![screenshot of the examples with json4 and json5 support enabled](./dev/public/example.png)

## Features

This is now a full-featured library for json schema for `json`, `json5` and `yaml` as cm6 extensions!

- ✅ lint validation messages from json schema
- ✅ autocompletion with insert text from json schema
- ✅ hover tooltips
- ✅ dynamic, per-editor-instance schemas using codemirror `StateField` and linting refresh
- ✅ markdown rendering for `schema.description` and custom `formatHover` and `formatError` configuration
- ✅ automatic resolution of external `$ref` URLs with a user-configurable `fetchSchema` hook

## Resources

- [Changelog](./CHANGELOG.md)
- [Comprehensive example](https://github.com/acao/cm6-json-schema/blob/main/dev/index.ts)
- [API Docs](./docs/)

## Usage

To give you as much flexibility as possible, everything codemirror related is a peer or optional dependency

Based on whether you want to support json4, json5 or both, you will need to install the relevant language mode for our library to use.

### Breaking Changes:

- 0.7.0 - this version introduces markdown rendering in place of returning html strings, so any usage of `formatHover` and/or `formatError` configuration will be passed to `markdown-it` which doesn't handle html by default.
- 0.5.0 - this breaking change only impacts those following the "custom usage" approach, it _does not_ effect users using the high level, "bundled" `jsonSchema()` or `json5Schema()` modes. See the custom usages below to learn how to use the new `stateExtensions` and `handleRefresh` exports.

### json4

with `auto-install-peers true` or similar:

```
npm install --save @codemirror/lang-json codemirror-json-schema
```

without `auto-install-peers true`:

```
npm install --save @codemirror/lang-json codemirror-json-schema @codemirror/language @codemirror/lint @codemirror/view @codemirror/state @lezer/common
```

#### Minimal Usage

This sets up `@codemirror/lang-json` and our extension for you.
If you'd like to have more control over the related configurations, see custom usage below

```ts
import { EditorState } from "@codemirror/state";
import { jsonSchema } from "codemirror-json-schema";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const state = EditorState.create({
  doc: '{ "example": true }',
  extensions: [jsonSchema(schema)],
});
```

#### Custom Usage

This approach allows you to configure the json mode and parse linter, as well as our linter, hovers, etc more specifically.

```ts
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { hoverTooltip } from "@codemirror/view";
import { json, jsonParseLinter, jsonLanguage } from "@codemirror/lang-json";

import {
  jsonSchemaLinter,
  jsonSchemaHover,
  jsonCompletion,
  stateExtensions,
  handleRefresh,
} from "codemirror-json-schema";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const state = EditorState.create({
  doc: `{ "example": true }`,
  extensions: [
    json(),
    linter(jsonParseLinter(), {
      // default is 750ms
      delay: 300,
    }),
    linter(jsonSchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
    jsonLanguage.data.of({
      autocomplete: jsonCompletion(),
    }),
    hoverTooltip(jsonSchemaHover()),
    stateExtensions(schema),
  ],
});
```

### json5

with `auto-install-peers true` or similar:

```
npm install --save codemirror-json5 codemirror-json-schema
```

without `auto-install-peers true`:

```
npm install --save codemirror-json5 codemirror-json-schema @codemirror/language @codemirror/lint @codemirror/view @codemirror/state @lezer/common
```

#### Minimal Usage

This sets up `codemirror-json5` mode for you.
If you'd like to have more control over the related configurations, see custom usage below

```ts
import { EditorState } from "@codemirror/state";
import { json5Schema } from "codemirror-json-schema/json5";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const json5State = EditorState.create({
  doc: `{
    example: true,
    // json5 is awesome!
  }`,
  extensions: [json5Schema(schema)],
});
```

#### Custom Usage

This approach allows you to configure the json5 mode and parse linter, as well as our linter, hovers, etc more specifically.

```ts
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { hoverTooltip } from "@codemirror/view";
import { json5, json5ParseLinter, json5Language } from "codemirror-json5";
import {
  json5SchemaLinter,
  json5SchemaHover,
  json5Completion,
} from "codemirror-json-schema/json5";
import { stateExtensions, handleRefresh } from "codemirror-json-schema";

const schema = {
  type: "object",
  properties: {
    example: {
      type: "boolean",
    },
  },
};

const json5State = EditorState.create({
  doc: `{
    example: true,
    // json5 is awesome!
  }`,
  extensions: [
    json5(),
    linter(json5ParseLinter(), {
      // the default linting delay is 750ms
      delay: 300,
    }),
    linter(json5SchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
    hoverTooltip(json5SchemaHover()),
    json5Language.data.of({
      autocomplete: json5Completion(),
    }),
    stateExtensions(schema),
  ],
});
```

### Dynamic Schema

If you want to, you can provide schema dynamically, in several ways.
This works the same for either json or json5, using the underlying codemirror 6 StateFields, via the `updateSchema` method export.

In this example

- the initial schema state is empty
- schema is loaded dynamically based on user input
- the linting refresh will be handled automatically, because it's built into our bundled `jsonSchema()` and `json5Schema()` modes

```ts
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { json5Schema } from "codemirror-json-schema/json5";

import { updateSchema } from "codemirror-json-schema";

const json5State = EditorState.create({
  doc: `{
    example: true,
    // json5 is awesome!
  }`,
  // note: you can still provide initial
  // schema when creating state
  extensions: [json5Schema()],
});

const editor = new EditorView({ state: json5State });

const schemaSelect = document.getElementById("schema-selection");

schemaSelect!.onchange = async (e) => {
  const val = e.target!.value!;
  if (!val) {
    return;
  }
  // parse the remote schema spec to json
  const data = await (
    await fetch(`https://json.schemastore.org/${val}`)
  ).json();
  // this will update the schema state field, in an editor specific way
  updateSchema(editor, data);
};
```

if you are using the "custom path" with this approach, you will need to configure linting refresh as well:

```ts
import { linter } from "@codemirror/lint";
import { json5SchemaLinter } from "codemirror-json-schema/json5";
import { handleRefresh } from "codemirror-json-schema";

const state = EditorState.create({
  // ...
  extensions: [
    linter(json5SchemaLinter(), {
      needsRefresh: handleRefresh,
    }),
  ],
});
```

### External `$ref` Resolution

Schemas that use external `$ref` URLs (e.g. `"$ref": "https://example.com/schemas/address"`) can be automatically resolved by providing a `fetchSchema` hook. This enables full autocomplete, validation, and hover support for referenced types.

Pass an options object instead of a raw schema to any of the bundled extensions:

```ts
import { EditorState } from "@codemirror/state";
import { jsonSchema } from "codemirror-json-schema";

const state = EditorState.create({
  doc: "{}",
  extensions: [
    jsonSchema({
      schema: mySchema,
      fetchSchema: async (url) => {
        const res = await fetch(url);
        return res.ok ? res.json() : undefined;
      },
    }),
  ],
});
```

The `fetchSchema` function receives the base URL of each external `$ref` and should return the parsed JSON schema, or `undefined` if it can't be resolved. If a `$ref` URL includes a fragment (e.g. `https://example.com/schemas/party#/$defs/Address`), the fragment is stripped before calling `fetchSchema` — so it receives `https://example.com/schemas/party`. Local refs like `#/$defs/Foo` are resolved internally and never trigger a fetch. The resolver automatically:

- Discovers all external `$ref` URLs in the schema
- Fetches them in parallel
- Follows transitive `$ref`s in fetched schemas
- Deduplicates and caches requests
- Prevents infinite cycles

The same option is available for all modes:

```ts
import { json5Schema } from "codemirror-json-schema/json5";
import { yamlSchema } from "codemirror-json-schema/yaml";

// json5
json5Schema({ schema: mySchema, fetchSchema: myFetcher });

// yaml
yamlSchema({ schema: mySchema, fetchSchema: myFetcher });
```

You can also customize the fetch to rewrite URLs. For example, to proxy schema requests through a local server:

```ts
const SCHEMA_PREFIX = "https://example.com/schemas/";

jsonSchema({
  fetchSchema: async (url) => {
    if (!url.startsWith(SCHEMA_PREFIX)) return undefined;
    const path = url.slice(SCHEMA_PREFIX.length);
    const res = await fetch(`/api/schemas/${path}`);
    return res.ok ? res.json() : undefined;
  },
});
```

When `updateSchema()` is called to change the schema dynamically, any external `$ref`s in the new schema are automatically resolved. Features (validation, completion, hover) work immediately with a locally-compiled schema, then update seamlessly once remote schemas finish loading.

## Current Constraints:

- currently only tested with standard schemas using json4 spec. results may vary
- doesn't place cursor inside known insert text yet
- currently you can only override the texts and rendering of a hover. we plan to add the same for validation errors and autocomplete

## Inspiration

`monaco-json` and `monaco-yaml` both provide json schema features for json, cson and yaml, and we want the nascent codemirror 6 to have them as well!

Also, json5 is slowly growing in usage, and it needs full language support for the browser!
