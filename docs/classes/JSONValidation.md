[codemirror-json-schema](../README.md) / JSONValidation

# Class: JSONValidation

## Table of contents

### Utilities

- [parser](JSONValidation.md#parser)

### Accessors

- [schemaTitle](JSONValidation.md#schematitle)

### Constructors

- [constructor](JSONValidation.md#constructor)

### Methods

- [doValidation](JSONValidation.md#dovalidation)
- [rewriteError](JSONValidation.md#rewriteerror)

### Properties

- [mode](JSONValidation.md#mode)
- [options](JSONValidation.md#options)
- [schema](JSONValidation.md#schema)

## Utilities

### parser

• `Private` **parser**: (`state`: `EditorState`) => { `data`: `any` ; `pointers`: [`JSONPointersMap`](../README.md#jsonpointersmap) } = `parseJSONDocumentState`

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

[json-validation.ts:78](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L78)

## Accessors

### schemaTitle

• `Private` `get` **schemaTitle**(): `any`

#### Returns

`any`

#### Defined in

[json-validation.ts:89](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L89)

## Constructors

### constructor

• **new JSONValidation**(`options?`)

#### Parameters

| Name       | Type                                                              |
| :--------- | :---------------------------------------------------------------- |
| `options?` | [`JSONValidationOptions`](../interfaces/JSONValidationOptions.md) |

#### Defined in

[json-validation.ts:79](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L79)

## Methods

### doValidation

▸ **doValidation**(`view`): `Diagnostic`[]

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |

#### Returns

`Diagnostic`[]

#### Defined in

[json-validation.ts:120](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L120)

---

### rewriteError

▸ `Private` **rewriteError**(`error`): `string`

#### Parameters

| Name    | Type        |
| :------ | :---------- |
| `error` | `JsonError` |

#### Returns

`string`

#### Defined in

[json-validation.ts:94](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L94)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[json-validation.ts:77](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L77)

---

### options

• `Private` `Optional` **options**: [`JSONValidationOptions`](../interfaces/JSONValidationOptions.md)

#### Defined in

[json-validation.ts:79](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L79)

---

### schema

• `Private` **schema**: `null` \| `Draft` = `null`

#### Defined in

[json-validation.ts:75](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-validation.ts#L75)
