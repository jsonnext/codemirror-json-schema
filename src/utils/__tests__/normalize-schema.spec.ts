import { describe, expect, it } from "vitest";
import { normalizeRefSiblings } from "../normalize-schema";

describe("normalizeRefSiblings", () => {
  it("should move $ref siblings into an allOf", () => {
    expect(
      normalizeRefSiblings({
        properties: { key: { $ref: "#/$defs/key", title: "Key", enum: ["a"] } },
      }),
    ).toEqual({
      properties: {
        key: {
          title: "Key",
          allOf: [{ $ref: "#/$defs/key" }, { enum: ["a"] }],
        },
      },
    });
  });

  it("should leave data keywords unchanged", () => {
    const schema = {
      const: { $ref: "literal", type: "string" },
      enum: [{ $ref: "literal", type: "string" }],
      default: { $ref: "literal", type: "string" },
      examples: [{ $ref: "literal", type: "string" }],
    };
    expect(normalizeRefSiblings(schema)).toEqual(schema);
  });

  it("should normalize properties whose names are keywords", () => {
    expect(
      normalizeRefSiblings({
        properties: { const: { $ref: "#/$defs/key", enum: ["a"] } },
      }),
    ).toEqual({
      properties: {
        const: { allOf: [{ $ref: "#/$defs/key" }, { enum: ["a"] }] },
      },
    });
  });

  it("should leave draft-04 to draft-07 schemas unchanged", () => {
    for (const draft of ["draft-04", "draft-06", "draft-07"]) {
      const schema = {
        $schema: `http://json-schema.org/${draft}/schema#`,
        properties: { key: { $ref: "#/$defs/key", type: "string" } },
      };
      expect(normalizeRefSiblings(schema)).toEqual(schema);
    }
  });

  it("should follow nested $schema declarations", () => {
    const legacy = {
      $schema: "http://json-schema.org/draft-07/schema#",
      properties: { key: { $ref: "#/definitions/key", type: "string" } },
    };
    expect(
      normalizeRefSiblings({
        $schema: "https://json-schema.org/draft/2020-12/schema",
        $defs: { legacy },
        properties: { key: { $ref: "#/$defs/key", type: "string" } },
      }),
    ).toEqual({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $defs: { legacy },
      properties: {
        key: { allOf: [{ $ref: "#/$defs/key" }, { type: "string" }] },
      },
    });
  });
});
