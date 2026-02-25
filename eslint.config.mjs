import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/compat";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  js.configs.recommended,

  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);