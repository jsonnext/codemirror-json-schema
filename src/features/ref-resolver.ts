import type { JSONSchema7 } from "json-schema";
import type { SchemaNode } from "json-schema-library";
import { compileSchema } from "../utils/compile-schema";
import { normalizeRefSiblings } from "../utils/normalize-schema";
import { mapSubschemas } from "../utils/schema-walk";

export type FetchSchemaFn = (url: string) => Promise<any | undefined>;

/**
 * Recursively walks a JSON schema object and collects all external `$ref` URLs
 * (those starting with `http://` or `https://`). Fragments (`#/...`) are stripped
 * to produce base URLs. Returns a deduplicated `Set<string>`.
 */
export function collectExternalRefs(
  schema: any,
  collected?: Set<string>,
): Set<string> {
  const refs = collected ?? new Set<string>();
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return refs;
  }

  if (typeof schema.$ref === "string") {
    const ref: string = schema.$ref;
    if (ref.startsWith("http://") || ref.startsWith("https://")) {
      // Strip fragment to get the base URL
      const baseUrl = ref.split("#")[0];
      if (baseUrl) {
        refs.add(baseUrl);
      }
    }
  }

  mapSubschemas(schema, (subschema) => collectExternalRefs(subschema, refs));

  return refs;
}

export class RefResolver {
  private cache: Map<string, any> = new Map();
  private pending: Map<string, Promise<any | undefined>> = new Map();
  private fetchSchema: FetchSchemaFn;

  constructor(fetchSchema: FetchSchemaFn) {
    this.fetchSchema = fetchSchema;
  }

  async compileAndResolve(raw: JSONSchema7): Promise<SchemaNode> {
    // Normalizing is idempotent, so schemas from the editor state, which
    // are already normalized, are unchanged.
    const schema = normalizeRefSiblings(raw);
    const node = compileSchema(schema);

    const visited = new Set<string>();
    await this.resolveRefs(schema, node, visited);

    return node;
  }

  private async resolveRefs(
    schema: any,
    node: SchemaNode,
    visited: Set<string>,
  ): Promise<void> {
    const refs = collectExternalRefs(schema);

    // Filter out already-visited URLs (cycle prevention)
    const newUrls: string[] = [];
    for (const url of refs) {
      if (!visited.has(url)) {
        visited.add(url);
        newUrls.push(url);
      }
    }

    if (newUrls.length === 0) return;

    // Fetch all new URLs in parallel
    const results = await Promise.allSettled(
      newUrls.map((url) => this.fetchOne(url)),
    );

    // Register fetched schemas and collect them for transitive resolution
    const fetchedSchemas: any[] = [];
    for (let i = 0; i < newUrls.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled" && result.value != null) {
        const fetched = normalizeRefSiblings(result.value);
        node.addRemoteSchema(newUrls[i], fetched);
        fetchedSchemas.push(fetched);
      }
    }

    // Recursively resolve transitive refs from fetched schemas
    for (const fetched of fetchedSchemas) {
      await this.resolveRefs(fetched, node, visited);
    }
  }

  private fetchOne(url: string): Promise<any | undefined> {
    // Return from cache if available
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }

    // Deduplicate in-flight requests
    if (this.pending.has(url)) {
      return this.pending.get(url)!;
    }

    const promise = this.fetchSchema(url).then(
      (result) => {
        if (result != null) {
          this.cache.set(url, result);
        }
        this.pending.delete(url);
        return result;
      },
      () => {
        this.pending.delete(url);
        return undefined;
      },
    );

    this.pending.set(url, promise);
    return promise;
  }
}
