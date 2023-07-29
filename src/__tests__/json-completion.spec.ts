import { describe, it } from "vitest";

import { expectCompletion } from "./__helpers__/completion";

describe("jsonCompletion", () => {
  it("should return completion data for simple types", async () => {
    await expectCompletion('{ "f| }', [
      {
        label: "foo",
        type: "property",
        detail: "string",
        info: "",
        template: '"foo": "#{}"',
      },
    ]);
  });
  it("should return completion data for simple types", async () => {
    await expectCompletion('{ "one| }', [
      {
        label: "oneOfEg",
        type: "property",
        detail: "",
        info: "an example oneOf",
        template: '"oneOfEg": ',
      },
      {
        label: "oneOfEg2",
        type: "property",
        detail: "",
        info: "",
        template: '"oneOfEg2": ',
      },
    ]);
  });
});
