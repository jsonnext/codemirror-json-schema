import { describe, expect, it, vi } from "vitest";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { jsonSchema } from "../../json/bundled";
import { json5Schema } from "../../json5/bundled";
import { yamlSchema } from "../../yaml/bundled";
import { getCompiledSchema, getJSONSchema } from "../state";
import { isSchemaOptions } from "../schema-config";

const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

describe("schemaResolverPlugin", () => {
  it("should keep the resolved node when fetching finishes first", async () => {
    // A fetch that resolves straight away completes resolution before the
    // deferred dispatch of the unresolved node.
    const fetchSchema = vi.fn().mockResolvedValue({
      type: "object",
      required: ["street"],
    });
    const view = new EditorView({
      state: EditorState.create({
        doc: "{}",
        extensions: [
          jsonSchema({
            schema: {
              type: "object",
              properties: {
                address: { $ref: "https://example.com/address" },
              },
            },
            fetchSchema,
          }),
        ],
      }),
    });
    await wait();
    const node = getCompiledSchema(view.state);
    expect(node?.validate({ address: {} }).valid).toBe(false);
    expect(node?.validate({ address: { street: "Main" } }).valid).toBe(true);
    view.destroy();
  });

  it("should not dispatch into a destroyed view", async () => {
    let resolve: (schema: unknown) => void = () => {};
    const fetchSchema = vi.fn(() => new Promise((r) => (resolve = r)));
    const view = new EditorView({
      state: EditorState.create({
        doc: "{}",
        extensions: [
          jsonSchema({
            schema: { $ref: "https://example.com/root" },
            fetchSchema,
          }),
        ],
      }),
    });
    view.destroy();
    const dispatch = vi.spyOn(view, "dispatch");
    resolve({ type: "object" });
    await wait();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("isSchemaOptions", () => {
  const schema = { type: "object" as const };

  it("should recognize options objects", () => {
    expect(isSchemaOptions({ schema })).toBe(true);
    expect(isSchemaOptions({ fetchSchema: () => Promise.resolve() })).toBe(
      true,
    );
    expect(isSchemaOptions({ schema, fetchSchema: vi.fn() })).toBe(true);
  });

  it("should not mistake schemas for options", () => {
    expect(isSchemaOptions(schema)).toBe(false);
    expect(isSchemaOptions({})).toBe(false);
    expect(isSchemaOptions(undefined)).toBe(false);
  });

  it.each([
    ["json", jsonSchema],
    ["json5", json5Schema],
    ["yaml", yamlSchema],
  ])("should apply { schema } options in %s", (_, extension) => {
    const state = EditorState.create({ extensions: [extension({ schema })] });
    expect(getJSONSchema(state)).toEqual(schema);
  });
});
