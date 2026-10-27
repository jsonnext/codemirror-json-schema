import { describe, it, expect, vi } from "vitest";
import { collectExternalRefs, RefResolver } from "../ref-resolver";

describe("collectExternalRefs", () => {
  it("should return empty set for schema without refs", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    };
    expect(collectExternalRefs(schema).size).toBe(0);
  });

  it("should collect external HTTP $ref URLs", () => {
    const schema = {
      type: "object",
      properties: {
        supplier: { $ref: "https://example.com/schemas/party" },
      },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(1);
    expect(refs.has("https://example.com/schemas/party")).toBe(true);
  });

  it("should strip fragments from URLs", () => {
    const schema = {
      type: "object",
      properties: {
        supplier: {
          $ref: "https://example.com/schemas/party#/$defs/Address",
        },
      },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(1);
    expect(refs.has("https://example.com/schemas/party")).toBe(true);
  });

  it("should ignore local $ref (starting with #)", () => {
    const schema = {
      type: "object",
      properties: {
        supplier: { $ref: "#/$defs/Party" },
      },
      $defs: {
        Party: { type: "object" },
      },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(0);
  });

  it("should deduplicate URLs", () => {
    const schema = {
      type: "object",
      properties: {
        supplier: { $ref: "https://example.com/schemas/party" },
        customer: { $ref: "https://example.com/schemas/party" },
      },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(1);
  });

  it("should walk allOf, anyOf, oneOf", () => {
    const schema = {
      allOf: [{ $ref: "https://example.com/a" }],
      anyOf: [{ $ref: "https://example.com/b" }],
      oneOf: [{ $ref: "https://example.com/c" }],
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(3);
  });

  it("should walk items, additionalProperties, if/then/else", () => {
    const schema = {
      type: "object",
      properties: {
        list: {
          type: "array",
          items: { $ref: "https://example.com/item" },
        },
      },
      additionalProperties: { $ref: "https://example.com/extra" },
      if: { $ref: "https://example.com/cond" },
      then: { $ref: "https://example.com/then" },
      else: { $ref: "https://example.com/else" },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(5);
  });

  it("should walk $defs and definitions", () => {
    const schema = {
      $defs: {
        Foo: { $ref: "https://example.com/foo" },
      },
      definitions: {
        Bar: { $ref: "https://example.com/bar" },
      },
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(2);
  });

  it("should walk patternProperties and prefixItems", () => {
    const schema = {
      patternProperties: {
        "^x-": { $ref: "https://example.com/ext" },
      },
      prefixItems: [{ $ref: "https://example.com/first" }],
    };
    const refs = collectExternalRefs(schema);
    expect(refs.size).toBe(2);
  });

  it("should handle null/undefined schema gracefully", () => {
    expect(collectExternalRefs(null).size).toBe(0);
    expect(collectExternalRefs(undefined).size).toBe(0);
  });
});

describe("RefResolver", () => {
  it("should compile a schema without external refs", async () => {
    const fetchSchema = vi.fn();
    const resolver = new RefResolver(fetchSchema);
    const schema = {
      type: "object" as const,
      properties: {
        name: { type: "string" as const },
      },
    };
    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
    expect(node.schema).toBeDefined();
    expect(fetchSchema).not.toHaveBeenCalled();
  });

  it("should fetch and register external refs", async () => {
    const remoteSchema = {
      type: "object",
      properties: {
        street: { type: "string" },
      },
    };
    const fetchSchema = vi.fn().mockResolvedValue(remoteSchema);
    const resolver = new RefResolver(fetchSchema);

    const schema = {
      type: "object" as const,
      properties: {
        address: { $ref: "https://example.com/schemas/address" },
      },
    };

    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
    expect(fetchSchema).toHaveBeenCalledWith(
      "https://example.com/schemas/address",
    );
  });

  it("should handle transitive refs", async () => {
    const addressSchema = {
      type: "object",
      properties: {
        country: { $ref: "https://example.com/schemas/country" },
      },
    };
    const countrySchema = {
      type: "object",
      properties: {
        code: { type: "string" },
      },
    };

    const fetchSchema = vi.fn().mockImplementation(async (url: string) => {
      if (url === "https://example.com/schemas/address") return addressSchema;
      if (url === "https://example.com/schemas/country") return countrySchema;
      return undefined;
    });

    const resolver = new RefResolver(fetchSchema);
    const schema = {
      type: "object" as const,
      properties: {
        address: { $ref: "https://example.com/schemas/address" },
      },
    };

    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
    expect(fetchSchema).toHaveBeenCalledTimes(2);
    expect(fetchSchema).toHaveBeenCalledWith(
      "https://example.com/schemas/address",
    );
    expect(fetchSchema).toHaveBeenCalledWith(
      "https://example.com/schemas/country",
    );
  });

  it("should handle fetch failures gracefully", async () => {
    const fetchSchema = vi.fn().mockRejectedValue(new Error("Network error"));
    const resolver = new RefResolver(fetchSchema);

    const schema = {
      type: "object" as const,
      properties: {
        address: { $ref: "https://example.com/schemas/address" },
      },
    };

    // Should not throw
    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
  });

  it("should deduplicate concurrent fetches for the same URL", async () => {
    let fetchCount = 0;
    const fetchSchema = vi.fn().mockImplementation(async () => {
      fetchCount++;
      return { type: "object" };
    });

    const resolver = new RefResolver(fetchSchema);
    const schema = {
      type: "object" as const,
      properties: {
        a: { $ref: "https://example.com/schemas/shared" },
        b: { $ref: "https://example.com/schemas/shared" },
      },
    };

    await resolver.compileAndResolve(schema);
    expect(fetchCount).toBe(1);
  });

  it("should cache fetched schemas across calls", async () => {
    const fetchSchema = vi.fn().mockResolvedValue({ type: "object" });
    const resolver = new RefResolver(fetchSchema);

    const schema = {
      type: "object" as const,
      properties: {
        address: { $ref: "https://example.com/schemas/address" },
      },
    };

    await resolver.compileAndResolve(schema);
    await resolver.compileAndResolve(schema);
    expect(fetchSchema).toHaveBeenCalledTimes(1);
  });

  it("should prevent cycles in transitive refs", async () => {
    const schemaA = {
      type: "object",
      properties: {
        b: { $ref: "https://example.com/b" },
      },
    };
    const schemaB = {
      type: "object",
      properties: {
        a: { $ref: "https://example.com/a" },
      },
    };

    const fetchSchema = vi.fn().mockImplementation(async (url: string) => {
      if (url === "https://example.com/a") return schemaA;
      if (url === "https://example.com/b") return schemaB;
      return undefined;
    });

    const resolver = new RefResolver(fetchSchema);
    const schema = {
      type: "object" as const,
      properties: {
        a: { $ref: "https://example.com/a" },
      },
    };

    // Should not hang or recurse infinitely
    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
    // a -> b -> a (but a is already visited, so stops)
    expect(fetchSchema).toHaveBeenCalledTimes(2);
  });

  it("should handle fetchSchema returning undefined", async () => {
    const fetchSchema = vi.fn().mockResolvedValue(undefined);
    const resolver = new RefResolver(fetchSchema);

    const schema = {
      type: "object" as const,
      properties: {
        address: { $ref: "https://example.com/schemas/address" },
      },
    };

    const node = await resolver.compileAndResolve(schema);
    expect(node).toBeDefined();
    expect(fetchSchema).toHaveBeenCalledTimes(1);
  });
});

describe("collectExternalRefs keywords", () => {
  it("should walk every schema-bearing keyword", () => {
    const ref = (name: string) => ({ $ref: `https://example.com/${name}` });
    const schema = {
      not: ref("not"),
      propertyNames: ref("propertyNames"),
      dependentSchemas: { a: ref("dependentSchemas") },
      dependencies: { b: ref("dependencies"), c: ["a"] },
      contentSchema: ref("contentSchema"),
      additionalItems: ref("additionalItems"),
      unevaluatedItems: ref("unevaluatedItems"),
      unevaluatedProperties: ref("unevaluatedProperties"),
      properties: { default: ref("property-named-default") },
    };
    expect([...collectExternalRefs(schema)].sort()).toEqual(
      [
        "additionalItems",
        "contentSchema",
        "dependencies",
        "dependentSchemas",
        "not",
        "property-named-default",
        "propertyNames",
        "unevaluatedItems",
        "unevaluatedProperties",
      ].map((name) => `https://example.com/${name}`),
    );
  });

  it("should not treat data as schemas", () => {
    const schema = {
      const: { $ref: "https://example.com/const" },
      enum: [{ $ref: "https://example.com/enum" }],
      default: { $ref: "https://example.com/default" },
      examples: [{ $ref: "https://example.com/examples" }],
    };
    expect(collectExternalRefs(schema).size).toBe(0);
  });
});

describe("RefResolver validation", () => {
  it("should enforce constraints from fetched schemas", async () => {
    const fetchSchema = vi.fn().mockResolvedValue({
      $defs: { code: { enum: ["a", "b"] } },
      type: "object",
      required: ["street"],
      properties: { street: { type: "string" } },
    });
    const resolver = new RefResolver(fetchSchema);
    const node = await resolver.compileAndResolve({
      type: "object",
      properties: {
        address: { $ref: "https://example.com/address" },
        code: { $ref: "https://example.com/address#/$defs/code" },
      },
    });
    expect(
      node.validate({ address: { street: "Main" }, code: "a" }).valid,
    ).toBe(true);
    expect(node.validate({ address: {} }).valid).toBe(false);
    expect(node.validate({ address: { street: 1 } }).valid).toBe(false);
    expect(node.validate({ code: "c" }).valid).toBe(false);
  });

  it("should normalize $ref sibling keywords in the root schema", async () => {
    const resolver = new RefResolver(vi.fn());
    const node = await resolver.compileAndResolve({
      $defs: { key: { type: "string" } },
      type: "object",
      properties: { key: { $ref: "#/$defs/key", enum: ["a"] } },
    });
    // Like schemas set through the editor state, so lookups such as
    // completion keep the enum next to the $ref.
    expect((node.schema as any).properties.key).toEqual({
      allOf: [{ $ref: "#/$defs/key" }, { enum: ["a"] }],
    });
    expect(node.validate({ key: "b" }).valid).toBe(false);
  });
});
