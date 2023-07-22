# codemirror-json-schema

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
