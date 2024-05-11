[codemirror-json-schema](../README.md) / JSONValidationOptions

# Interface: JSONValidationOptions

## Table of contents

### Utilities

- [jsonParser](JSONValidationOptions.md#jsonparser)

### Properties

- [formatError](JSONValidationOptions.md#formaterror)
- [mode](JSONValidationOptions.md#mode)

## Utilities

### jsonParser

• `Optional` **jsonParser**: (`state`: `EditorState`) => { `data`: `any` ; `pointers`: [`JSONPointersMap`](../README.md#jsonpointersmap) }

#### Type declaration

▸ (`state`): `Object`

Return parsed data and json pointers for a given codemirror EditorState

##### Parameters

| Name    | Type          |
| :------ | :------------ |
| `state` | `EditorState` |

##### Returns

`Object`

| Name       | Type                                              |
| :--------- | :------------------------------------------------ |
| `data`     | `any`                                             |
| `pointers` | [`JSONPointersMap`](../README.md#jsonpointersmap) |

#### Defined in

[json-validation.ts:43](https://github.com/acao/codemirror-json-schema/blob/0dc3749/src/json-validation.ts#L43)

## Properties

### formatError

• `Optional` **formatError**: (`error`: `JsonError`) => `string`

#### Type declaration

▸ (`error`): `string`

##### Parameters

| Name    | Type        |
| :------ | :---------- |
| `error` | `JsonError` |

##### Returns

`string`

#### Defined in

[json-validation.ts:42](https://github.com/acao/codemirror-json-schema/blob/0dc3749/src/json-validation.ts#L42)

---

### mode

• `Optional` **mode**: `JSONMode`

#### Defined in

[json-validation.ts:41](https://github.com/acao/codemirror-json-schema/blob/0dc3749/src/json-validation.ts#L41)
