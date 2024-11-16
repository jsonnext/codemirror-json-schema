[codemirror-json-schema](../README.md) / JSONValidation

# Class: JSONValidation

## Table of contents

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
- [parser](JSONValidation.md#parser)
- [schema](JSONValidation.md#schema)

## Accessors

### schemaTitle

• `Private` `get` **schemaTitle**(): `any`

#### Returns

`any`

#### Defined in

[features/validation.ts:77](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L77)

## Constructors

### constructor

• **new JSONValidation**(`options?`)

#### Parameters

| Name       | Type                                                              |
| :--------- | :---------------------------------------------------------------- |
| `options?` | [`JSONValidationOptions`](../interfaces/JSONValidationOptions.md) |

#### Defined in

[features/validation.ts:67](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L67)

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

[features/validation.ts:108](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L108)

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

[features/validation.ts:82](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L82)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[features/validation.ts:65](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L65)

---

### options

• `Private` `Optional` **options**: [`JSONValidationOptions`](../interfaces/JSONValidationOptions.md)

#### Defined in

[features/validation.ts:67](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L67)

---

### parser

• `Private` **parser**: `DocumentParser`

#### Defined in

[features/validation.ts:66](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L66)

---

### schema

• `Private` **schema**: `null` \| `Draft` = `null`

#### Defined in

[features/validation.ts:63](https://github.com/jsonnext/codemirror-json-schema/blob/ef7f336/src/features/validation.ts#L63)
