[codemirror-json-schema](../README.md) / index

# Module: index

## Table of contents

### Bundled Codemirror Extensions

- [jsonSchema](index.md#jsonschema)

### Codemirror Extensions

- [jsonCompletion](index.md#jsoncompletion)
- [jsonSchemaHover](index.md#jsonschemahover)
- [jsonSchemaLinter](index.md#jsonschemalinter)

### Utilities

- [getJsonPointers](index.md#getjsonpointers)
- [jsonPointerForPosition](index.md#jsonpointerforposition)
- [parseJSONDocument](index.md#parsejsondocument)
- [parseJSONDocumentState](index.md#parsejsondocumentstate)

### Functions

- [getJsonPointerAt](index.md#getjsonpointerat)

### Type Aliases

- [CursorData](index.md#cursordata)
- [FoundCursorData](index.md#foundcursordata)
- [HoverOptions](index.md#hoveroptions)
- [JSONMode](index.md#jsonmode)
- [JSONPartialPointerData](index.md#jsonpartialpointerdata)
- [JSONPointerData](index.md#jsonpointerdata)
- [JSONPointersMap](index.md#jsonpointersmap)
- [JSONValidationOptions](index.md#jsonvalidationoptions)

## Bundled Codemirror Extensions

### jsonSchema

▸ **jsonSchema**(`schema`): `Extension`[]

Full featured cm6 extension for json, including `@codemirror/lang-json`

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `schema` | `JSONSchema7` |

#### Returns

`Extension`[]

#### Defined in

[bundled.ts:14](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/bundled.ts#L14)

## Codemirror Extensions

### jsonCompletion

▸ **jsonCompletion**(`schema`): (`ctx`: `CompletionContext`) => `CompletionResult`

provides a JSON schema enabled autocomplete extension for codemirror

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `schema` | `JSONSchema7` |

#### Returns

`fn`

▸ (`ctx`): `CompletionResult`

##### Parameters

| Name  | Type                |
| :---- | :------------------ |
| `ctx` | `CompletionContext` |

##### Returns

`CompletionResult`

#### Defined in

[json-completion.ts:747](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-completion.ts#L747)

---

### jsonSchemaHover

▸ **jsonSchemaHover**(`schema`, `options?`): (`view`: `EditorView`, `pos`: `number`, `side`: `Side`) => `Promise`<`null` \| `Tooltip`\>

provides a JSON schema enabled tooltip extension for codemirror

#### Parameters

| Name       | Type                                    |
| :--------- | :-------------------------------------- |
| `schema`   | `JSONSchema7`                           |
| `options?` | [`HoverOptions`](index.md#hoveroptions) |

#### Returns

`fn`

▸ (`view`, `pos`, `side`): `Promise`<`null` \| `Tooltip`\>

##### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |
| `pos`  | `number`     |
| `side` | `Side`       |

##### Returns

`Promise`<`null` \| `Tooltip`\>

#### Defined in

[json-hover.ts:38](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-hover.ts#L38)

---

### jsonSchemaLinter

▸ **jsonSchemaLinter**(`schema`, `options?`): (`view`: `EditorView`) => `Diagnostic`[]

Helper for simpler class instantiaton

#### Parameters

| Name       | Type                                                      |
| :--------- | :-------------------------------------------------------- |
| `schema`   | `JSONSchema7`                                             |
| `options?` | [`JSONValidationOptions`](index.md#jsonvalidationoptions) |

#### Returns

`fn`

▸ (`view`): `Diagnostic`[]

##### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |

##### Returns

`Diagnostic`[]

#### Defined in

[json-validation.ts:35](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-validation.ts#L35)

## Utilities

### getJsonPointers

▸ **getJsonPointers**(`state`, `mode?`): [`JSONPointersMap`](index.md#jsonpointersmap)

retrieve a Map of all the json pointers in a document

#### Parameters

| Name    | Type                            | Default value |
| :------ | :------------------------------ | :------------ |
| `state` | `EditorState`                   | `undefined`   |
| `mode`  | [`JSONMode`](index.md#jsonmode) | `"json4"`     |

#### Returns

[`JSONPointersMap`](index.md#jsonpointersmap)

#### Defined in

[utils/jsonPointers.ts:56](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/jsonPointers.ts#L56)

---

### jsonPointerForPosition

▸ **jsonPointerForPosition**(`state`, `pos`, `side?`): `string`

retrieve a JSON pointer for a given position in the editor

#### Parameters

| Name    | Type          | Default value |
| :------ | :------------ | :------------ |
| `state` | `EditorState` | `undefined`   |
| `pos`   | `number`      | `undefined`   |
| `side`  | `Side`        | `-1`          |

#### Returns

`string`

#### Defined in

[utils/jsonPointers.ts:44](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/jsonPointers.ts#L44)

---

### parseJSONDocument

▸ **parseJSONDocument**(`jsonString`): `Object`

Mimics the behavior of `json-source-map`'s `parseJSONDocument` function using codemirror EditorState

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `jsonString` | `string` |

#### Returns

`Object`

| Name       | Type                                          |
| :--------- | :-------------------------------------------- |
| `data`     | `any`                                         |
| `pointers` | [`JSONPointersMap`](index.md#jsonpointersmap) |

#### Defined in

[utils/parseJSONDocument.ts:23](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/parseJSONDocument.ts#L23)

---

### parseJSONDocumentState

▸ **parseJSONDocumentState**(`state`): `Object`

Return parsed data and json pointers for a given codemirror EditorState

#### Parameters

| Name    | Type          |
| :------ | :------------ |
| `state` | `EditorState` |

#### Returns

`Object`

| Name       | Type                                          |
| :--------- | :-------------------------------------------- |
| `data`     | `any`                                         |
| `pointers` | [`JSONPointersMap`](index.md#jsonpointersmap) |

#### Defined in

[utils/parseJSONDocument.ts:9](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/parseJSONDocument.ts#L9)

## Functions

### getJsonPointerAt

▸ **getJsonPointerAt**(`docText`, `node`): `string`

#### Parameters

| Name      | Type         |
| :-------- | :----------- |
| `docText` | `Text`       |
| `node`    | `SyntaxNode` |

#### Returns

`string`

#### Defined in

[utils/jsonPointers.ts:12](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/jsonPointers.ts#L12)

## Type Aliases

### CursorData

Ƭ **CursorData**: `Object`

#### Type declaration

| Name      | Type         |
| :-------- | :----------- |
| `pointer` | `string`     |
| `schema?` | `JsonSchema` |

#### Defined in

[json-hover.ts:12](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-hover.ts#L12)

---

### FoundCursorData

Ƭ **FoundCursorData**: `Required`<[`CursorData`](index.md#cursordata)\>

#### Defined in

[json-hover.ts:14](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-hover.ts#L14)

---

### HoverOptions

Ƭ **HoverOptions**: `Object`

#### Type declaration

| Name             | Type                                                                    |
| :--------------- | :---------------------------------------------------------------------- |
| `formatHover?`   | (`data`: `HoverTexts`) => `HTMLElement`                                 |
| `getHoverTexts?` | (`data`: [`FoundCursorData`](index.md#foundcursordata)) => `HoverTexts` |
| `parser?`        | (`text`: `string`) => `any`                                             |

#### Defined in

[json-hover.ts:18](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-hover.ts#L18)

---

### JSONMode

Ƭ **JSONMode**: `"json4"` \| `"json5"`

#### Defined in

[utils/jsonPointers.ts:8](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/utils/jsonPointers.ts#L8)

---

### JSONPartialPointerData

Ƭ **JSONPartialPointerData**: `Object`

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `keyFrom` | `number` |
| `keyTo`   | `number` |

#### Defined in

[types.ts:4](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/types.ts#L4)

---

### JSONPointerData

Ƭ **JSONPointerData**: `Object`

#### Type declaration

| Name        | Type     |
| :---------- | :------- |
| `keyFrom`   | `number` |
| `keyTo`     | `number` |
| `valueFrom` | `number` |
| `valueTo`   | `number` |

#### Defined in

[types.ts:9](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/types.ts#L9)

---

### JSONPointersMap

Ƭ **JSONPointersMap**: `Map`<`string`, [`JSONPointerData`](index.md#jsonpointerdata) \| [`JSONPartialPointerData`](index.md#jsonpartialpointerdata)\>

#### Defined in

[types.ts:18](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/types.ts#L18)

---

### JSONValidationOptions

Ƭ **JSONValidationOptions**: `Object`

#### Type declaration

| Name           | Type                                                               |
| :------------- | :----------------------------------------------------------------- |
| `formatError?` | (`error`: `JsonError`) => `string`                                 |
| `jsonParser?`  | typeof [`parseJSONDocumentState`](index.md#parsejsondocumentstate) |

#### Defined in

[json-validation.ts:24](https://github.com/acao/codemirror-json-schema/blob/a08101a/src/json-validation.ts#L24)
