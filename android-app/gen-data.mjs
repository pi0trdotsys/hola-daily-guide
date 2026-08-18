import { readFileSync, writeFileSync } from "fs";
import { parseMarkdown } from "./www/parser.mjs";

const md = readFileSync("./trip.md", "utf8");
const data = parseMarkdown(md);

const out =
  "// Wygenerowano z trip.md za pomocą gen-data.mjs.\n" +
  "// Markdown (trip.md) jest źródłową bazą danych tego przewodnika.\n" +
  "window.__TRIP__ = " +
  JSON.stringify(data, null, 2) +
  ";\n";

writeFileSync("./www/data.js", out, "utf8");
console.log("OK: www/data.js", out.length, "bytes");