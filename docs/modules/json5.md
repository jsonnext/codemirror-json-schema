[codemirror-json-schema](../README.md) / json5

# Module: json5

## Table of contents

### Codemirror Extensions

- [json5SchemaHover](json5.md#json5schemahover)
- [json5SchemaLinter](json5.md#json5schemalinter)

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

[json5-hover.ts:11](https://github.com/acao/cm6-language-json-schema/blob/958509c/src/json5-hover.ts#L11)

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

[json5-validation.ts:10](https://github.com/acao/cm6-language-json-schema/blob/958509c/src/json5-validation.ts#L10)
