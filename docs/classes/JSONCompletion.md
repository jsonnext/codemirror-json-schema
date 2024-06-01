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
- [expandSchemaProperty](JSONCompletion.md#expandschemaproperty)
- [extendedRegExp](JSONCompletion.md#extendedregexp)
- [getAppliedValue](JSONCompletion.md#getappliedvalue)
- [getInsertTextForGuessedValue](JSONCompletion.md#getinserttextforguessedvalue)
- [getInsertTextForPlainText](JSONCompletion.md#getinserttextforplaintext)
- [getInsertTextForProperty](JSONCompletion.md#getinserttextforproperty)
- [getInsertTextForPropertyName](JSONCompletion.md#getinserttextforpropertyname)
- [getInsertTextForString](JSONCompletion.md#getinserttextforstring)
- [getInsertTextForValue](JSONCompletion.md#getinserttextforvalue)
- [getPropertyCompletions](JSONCompletion.md#getpropertycompletions)
- [getReferenceSchema](JSONCompletion.md#getreferenceschema)
- [getSchemas](JSONCompletion.md#getschemas)
- [getValueCompletions](JSONCompletion.md#getvaluecompletions)
- [getValueFromLabel](JSONCompletion.md#getvaluefromlabel)

### Properties

- [mode](JSONCompletion.md#mode)
- [opts](JSONCompletion.md#opts)
- [schema](JSONCompletion.md#schema)

## Constructors

### constructor

• **new JSONCompletion**(`opts`)

#### Parameters

| Name   | Type                                                              |
| :----- | :---------------------------------------------------------------- |
| `opts` | [`JSONCompletionOptions`](../interfaces/JSONCompletionOptions.md) |

#### Defined in

[json-completion.ts:57](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L57)

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

[json-completion.ts:774](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L774)

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

[json-completion.ts:703](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L703)

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

[json-completion.ts:749](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L749)

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

[json-completion.ts:784](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L784)

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

[json-completion.ts:677](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L677)

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

[json-completion.ts:244](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L244)

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

[json-completion.ts:791](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L791)

---

### doComplete

▸ **doComplete**(`ctx`): `CompletionResult` \| `never`[]

#### Parameters

| Name  | Type                |
| :---- | :------------------ |
| `ctx` | `CompletionContext` |

#### Returns

`CompletionResult` \| `never`[]

#### Defined in

[json-completion.ts:60](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L60)

---

### expandSchemaProperty

▸ `Private` **expandSchemaProperty**<`T`\>(`property`, `schema`): `T`

#### Type parameters

| Name | Type                            |
| :--- | :------------------------------ |
| `T`  | extends `JSONSchema7Definition` |

#### Parameters

| Name       | Type          |
| :--------- | :------------ |
| `property` | `T`           |
| `schema`   | `JSONSchema7` |

#### Returns

`T`

#### Defined in

[json-completion.ts:862](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L862)

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

[json-completion.ts:925](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L925)

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

[json-completion.ts:900](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L900)

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

[json-completion.ts:496](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L496)

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

[json-completion.ts:518](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L518)

---

### getInsertTextForProperty

▸ `Private` **getInsertTextForProperty**(`key`, `addValue`, `rawWord`, `propertySchema?`): `string`

#### Parameters

| Name              | Type                    |
| :---------------- | :---------------------- |
| `key`             | `string`                |
| `addValue`        | `boolean`               |
| `rawWord`         | `string`                |
| `propertySchema?` | `JSONSchema7Definition` |

#### Returns

`string`

#### Defined in

[json-completion.ts:351](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L351)

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

[json-completion.ts:468](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L468)

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

[json-completion.ts:484](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L484)

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

[json-completion.ts:522](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L522)

---

### getPropertyCompletions

▸ `Private` **getPropertyCompletions**(`schema`, `ctx`, `node`, `collector`, `addValue`, `rawWord`): `void`

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `schema`    | `JSONSchema7`         |
| `ctx`       | `CompletionContext`   |
| `node`      | `SyntaxNode`          |
| `collector` | `CompletionCollector` |
| `addValue`  | `boolean`             |
| `rawWord`   | `string`              |

#### Returns

`void`

#### Defined in

[json-completion.ts:253](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L253)

---

### getReferenceSchema

▸ `Private` **getReferenceSchema**(`schema`, `ref`): `Record`<`string`, `any`\>

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `schema` | `JSONSchema7` |
| `ref`    | `string`      |

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[json-completion.ts:881](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L881)

---

### getSchemas

▸ `Private` **getSchemas**(`schema`, `ctx`): `JSONSchema7Definition`[]

#### Parameters

| Name     | Type                |
| :------- | :------------------ |
| `schema` | `JSONSchema7`       |
| `ctx`    | `CompletionContext` |

#### Returns

`JSONSchema7Definition`[]

#### Defined in

[json-completion.ts:806](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L806)

---

### getValueCompletions

▸ `Private` **getValueCompletions**(`schema`, `ctx`, `types`, `collector`): `undefined` \| { `valuePrefix`: `string` }

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `schema`    | `JSONSchema7`         |
| `ctx`       | `CompletionContext`   |
| `types`     | `Object`              |
| `collector` | `CompletionCollector` |

#### Returns

`undefined` \| { `valuePrefix`: `string` }

#### Defined in

[json-completion.ts:532](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L532)

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

[json-completion.ts:921](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L921)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[json-completion.ts:56](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L56)

---

### opts

• `Private` **opts**: [`JSONCompletionOptions`](../interfaces/JSONCompletionOptions.md)

#### Defined in

[json-completion.ts:57](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L57)

---

### schema

• `Private` **schema**: `null` \| `JSONSchema7` = `null`

#### Defined in

[json-completion.ts:55](https://github.com/acao/codemirror-json-schema/blob/296617f/src/json-completion.ts#L55)
