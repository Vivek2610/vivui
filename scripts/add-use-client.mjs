// Postbuild: prepends `"use client";` to every JS/CJS file in dist/.
//
// Why a postbuild script: tsup → Rollup chunk-splitting strips module-level
// directives during chunk merge. Adding the directive after chunking is
// the most reliable way to ensure Next.js App Router treats every entry as
// a client boundary, while still allowing tree-shaking via splitting.
//
// (This mirrors what shadcn/ui and other Tailwind+Radix-flavored libraries
// do in their build pipelines.)

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const DIRECTIVE = '"use client";\n';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let count = 0;
for await (const file of walk(DIST)) {
  if (!/\.(c?js)$/.test(file)) continue;
  const src = await readFile(file, "utf8");
  if (src.startsWith('"use client"') || src.startsWith("'use client'")) continue;
  await writeFile(file, DIRECTIVE + src, "utf8");
  count++;
}

const sizeKb = ((await stat(DIST)).size / 1024).toFixed(1);
console.log(`✓ Added "use client" to ${count} files in dist/ (${sizeKb} KB)`);
