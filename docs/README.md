codemirror-json-schema

# codemirror-json-schema

## Table of contents

### Bundled Codemirror Extensions

- [jsonSchema](README.md#jsonschema)

### Codemirror Extensions

- [jsonCompletion](README.md#jsoncompletion)
- [jsonSchemaHover](README.md#jsonschemahover)
- [jsonSchemaLinter](README.md#jsonschemalinter)

### Utilities

- [getJsonPointers](README.md#getjsonpointers)
- [jsonPointerForPosition](README.md#jsonpointerforposition)
- [parseJSONDocument](README.md#parsejsondocument)
- [parseJSONDocumentState](README.md#parsejsondocumentstate)

### Classes

- [JSONCompletion](classes/JSONCompletion.md)
- [JSONHover](classes/JSONHover.md)
- [JSONValidation](classes/JSONValidation.md)

### Functions

- [getJSONSchema](README.md#getjsonschema)
- [getJsonPointerAt](README.md#getjsonpointerat)
- [handleRefresh](README.md#handlerefresh)
- [resolveTokenName](README.md#resolvetokenname)
- [stateExtensions](README.md#stateextensions)
- [updateSchema](README.md#updateschema)

### Interfaces

- [JSONCompletionOptions](interfaces/JSONCompletionOptions.md)
- [JSONValidationOptions](interfaces/JSONValidationOptions.md)

### Type Aliases

- [CursorData](README.md#cursordata)
- [FoundCursorData](README.md#foundcursordata)
- [HoverOptions](README.md#hoveroptions)
- [JSONPartialPointerData](README.md#jsonpartialpointerdata)
- [JSONPointerData](README.md#jsonpointerdata)
- [JSONPointersMap](README.md#jsonpointersmap)

### Variables

- [schemaStateField](README.md#schemastatefield)

## Bundled Codemirror Extensions

### jsonSchema

▸ **jsonSchema**(`schema?`): `Extension`[]

Full featured cm6 extension for json, including `@codemirror/lang-json`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema?` | `JSONSchema7` |

#### Returns

`Extension`[]

#### Defined in

[json/bundled.ts:15](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/json/bundled.ts#L15)

## Codemirror Extensions

### jsonCompletion

▸ **jsonCompletion**(`opts?`): (`ctx`: `CompletionContext`) => `never`[] \| `CompletionResult`

provides a JSON schema enabled autocomplete extension for codemirror

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`JSONCompletionOptions`](interfaces/JSONCompletionOptions.md) |

#### Returns

`fn`

▸ (`ctx`): `never`[] \| `CompletionResult`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `CompletionContext` |

##### Returns

`never`[] \| `CompletionResult`

#### Defined in

[features/completion.ts:1062](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L1062)

___

### jsonSchemaHover

▸ **jsonSchemaHover**(`options?`): (`view`: `EditorView`, `pos`: `number`, `side`: `Side`) => `Promise`\<``null`` \| `Tooltip`\>

provides a JSON schema enabled tooltip extension for codemirror

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`HoverOptions`](README.md#hoveroptions) |

#### Returns

`fn`

▸ (`view`, `pos`, `side`): `Promise`\<``null`` \| `Tooltip`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `view` | `EditorView` |
| `pos` | `number` |
| `side` | `Side` |

##### Returns

`Promise`\<``null`` \| `Tooltip`\>

#### Defined in

[features/hover.ts:46](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/hover.ts#L46)

___

### jsonSchemaLinter

▸ **jsonSchemaLinter**(`options?`): (`view`: `EditorView`) => `Diagnostic`[]

Helper for simpler class instantiaton

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`JSONValidationOptions`](interfaces/JSONValidationOptions.md) |

#### Returns

`fn`

▸ (`view`): `Diagnostic`[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `view` | `EditorView` |

##### Returns

`Diagnostic`[]

#### Defined in

[features/validation.ts:46](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/validation.ts#L46)

## Utilities

### getJsonPointers

▸ **getJsonPointers**(`state`, `mode`): [`JSONPointersMap`](README.md#jsonpointersmap)

retrieve a Map of all the json pointers in a document

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |
| `mode` | `JSONMode` |

#### Returns

[`JSONPointersMap`](README.md#jsonpointersmap)

#### Defined in

[utils/json-pointers.ts:89](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/utils/json-pointers.ts#L89)

___

### jsonPointerForPosition

▸ **jsonPointerForPosition**(`state`, `pos`, `side?`, `mode`): `string`

retrieve a JSON pointer for a given position in the editor

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `state` | `EditorState` | `undefined` |
| `pos` | `number` | `undefined` |
| `side` | `Side` | `-1` |
| `mode` | `JSONMode` | `undefined` |

#### Returns

`string`

#### Defined in

[utils/json-pointers.ts:72](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/utils/json-pointers.ts#L72)

___

### parseJSONDocument

▸ **parseJSONDocument**(`jsonString`): `Object`

Mimics the behavior of `json-source-map`'s `parseJSONDocument` function using codemirror EditorState

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonString` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `pointers` | [`JSONPointersMap`](README.md#jsonpointersmap) |

#### Defined in

[parsers/json-parser.ts:29](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/parsers/json-parser.ts#L29)

___

### parseJSONDocumentState

▸ **parseJSONDocumentState**(`state`): `Object`

Return parsed data and json pointers for a given codemirror EditorState

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `pointers` | [`JSONPointersMap`](README.md#jsonpointersmap) |

#### Defined in

[parsers/json-parser.ts:11](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/parsers/json-parser.ts#L11)

## Functions

### getJSONSchema

▸ **getJSONSchema**(`state`): `void` \| `JSONSchema7`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |

#### Returns

`void` \| `JSONSchema7`

#### Defined in

[features/state.ts:25](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/state.ts#L25)

___

### getJsonPointerAt

▸ **getJsonPointerAt**(`docText`, `node`, `mode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `docText` | `Text` |
| `node` | `SyntaxNode` |
| `mode` | `JSONMode` |

#### Returns

`string`

#### Defined in

[utils/json-pointers.ts:31](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/utils/json-pointers.ts#L31)

___

### handleRefresh

▸ **handleRefresh**(`vu`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vu` | `ViewUpdate` |

#### Returns

`boolean`

#### Defined in

[features/validation.ts:36](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/validation.ts#L36)

___

### resolveTokenName

▸ **resolveTokenName**(`nodeName`, `mode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeName` | `string` |
| `mode` | `JSONMode` |

#### Returns

`string`

#### Defined in

[utils/json-pointers.ts:18](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/utils/json-pointers.ts#L18)

___

### stateExtensions

▸ **stateExtensions**(`schema?`): `Extension`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema?` | `JSONSchema7` |

#### Returns

`Extension`[]

#### Defined in

[features/state.ts:29](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/state.ts#L29)

___

### updateSchema

▸ **updateSchema**(`view`, `schema?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `view` | `EditorView` |
| `schema?` | `JSONSchema7` |

#### Returns

`void`

#### Defined in

[features/state.ts:19](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/state.ts#L19)

## Type Aliases

### CursorData

Ƭ **CursorData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pointer` | `string` |
| `schema?` | `JsonSchema` |

#### Defined in

[features/hover.ts:19](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/hover.ts#L19)

___

### FoundCursorData

Ƭ **FoundCursorData**: `Required`\<[`CursorData`](README.md#cursordata)\>

#### Defined in

[features/hover.ts:21](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/hover.ts#L21)

___

### HoverOptions

Ƭ **HoverOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `formatHover?` | (`data`: `HoverTexts`) => `HTMLElement` |
| `getHoverTexts?` | (`data`: [`FoundCursorData`](README.md#foundcursordata)) => `HoverTexts` |
| `mode?` | `JSONMode` |
| `parser?` | (`text`: `string`) => `any` |

#### Defined in

[features/hover.ts:25](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/hover.ts#L25)

___

### JSONPartialPointerData

Ƭ **JSONPartialPointerData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyFrom` | `number` |
| `keyTo` | `number` |

#### Defined in

[types.ts:6](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/types.ts#L6)

___

### JSONPointerData

Ƭ **JSONPointerData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyFrom` | `number` |
| `keyTo` | `number` |
| `valueFrom` | `number` |
| `valueTo` | `number` |

#### Defined in

[types.ts:11](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/types.ts#L11)

___

### JSONPointersMap

Ƭ **JSONPointersMap**: `Map`\<`string`, [`JSONPointerData`](README.md#jsonpointerdata) \| [`JSONPartialPointerData`](README.md#jsonpartialpointerdata)\>

#### Defined in

[types.ts:20](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/types.ts#L20)

## Variables

### schemaStateField

• `Const` **schemaStateField**: `StateField`\<`void` \| `JSONSchema7`\>

#### Defined in

[features/state.ts:6](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/state.ts#L6)
