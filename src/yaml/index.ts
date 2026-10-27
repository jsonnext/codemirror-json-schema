// yaml
export { yamlSchemaLinter } from "./validation";
export { yamlSchemaHover } from "./hover";
export { yamlCompletion } from "./completion";

/**
 * @group Bundled Codemirror Extensions
 */
export { yamlSchema, type YamlSchemaOptions } from "./bundled";

export * from "../parsers/yaml-parser";
