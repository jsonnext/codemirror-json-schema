import { describe, expect, it } from "vitest";
import { compileSchema } from "../compile-schema";

// A node picks its definition with if/then on "type", like a discriminated
// union, and nodes nest through "children".
const kinds = Array.from({ length: 30 }, (_, i) => `kind${i}`);
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $ref: "#/$defs/node",
  $defs: {
    node: {
      type: "object",
      required: ["type"],
      properties: {
        type: { enum: kinds },
        children: { type: "array", items: { $ref: "#/$defs/node" } },
      },
      allOf: kinds.map((kind) => ({
        if: { properties: { type: { const: kind } }, required: ["type"] },
        then: { properties: { size: { type: "number" } } },
      })),
    },
  },
};

describe("compileSchema", () => {
  it("applies then when if matches, else otherwise", () => {
    const node = compileSchema({
      if: { properties: { kind: { const: "a" } } },
      then: { required: ["a"] },
      else: { required: ["b"] },
    });
    expect(node.validate({ kind: "a" }).errors).toHaveLength(1);
    expect(node.validate({ kind: "a", a: 1 }).valid).toBe(true);
    expect(node.validate({ kind: "x" }).errors).toHaveLength(1);
    expect(node.validate({ kind: "x", b: 1 }).valid).toBe(true);
  });

  it("validates conditional definitions in nested documents", () => {
    const node = compileSchema(schema);
    const doc = {
      type: "kind0",
      children: [
        { type: "kind1", size: 2 },
        { type: "kind2", size: "big" },
      ],
    };
    const { errors } = node.validate(doc);
    expect(errors).toHaveLength(1);
    expect(errors[0].data.pointer).toBe("#/children/1/size");
  });

  it("keeps $dynamicRef scope inside if", () => {
    const node = compileSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/strict",
      $ref: "https://example.com/base",
      $defs: {
        item: { $dynamicAnchor: "item", type: "number" },
        base: {
          $id: "https://example.com/base",
          type: "object",
          if: { properties: { v: { $dynamicRef: "#item" } } },
          then: { required: ["ok"] },
          $defs: { item: { $dynamicAnchor: "item", type: "string" } },
        },
      },
    });
    // In the dynamic scope "#item" is the root's number definition, so "if"
    // matches and "ok" is required. Resolved statically it would be base's
    // string definition, "if" would fail and the document would be valid.
    expect(node.validate({ v: 1 }).valid).toBe(false);
  });

  it("counts properties evaluated by then/else for unevaluatedProperties", () => {
    const node = compileSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      properties: { kind: { type: "string" } },
      if: { properties: { kind: { const: "a" } } },
      then: { properties: { a: { type: "number" } } },
      else: { properties: { b: { type: "number" } } },
      unevaluatedProperties: false,
    });
    expect(node.validate({ kind: "a", a: 1 }).valid).toBe(true);
    expect(node.validate({ kind: "x", b: 1 }).valid).toBe(true);
    expect(node.validate({ kind: "a", b: 1 }).valid).toBe(false);
    expect(node.validate({ kind: "x", a: 1 }).valid).toBe(false);
  });

  it("validates large documents in linear time", () => {
    const node = compileSchema(schema);
    const doc = (n: number) => ({
      type: "kind0",
      children: Array.from({ length: n }, (_, i) => ({
        type: kinds[i % kinds.length],
        children: [{ type: "kind1" }, { type: "kind2" }],
      })),
    });
    const time = (n: number) => {
      const start = performance.now();
      expect(node.validate(doc(n)).valid).toBe(true);
      return performance.now() - start;
    };
    time(50); // warm up
    const small = time(200);
    const large = time(1600);
    // 8× the nodes: linear is ~8×, the path copying this guards against
    // made it ~60×.
    expect(large / small).toBeLessThan(25);
  });
});
