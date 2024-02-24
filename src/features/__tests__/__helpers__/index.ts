import { JSONMode } from "../../../types";
import { MODES } from "../../../constants";
import { JSONSchema7 } from "json-schema";
import { jsonSchema } from "../../../json/bundled";
import { json5Schema } from "../../../json5/bundled";
import { yamlSchema } from "../../../yaml/bundled";

export const getExtensions = (mode: JSONMode, schema?: JSONSchema7) => {
  switch (mode) {
    case MODES.JSON:
      return jsonSchema(schema);
    case MODES.JSON5:
      return json5Schema(schema);
    case MODES.YAML:
      return yamlSchema(schema);
  }
};
