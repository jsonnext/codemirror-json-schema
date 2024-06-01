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

[features/completion.ts:58](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L58)

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

[features/completion.ts:775](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L775)

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

[features/completion.ts:704](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L704)

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

[features/completion.ts:750](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L750)

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

[features/completion.ts:785](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L785)

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

[features/completion.ts:678](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L678)

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

[features/completion.ts:245](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L245)

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

[features/completion.ts:792](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L792)

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

[features/completion.ts:61](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L61)

---

### expandSchemaProperty

▸ `Private` **expandSchemaProperty**\<`T`\>(`property`, `schema`): `T`

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

[features/completion.ts:863](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L863)

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

[features/completion.ts:926](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L926)

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

[features/completion.ts:901](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L901)

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

[features/completion.ts:497](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L497)

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

[features/completion.ts:519](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L519)

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

[features/completion.ts:352](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L352)

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

[features/completion.ts:469](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L469)

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

[features/completion.ts:485](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L485)

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

[features/completion.ts:523](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L523)

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

[features/completion.ts:254](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L254)

---

### getReferenceSchema

▸ `Private` **getReferenceSchema**(`schema`, `ref`): `Record`\<`string`, `any`\>

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `schema` | `JSONSchema7` |
| `ref`    | `string`      |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[features/completion.ts:882](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L882)

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

[features/completion.ts:807](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L807)

---

### getValueCompletions

▸ `Private` **getValueCompletions**(`schema`, `ctx`, `types`, `collector`): `undefined` \| \{ `valuePrefix`: `string` }

#### Parameters

| Name        | Type                  |
| :---------- | :-------------------- |
| `schema`    | `JSONSchema7`         |
| `ctx`       | `CompletionContext`   |
| `types`     | `Object`              |
| `collector` | `CompletionCollector` |

#### Returns

`undefined` \| \{ `valuePrefix`: `string` }

#### Defined in

[features/completion.ts:533](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L533)

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

[features/completion.ts:922](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L922)

## Properties

### mode

• `Private` **mode**: `JSONMode` = `MODES.JSON`

#### Defined in

[features/completion.ts:57](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L57)

---

### opts

• `Private` **opts**: [`JSONCompletionOptions`](../interfaces/JSONCompletionOptions.md)

#### Defined in

[features/completion.ts:58](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L58)

---

### schema

• `Private` **schema**: `null` \| `JSONSchema7` = `null`

#### Defined in

[features/completion.ts:56](https://github.com/jsonnext/codemirror-json-schema/blob/c982a74/src/features/completion.ts#L56)
