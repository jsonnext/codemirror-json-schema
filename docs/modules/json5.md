[codemirror-json-schema](../README.md) / json5

# Module: json5

## Table of contents

### Codemirror Extensions

- [json5SchemaHover](json5.md#json5schemahover)
- [json5SchemaLinter](json5.md#json5schemalinter)

### Utilities

- [parseJSON5Document](json5.md#parsejson5document)
- [parseJSON5DocumentState](json5.md#parsejson5documentstate)

## Codemirror Extensions

### json5SchemaHover

▸ **json5SchemaHover**(`schema`, `options?`): (`view`: `EditorView`, `pos`: `number`, `side`: `1` \| `-1`) => `Promise`<`null` \| `Tooltip`\>

Instantiates a JSONHover instance with the JSON5 mode

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
| `side` | `1` \| `-1`  |

##### Returns

`Promise`<`null` \| `Tooltip`\>

#### Defined in

[json5-hover.ts:11](https://github.com/acao/codemirror-json-schema/blob/924e0e4/src/json5-hover.ts#L11)

---

### json5SchemaLinter

▸ **json5SchemaLinter**(`schema`, `options?`): (`view`: `EditorView`) => `Diagnostic`[]

Instantiates a JSONValidation instance with the JSON5 mode

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

[json5-validation.ts:10](https://github.com/acao/codemirror-json-schema/blob/924e0e4/src/json5-validation.ts#L10)

## Utilities

### parseJSON5Document

▸ **parseJSON5Document**(`jsonString`): `Object`

Mimics the behavior of `json-source-map`'s `parseJSONDocument` function, for json5!

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

[utils/parseJSON5Document.ts:28](https://github.com/acao/codemirror-json-schema/blob/924e0e4/src/utils/parseJSON5Document.ts#L28)

---

### parseJSON5DocumentState

▸ **parseJSON5DocumentState**(`state`): `Object`

Return parsed data and json5 pointers for a given codemirror EditorState

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

[utils/parseJSON5Document.ts:14](https://github.com/acao/codemirror-json-schema/blob/924e0e4/src/utils/parseJSON5Document.ts#L14)
