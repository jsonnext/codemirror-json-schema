// yaml
export { yamlSchemaLinter } from "./validation.js";
export { yamlSchemaHover } from "./hover.js";
export { yamlCompletion } from "./completion.js";

/**
 * @group Bundled Codemirror Extensions
 */
export { yamlSchema } from "./bundled.js";

export * from "../utils/parseJSON5Document.js";
