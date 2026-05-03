[**codemirror-json-schema-refined**](../README.md)

---

[codemirror-json-schema-refined](../README.md) / HoverOptions

# Type Alias: HoverOptions

> **HoverOptions** = `object`

Defined in: [src/features/hover.ts:25](https://github.com/yusing/codemirror-json-schema/blob/1bcfccbf157424c333bf9dd63b734986b72eff1a/src/features/hover.ts#L25)

## Properties

### formatHover?

> `optional` **formatHover?**: (`data`) => `HTMLElement`

Defined in: [src/features/hover.ts:34](https://github.com/yusing/codemirror-json-schema/blob/1bcfccbf157424c333bf9dd63b734986b72eff1a/src/features/hover.ts#L34)

Generate the hover tooltip HTML

#### Parameters

##### data

`HoverTexts`

#### Returns

`HTMLElement`

---

### getHoverTexts?

> `optional` **getHoverTexts?**: (`data`) => `HoverTexts`

Defined in: [src/features/hover.ts:30](https://github.com/yusing/codemirror-json-schema/blob/1bcfccbf157424c333bf9dd63b734986b72eff1a/src/features/hover.ts#L30)

Generate the text to display in the hover tooltip

#### Parameters

##### data

[`FoundCursorData`](FoundCursorData.md)

#### Returns

`HoverTexts`

---

### mode?

> `optional` **mode?**: `JSONMode`

Defined in: [src/features/hover.ts:26](https://github.com/yusing/codemirror-json-schema/blob/1bcfccbf157424c333bf9dd63b734986b72eff1a/src/features/hover.ts#L26)

---

### parser?

> `optional` **parser?**: (`text`) => `any`

Defined in: [src/features/hover.ts:39](https://github.com/yusing/codemirror-json-schema/blob/1bcfccbf157424c333bf9dd63b734986b72eff1a/src/features/hover.ts#L39)

Provide a custom parser for the document

#### Parameters

##### text

`string`

#### Returns

`any`

#### Default

```ts
JSON.parse;
```
