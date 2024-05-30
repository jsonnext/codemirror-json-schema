[codemirror-json-schema](../README.md) / JSONHover

# Class: JSONHover

## Table of contents

### Constructors

- [constructor](JSONHover.md#constructor)

### Methods

- [doHover](JSONHover.md#dohover)
- [formatMessage](JSONHover.md#formatmessage)
- [getDataForCursor](JSONHover.md#getdataforcursor)
- [getHoverTexts](JSONHover.md#gethovertexts)

### Properties

- [mode](JSONHover.md#mode)
- [opts](JSONHover.md#opts)
- [schema](JSONHover.md#schema)

## Constructors

### constructor

• **new JSONHover**(`opts?`)

#### Parameters

| Name    | Type                                        |
| :------ | :------------------------------------------ |
| `opts?` | [`HoverOptions`](../README.md#hoveroptions) |

#### Defined in

[json-hover.ts:67](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L67)

## Methods

### doHover

▸ **doHover**(`view`, `pos`, `side`): `Promise`<`null` \| `Tooltip`\>

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |
| `pos`  | `number`     |
| `side` | `Side`       |

#### Returns

`Promise`<`null` \| `Tooltip`\>

#### Defined in

[json-hover.ts:176](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L176)

---

### formatMessage

▸ `Private` **formatMessage**(`texts`): `HTMLElement`

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `texts` | `HoverTexts` |

#### Returns

`HTMLElement`

#### Defined in

[json-hover.ts:115](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L115)

---

### getDataForCursor

▸ **getDataForCursor**(`view`, `pos`, `side`): `null` \| [`CursorData`](../README.md#cursordata)

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |
| `pos`  | `number`     |
| `side` | `Side`       |

#### Returns

`null` \| [`CursorData`](../README.md#cursordata)

#### Defined in

[json-hover.ts:74](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L74)

---

### getHoverTexts

▸ **getHoverTexts**(`data`, `draft`): `HoverTexts`

#### Parameters

| Name    | Type                                                 |
| :------ | :--------------------------------------------------- |
| `data`  | `Required`<[`CursorData`](../README.md#cursordata)\> |
| `draft` | `Draft`                                              |

#### Returns

`HoverTexts`

#### Defined in

[json-hover.ts:141](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L141)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[json-hover.ts:66](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L66)

---

### opts

• `Private` `Optional` **opts**: [`HoverOptions`](../README.md#hoveroptions)

#### Defined in

[json-hover.ts:67](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L67)

---

### schema

• `Private` **schema**: `null` \| `Draft` = `null`

#### Defined in

[json-hover.ts:65](https://github.com/acao/codemirror-json-schema/blob/da7f368/src/json-hover.ts#L65)
