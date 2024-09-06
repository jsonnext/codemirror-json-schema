import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    maxConcurrency: 10,
    // configuration to be able to view console.log messages while debugging
    pool: "forks",
    disableConsoleIntercept: true,
  },
});
