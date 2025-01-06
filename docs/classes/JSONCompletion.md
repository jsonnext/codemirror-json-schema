[codemirror-json-schema](../README.md) / JSONCompletion

# Class: JSONCompletion

## Table of contents

### Constructors

- [constructor](JSONCompletion.md#constructor)

### Methods

- [addBooleanValueCompletion](JSONCompletion.md#addbooleanvaluecompletion)
- [addDefaultValueCompletions](JSONCompletion.md#adddefaultvaluecompletions)
- [addEnumValueCompletions](JSONCompletion.md#addenumvaluecompletions)
- [addNullValueCompletion](JSONCompletion.md#addnullvaluecompletion)
- [addSchemaValueCompletions](JSONCompletion.md#addschemavaluecompletions)
- [applySnippetCompletion](JSONCompletion.md#applysnippetcompletion)
- [collectTypes](JSONCompletion.md#collecttypes)
- [doComplete](JSONCompletion.md#docomplete)
- [doCompleteForSchema](JSONCompletion.md#docompleteforschema)
- [extendedRegExp](JSONCompletion.md#extendedregexp)
- [getAppliedValue](JSONCompletion.md#getappliedvalue)
- [getInsertTextForGuessedValue](JSONCompletion.md#getinserttextforguessedvalue)
- [getInsertTextForPlainText](JSONCompletion.md#getinserttextforplaintext)
- [getInsertTextForProperty](JSONCompletion.md#getinserttextforproperty)
- [getInsertTextForPropertyName](JSONCompletion.md#getinserttextforpropertyname)
- [getInsertTextForString](JSONCompletion.md#getinserttextforstring)
- [getInsertTextForValue](JSONCompletion.md#getinserttextforvalue)
- [getPropertyCompletions](JSONCompletion.md#getpropertycompletions)
- [getSchemas](JSONCompletion.md#getschemas)
- [getValueCompletions](JSONCompletion.md#getvaluecompletions)
- [getValueFromLabel](JSONCompletion.md#getvaluefromlabel)

### Properties

- [laxSchema](JSONCompletion.md#laxschema)
- [mode](JSONCompletion.md#mode)
- [opts](JSONCompletion.md#opts)
- [originalSchema](JSONCompletion.md#originalschema)
- [parser](JSONCompletion.md#parser)
- [schema](JSONCompletion.md#schema)

## Constructors

### constructor

• **new JSONCompletion**(`opts`)

#### Parameters

| Name   | Type                                                              |
| :----- | :---------------------------------------------------------------- |
| `opts` | [`JSONCompletionOptions`](../interfaces/JSONCompletionOptions.md) |

#### Defined in

[features/completion.ts:87](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L87)

## Methods

### addBooleanValueCompletion

▸ `Private` **addBooleanValueCompletion**(`value`, `collector`): `void`

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `value`     | `boolean`             |
| `collector` | `CompletionCollector` |

#### Returns

`void`

#### Defined in

[features/completion.ts:856](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L856)

---

### addDefaultValueCompletions

▸ `Private` **addDefaultValueCompletions**(`schema`, `collector`, `arrayDepth?`): `void`

#### Parameters

| Name         | Type                  | Default value |
| :----------- | :-------------------- | :------------ |
| `schema`     | `JSONSchema7`         | `undefined`   |
| `collector`  | `CompletionCollector` | `undefined`   |
| `arrayDepth` | `number`              | `0`           |

#### Returns

`void`

#### Defined in

[features/completion.ts:785](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L785)

---

### addEnumValueCompletions

▸ `Private` **addEnumValueCompletions**(`schema`, `collector`): `void`

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `schema`    | `JSONSchema7`         |
| `collector` | `CompletionCollector` |

#### Returns

`void`

#### Defined in

[features/completion.ts:831](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L831)

---

### addNullValueCompletion

▸ `Private` **addNullValueCompletion**(`collector`): `void`

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `collector` | `CompletionCollector` |

#### Returns

`void`

#### Defined in

[features/completion.ts:866](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L866)

---

### addSchemaValueCompletions

▸ `Private` **addSchemaValueCompletions**(`schema`, `types`, `collector`): `void`

#### Parameters

| Name        | Type                    |
| :---------- | :---------------------- |
| `schema`    | `JSONSchema7Definition` |
| `types`     | `Object`                |
| `collector` | `CompletionCollector`   |

#### Returns

`void`

#### Defined in

[features/completion.ts:756](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L756)

---

### applySnippetCompletion

▸ `Private` **applySnippetCompletion**(`completion`): `Completion`

#### Parameters

| Name         | Type         |
| :----------- | :----------- |
| `completion` | `Completion` |

#### Returns

`Completion`

#### Defined in

[features/completion.ts:301](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L301)

---

### collectTypes

▸ `Private` **collectTypes**(`schema`, `types`): `void`

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `schema` | `JSONSchema7` |
| `types`  | `Object`      |

#### Returns

`void`

#### Defined in

[features/completion.ts:873](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L873)

---

### doComplete

▸ **doComplete**(`ctx`): `never`[] \| `CompletionResult`

#### Parameters

| Name  | Type                |
| :---- | :------------------ |
| `ctx` | `CompletionContext` |

#### Returns

`never`[] \| `CompletionResult`

#### Defined in

[features/completion.ts:92](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L92)

---

### doCompleteForSchema

▸ `Private` **doCompleteForSchema**(`ctx`, `rootSchema`): `CompletionResult`

#### Parameters

| Name         | Type                |
| :----------- | :------------------ |
| `ctx`        | `CompletionContext` |
| `rootSchema` | `JSONSchema7`       |

#### Returns

`CompletionResult`

#### Defined in

[features/completion.ts:124](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L124)

---

### extendedRegExp

▸ `Private` **extendedRegExp**(`pattern`): `undefined` \| `RegExp`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `pattern` | `string` |

#### Returns

`undefined` \| `RegExp`

#### Defined in

[features/completion.ts:1038](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L1038)

---

### getAppliedValue

▸ `Private` **getAppliedValue**(`value`): `Object`

#### Parameters

| Name    | Type  |
| :------ | :---- |
| `value` | `any` |

#### Returns

`Object`

| Name    | Type     |
| :------ | :------- |
| `apply` | `string` |
| `label` | `string` |

#### Defined in

[features/completion.ts:1013](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L1013)

---

### getInsertTextForGuessedValue

▸ `Private` **getInsertTextForGuessedValue**(`value`, `separatorAfter?`): `string`

#### Parameters

| Name             | Type     | Default value |
| :--------------- | :------- | :------------ |
| `value`          | `any`    | `undefined`   |
| `separatorAfter` | `string` | `""`          |

#### Returns

`string`

#### Defined in

[features/completion.ts:570](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L570)

---

### getInsertTextForPlainText

▸ `Private` **getInsertTextForPlainText**(`text`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[features/completion.ts:593](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L593)

---

### getInsertTextForProperty

▸ `Private` **getInsertTextForProperty**(`key`, `addValue`, `rawWord`, `rootSchema`, `propertySchema?`): `string`

#### Parameters

| Name              | Type                    |
| :---------------- | :---------------------- |
| `key`             | `string`                |
| `addValue`        | `boolean`               |
| `rawWord`         | `string`                |
| `rootSchema`      | `JSONSchema7`           |
| `propertySchema?` | `JSONSchema7Definition` |

#### Returns

`string`

#### Defined in

[features/completion.ts:422](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L422)

---

### getInsertTextForPropertyName

▸ `Private` **getInsertTextForPropertyName**(`key`, `rawWord`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `key`     | `string` |
| `rawWord` | `string` |

#### Returns

`string`

#### Defined in

[features/completion.ts:541](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L541)

---

### getInsertTextForString

▸ `Private` **getInsertTextForString**(`value`, `prf?`): `string`

#### Parameters

| Name    | Type     | Default value |
| :------ | :------- | :------------ |
| `value` | `string` | `undefined`   |
| `prf`   | `string` | `"#"`         |

#### Returns

`string`

#### Defined in

[features/completion.ts:558](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L558)

---

### getInsertTextForValue

▸ `Private` **getInsertTextForValue**(`value`, `separatorAfter`): `string`

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `value`          | `any`    |
| `separatorAfter` | `string` |

#### Returns

`string`

#### Defined in

[features/completion.ts:597](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L597)

---

### getPropertyCompletions

▸ `Private` **getPropertyCompletions**(`rootSchema`, `ctx`, `node`, `collector`, `addValue`, `rawWord`): `void`

#### Parameters

| Name         | Type                  |
| :----------- | :-------------------- |
| `rootSchema` | `JSONSchema7`         |
| `ctx`        | `CompletionContext`   |
| `node`       | `SyntaxNode`          |
| `collector`  | `CompletionCollector` |
| `addValue`   | `boolean`             |
| `rawWord`    | `string`              |

#### Returns

`void`

#### Defined in

[features/completion.ts:310](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L310)

---

### getSchemas

▸ `Private` **getSchemas**(`rootSchema`, `ctx`): `JSONSchema7Definition`[]

#### Parameters

| Name         | Type                |
| :----------- | :------------------ |
| `rootSchema` | `JSONSchema7`       |
| `ctx`        | `CompletionContext` |

#### Returns

`JSONSchema7Definition`[]

#### Defined in

[features/completion.ts:888](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L888)

---

### getValueCompletions

▸ `Private` **getValueCompletions**(`rootSchema`, `ctx`, `types`, `collector`): `undefined` \| \{ `valuePrefix`: `string` }

#### Parameters

| Name         | Type                  |
| :----------- | :-------------------- |
| `rootSchema` | `JSONSchema7`         |
| `ctx`        | `CompletionContext`   |
| `types`      | `Object`              |
| `collector`  | `CompletionCollector` |

#### Returns

`undefined` \| \{ `valuePrefix`: `string` }

#### Defined in

[features/completion.ts:607](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L607)

---

### getValueFromLabel

▸ `Private` **getValueFromLabel**(`value`): `string`

#### Parameters

| Name    | Type  |
| :------ | :---- |
| `value` | `any` |

#### Returns

`string`

#### Defined in

[features/completion.ts:1034](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L1034)

## Properties

### laxSchema

• `Private` **laxSchema**: `null` \| `JSONSchema7` = `null`

Inlined (expanded) top-level $ref if present.
Does not contain any required properties and allows any additional properties everywhere.

#### Defined in

[features/completion.ts:81](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L81)

---

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[features/completion.ts:82](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L82)

---

### opts

• `Private` **opts**: [`JSONCompletionOptions`](../interfaces/JSONCompletionOptions.md)

#### Defined in

[features/completion.ts:87](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L87)

---

### originalSchema

• `Private` **originalSchema**: `null` \| `JSONSchema7` = `null`

#### Defined in

[features/completion.ts:72](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L72)

---

### parser

• `Private` **parser**: `DocumentParser`

#### Defined in

[features/completion.ts:83](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L83)

---

### schema

• `Private` **schema**: `null` \| `JSONSchema7` = `null`

Inlined (expanded) top-level $ref if present.

#### Defined in

[features/completion.ts:76](https://github.com/jsonnext/codemirror-json-schema/blob/aa27ad7/src/features/completion.ts#L76)
