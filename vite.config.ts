import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "happy-dom",
    maxConcurrency: 10,
    pool: "forks",
    disableConsoleIntercept: Boolean(process.env.CI),
    exclude: [".trunk/**", "node_modules/**"],
  },
});
