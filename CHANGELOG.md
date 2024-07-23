# codemirror-json-schema

## 0.7.9

### Patch Changes

- [#133](https://github.com/jsonnext/codemirror-json-schema/pull/133) [`4fd7cc6`](https://github.com/jsonnext/codemirror-json-schema/commit/4fd7cc69084bdad3c8c93d9d0f0a936fa120cbae) Thanks [@imolorhe](https://github.com/imolorhe)! - Get sub schema using parsed data for additional context

## 0.7.8

### Patch Changes

- [#122](https://github.com/jsonnext/codemirror-json-schema/pull/122) [`c2dfcc1`](https://github.com/jsonnext/codemirror-json-schema/commit/c2dfcc154abfc0dea0d3c0646a8b681565acf0f3) Thanks [@imolorhe](https://github.com/imolorhe)! - fix demo highlighting

- [#123](https://github.com/jsonnext/codemirror-json-schema/pull/123) [`2356a94`](https://github.com/jsonnext/codemirror-json-schema/commit/2356a94de080c00869a8b1b41763dbc577530894) Thanks [@imolorhe](https://github.com/imolorhe)! - updated json-schema-library to get upstream fixes

## 0.7.7

### Patch Changes

- [#117](https://github.com/jsonnext/codemirror-json-schema/pull/117) [`edafa8f`](https://github.com/jsonnext/codemirror-json-schema/commit/edafa8f6993a4004c9ffe6aa7cde58c9da704d6b) Thanks [@acao](https://github.com/acao)! - validate all strings with length > 1

## 0.7.6

### Patch Changes

- [#115](https://github.com/jsonnext/codemirror-json-schema/pull/115) [`c8d2594`](https://github.com/jsonnext/codemirror-json-schema/commit/c8d259443ffdc5eb792dd373dac64e1d4895c876) Thanks [@acao](https://github.com/acao)! - set @codemirror/autocomplete as an optional peer, at a fix version for a bug with curly braces

## 0.7.5

### Patch Changes

- [#112](https://github.com/jsonnext/codemirror-json-schema/pull/112) [`ccffa61`](https://github.com/jsonnext/codemirror-json-schema/commit/ccffa6195e45d0eb52ed2253831eb396e930a1cc) Thanks [@acao](https://github.com/acao)! - fixes bundling - remove .js imports and remains as moduleResolution: 'Node' to match cm6

## 0.7.4

### Patch Changes

- [#102](https://github.com/acao/codemirror-json-schema/pull/102) [`296617f`](https://github.com/acao/codemirror-json-schema/commit/296617f4800d875ddd579cbb544240e8a6985bc1) Thanks [@imolorhe](https://github.com/imolorhe)! - Improvements to completion logic (mainly for top level)

## 0.7.3

### Patch Changes

- [#103](https://github.com/acao/codemirror-json-schema/pull/103) [`da7f368`](https://github.com/acao/codemirror-json-schema/commit/da7f36888c5efa31b5b32becdf9f839e476eed85) Thanks [@imolorhe](https://github.com/imolorhe)! - Handle generic validation error

## 0.7.2

### Patch Changes

- [#94](https://github.com/acao/codemirror-json-schema/pull/94) [`0dc3749`](https://github.com/acao/codemirror-json-schema/commit/0dc37498d7276becceb48d92dc367648f4676415) Thanks [@xdavidwu](https://github.com/xdavidwu)! - Add support for YAML flow sequences and flow mappings

## 0.7.1

### Patch Changes

- [`8b311fe`](https://github.com/acao/codemirror-json-schema/commit/8b311fe1fe48ba5cf209ae5d9524f0df6d0fba55) Thanks [@acao](https://github.com/acao)! - Add MIT license via @imolorhe

## 0.7.0

### Minor Changes

- [#85](https://github.com/acao/codemirror-json-schema/pull/85) [`c694451`](https://github.com/acao/codemirror-json-schema/commit/c6944518e72aef0a2b81952dff6bc0114b8c6be0) Thanks [@imolorhe](https://github.com/imolorhe)! - Added YAML support, switched back to markdown for messages, provide markdown rendering, and fix some autocompletion issues

## 0.6.1

### Patch Changes

- [#81](https://github.com/acao/codemirror-json-schema/pull/81) [`ed534d7`](https://github.com/acao/codemirror-json-schema/commit/ed534d703801d174779e099891a2905e6b60a6af) Thanks [@acao](https://github.com/acao)! - export `handleRefresh`

- [#83](https://github.com/acao/codemirror-json-schema/pull/83) [`efd54f0`](https://github.com/acao/codemirror-json-schema/commit/efd54f022cad7ba924b444356ffa6f0f6c704916) Thanks [@acao](https://github.com/acao)! - fix undefined position bug with json-schema-library upgrade

## 0.6.0

### Minor Changes

- [#64](https://github.com/acao/codemirror-json-schema/pull/64) [`0aaf308`](https://github.com/acao/codemirror-json-schema/commit/0aaf3080f9451bdbdc45f5a812ce50c25f354c57) Thanks [@acao](https://github.com/acao)! - **Breaking Change**: replaces backticks with `<code>` blocks in hover and completion! This just seemed to make more sense.

  - upgrade `json-schema-library` to the latest 8.x with patch fixes, remove "forked" pointer step logic
  - after autocompleting a property, when there is empty value, provide full autocomplete options
  - as noted in the breaking change notice, all psuedo-markdown backtick \`\`delimiters are replaced with`<code>`

## 0.5.1

### Patch Changes

- [`7ed9e3e`](https://github.com/acao/codemirror-json-schema/commit/7ed9e3e206ec7a47f8f7dde7d2a50a75228ae0be) Thanks [@acao](https://github.com/acao)! - fix required fields validation

## 0.5.0

### Minor Changes

- [#63](https://github.com/acao/codemirror-json-schema/pull/63) [`a73c517`](https://github.com/acao/codemirror-json-schema/commit/a73c517722bbe9d37124993117c091e259eb6998) Thanks [@acao](https://github.com/acao)!

- **breaking change**: only impacts those following the "custom usage" approach, it _does not_ effect users using the high level, "bundled" `jsonSchema()` or `json5Schema()` modes.

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

- upgrade to use full `.js` import paths for `NodeNext` compatibility, however not all of our dependencies are compatible with this mode, thus we continue using the legacy `nodeResolution` strategy.

## 0.4.5

### Patch Changes

- [#70](https://github.com/acao/codemirror-json-schema/pull/70) [`4c9ca0a`](https://github.com/acao/codemirror-json-schema/commit/4c9ca0a2cab4806d1107a64e96a60c3c6c46edfa) Thanks [@acao](https://github.com/acao)! - Fix vulnerability message for json-schema type dependency

## 0.4.4

### Patch Changes

- [#60](https://github.com/acao/codemirror-json-schema/pull/60) [`161a2df`](https://github.com/acao/codemirror-json-schema/commit/161a2dfa7e7e7f35253818c6f47395575b7b7baa) Thanks [@imolorhe](https://github.com/imolorhe)! - Added generated cjs directory to files list

## 0.4.3

### Patch Changes

- [#58](https://github.com/acao/codemirror-json-schema/pull/58) [`eb3e09d`](https://github.com/acao/codemirror-json-schema/commit/eb3e09d1b2e1280ba295aac9fa8ba9493a0d385d) Thanks [@acao](https://github.com/acao)! - Add main/cjs exports for webpack

## 0.4.2

### Patch Changes

- [`14a26f8`](https://github.com/acao/codemirror-json-schema/commit/14a26f829f04972080eed822bd14e2e29d907be4) Thanks [@acao](https://github.com/acao)! - fix nested json4 completion bug (#55)

  - fix #54, expand properties inside nested objects as expected in json4
  - always advance cursor after property completions
  - add more test coverage

## 0.4.1

### Patch Changes

- [#49](https://github.com/acao/codemirror-json-schema/pull/49) [`8d7fa57`](https://github.com/acao/codemirror-json-schema/commit/8d7fa578d74e31d3ec0d6bde6dd55fdbd570c586) Thanks [@imolorhe](https://github.com/imolorhe)! - expand property schema when inserting text

## 0.4.0

### Minor Changes

- [`b227106`](https://github.com/acao/codemirror-json-schema/commit/b2271065dc9d2273094d0d193ceef2ad4248d62d) Thanks [@imolorhe](https://github.com/imolorhe)! - Applied `snippetCompletion` to property completions

## 0.3.2

### Patch Changes

- [#42](https://github.com/acao/codemirror-json-schema/pull/42) [`a08101a`](https://github.com/acao/codemirror-json-schema/commit/a08101a9fbae0979bc0cf11307102ce8bddd2572) Thanks [@acao](https://github.com/acao)! - simpler export patterns

## 0.3.1

### Patch Changes

- [#37](https://github.com/acao/codemirror-json-schema/pull/37) [`1220706`](https://github.com/acao/codemirror-json-schema/commit/12207063b8243caae814ec87b0c2dbb0ba7cddf6) Thanks [@acao](https://github.com/acao)! - - fix hover on undefined schema props

  - configure `above: true` for the hover tooltip, to have vscode-like behavior, and prevent z-index clash with completion on smaller viewports

- [#36](https://github.com/acao/codemirror-json-schema/pull/36) [`23e5721`](https://github.com/acao/codemirror-json-schema/commit/23e572147a3b8d718d52761ee431186a8b297b9d) Thanks [@imolorhe](https://github.com/imolorhe)! - fixed autocompletion in object roots, etc, for json4 and json5

## 0.3.0

### Minor Changes

- d4cfe11: improve autocompletion with support for allOf, anyOf, oneOf

## 0.2.3

### Patch Changes

- 69ab7be: Fix bug on p/npm/yarn install with postinstall

## 0.2.2

### Patch Changes

- 4e80f37: hover bugs with complex types #26

## 0.2.1

### Patch Changes

- 0b34915: fix: hover format for anyOf

## 0.2.0

### Minor Changes

- 3a578e9: move everything codemirror related to a peer dependency. see readme for new install instructions

## 0.1.2

### Patch Changes

- d17f63f: fix readme

## 0.1.1

### Patch Changes

- 7f5af9d: Add formatting for complex types - oneOf, anyOf, allOf on hover

## 0.1.0

### Minor Changes

- 26bda14: add json5 support, simpler exports
