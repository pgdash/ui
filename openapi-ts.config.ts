
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.json",
  output: [
    {
      postProcess: ["biome:format"],
      path: "client",
    },
  ],
  plugins: [
    "@hey-api/typescript",
    {
      name: "@hey-api/sdk",
      operations: {
        strategy: "flat",
      },
    },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
    "@hey-api/client-ky",
  ],
});