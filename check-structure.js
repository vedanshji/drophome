#!/usr/bin/env node
/*
  HOW TO USE:
    1. Place this file at your PROJECT ROOT (same level as index.html).
    2. Run: node check-structure.js
    3. It tells you exactly which required files are missing and where
       it looked for them — no more guessing why images don't render.
*/

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
let missing = [];
let found = [];

function check(relPath) {
  const full = path.join(ROOT, relPath);
  if (fs.existsSync(full)) {
    found.push(relPath);
  } else {
    missing.push(relPath);
  }
}

// Core files
["index.html", "otherservices.html", "css/style.css", "js/script.js", "js/services-data.js"]
  .forEach(check);

// Pull image paths straight out of services-data.js so this stays in sync
// automatically if you add more services later.
const dataFile = path.join(ROOT, "js", "services-data.js");
if (fs.existsSync(dataFile)) {
  const content = fs.readFileSync(dataFile, "utf8");
  const imgMatches = [...content.matchAll(/img:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  imgMatches.forEach((imgBase) => {
    check(`${imgBase}.jpg`);
    check(`${imgBase}.webp`);
  });
} else {
  console.log("Could not find js/services-data.js from this location.");
  console.log(`This script must sit at the project root, next to index.html.\nCurrent location: ${ROOT}\n`);
}

console.log(`\n✅ Found (${found.length}):`);
found.forEach((f) => console.log(`   ${f}`));

console.log(`\n❌ Missing (${missing.length}):`);
if (missing.length === 0) {
  console.log("   None! Your structure looks correct.");
} else {
  missing.forEach((f) => console.log(`   ${f}  <-- expected at ${path.join(ROOT, f)}`));
  console.log(
    "\nIf files are 'missing' but you know they exist somewhere in your project,\n" +
    "it usually means this script (and your HTML files) aren't sitting at the\n" +
    "same folder level as css/, js/, and assets/. Move things so index.html,\n" +
    "css/, js/, and assets/ are all direct siblings in the same folder."
  );
}
