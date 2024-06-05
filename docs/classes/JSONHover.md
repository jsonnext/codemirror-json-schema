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

[features/hover.ts:88](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L88)

## Methods

### doHover

▸ **doHover**(`view`, `pos`, `side`): `Promise`\<`null` \| `Tooltip`\>

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `view` | `EditorView` |
| `pos`  | `number`     |
| `side` | `Side`       |

#### Returns

`Promise`\<`null` \| `Tooltip`\>

#### Defined in

[features/hover.ts:203](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L203)

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

[features/hover.ts:136](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L136)

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

[features/hover.ts:95](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L95)

---

### getHoverTexts

▸ **getHoverTexts**(`data`, `draft`): `HoverTexts`

#### Parameters

| Name    | Type                                                  |
| :------ | :---------------------------------------------------- |
| `data`  | `Required`\<[`CursorData`](../README.md#cursordata)\> |
| `draft` | `Draft`                                               |

#### Returns

`HoverTexts`

#### Defined in

[features/hover.ts:162](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L162)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[features/hover.ts:87](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L87)

---

### opts

• `Private` `Optional` **opts**: [`HoverOptions`](../README.md#hoveroptions)

#### Defined in

[features/hover.ts:88](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L88)

---

### schema

• `Private` **schema**: `null` \| `Draft` = `null`

#### Defined in

[features/hover.ts:86](https://github.com/jsonnext/codemirror-json-schema/blob/2356a94/src/features/hover.ts#L86)
