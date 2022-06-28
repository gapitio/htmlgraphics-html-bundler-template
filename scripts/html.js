import { readFileSync, writeFileSync } from "fs";

const IN_PATH = "src/html.html";
const OUT_PATH = "dist/html.html";

const writeHTML = () => {
  const html = readFileSync(IN_PATH, "utf8");
  writeFileSync(OUT_PATH, html);
  console.log(`Successfully written ${OUT_PATH}`);
};

writeHTML();
