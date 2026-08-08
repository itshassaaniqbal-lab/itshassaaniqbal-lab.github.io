import { build } from "esbuild";

await Promise.all([
  build({
    entryPoints: ["ModelEmbed.webgl"],
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    jsx: "automatic",
    minify: true,
    loader: { ".webgl": "tsx" },
    outfile: "../../public/expertise-model.js",
  }),
  build({
    entryPoints: ["expertise-motion.ts"],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2022",
    minify: true,
    outfile: "../../public/expertise-motion.js",
  }),
]);
