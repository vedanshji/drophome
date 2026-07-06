#!/usr/bin/env node
/*
  HOW TO USE:
    1. Place this at your PROJECT ROOT (same level as index.html).
    2. Run: node diagnose.js
    3. It writes a full report to diagnose-report.txt in the same folder
       AND prints it to the terminal — open that file and send me its
       full contents so nothing gets lost in terminal scrollback.
*/

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const problems = [];
const ok = [];
const lines = []; // everything we print also gets collected here

function log(msg = "") {
  console.log(msg);
  lines.push(msg);
}

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8");
}

function report(pass, message) {
  (pass ? ok : problems).push(message);
}

log(`Diagnostics run at: ${new Date().toString()}`);
log(`Project root (this script's folder): ${ROOT}\n`);

// 0. Dump the root folder listing FIRST, before anything else, so we can
//    see the real folder layout regardless of what any check below finds.
log("=== Contents of project root ===");
fs.readdirSync(ROOT).forEach((f) => {
  const stat = fs.statSync(path.join(ROOT, f));
  log(`  ${stat.isDirectory() ? "[DIR] " : "      "}${f}`);
});

// 0b. Dump assets/images listing FIRST too, before the checks reference it.
const imagesDir = path.join(ROOT, "assets", "images");
log(`\n=== Contents of assets/images (${imagesDir}) ===`);
if (fs.existsSync(imagesDir)) {
  const actualFiles = fs.readdirSync(imagesDir);
  if (actualFiles.length === 0) {
    log("  (folder exists but is EMPTY)");
  } else {
    actualFiles.forEach((f) => log(`  - ${f}`));
  }
} else {
  log(`  (this folder does NOT exist at: ${imagesDir})`);
}

log("\n=== Running checks ===\n");

// 1. Do the core files exist at all, at THIS location?
["index.html", "otherservices.html", "css/style.css", "js/script.js", "js/services-data.js"].forEach((f) => {
  report(fs.existsSync(path.join(ROOT, f)), `Missing file: ${f} (expected at ${path.join(ROOT, f)})`);
});

// 2. Does js/script.js actually contain the NEW rendering code, or is it
//    still the old placeholder/joke file (common if the file wasn't
//    actually overwritten, just added alongside)?
const scriptJs = readFile("js/script.js");
if (scriptJs !== null) {
  report(scriptJs.includes("renderServices"), "js/script.js does NOT contain the renderServices() function — this is likely still the OLD file. Make sure you overwrote js/script.js with the new version, not saved it under a different name.");
  report(scriptJs.includes("DOMContentLoaded"), "js/script.js is missing the DOMContentLoaded listener that triggers rendering.");
}

// 3. Does services-data.js define the arrays script.js expects?
const dataJs = readFile("js/services-data.js");
if (dataJs !== null) {
  report(/const\s+homeServices\s*=/.test(dataJs), "js/services-data.js does not define `homeServices`.");
  report(/const\s+moreServices\s*=/.test(dataJs), "js/services-data.js does not define `moreServices`.");
  report(/const\s+promoBanner\s*=/.test(dataJs), "js/services-data.js does not define `promoBanner` — you're likely still on the OLD services-data.js. Replace it with the latest version.");
}

// 3b. Does script.js contain the promo banner rendering code?
if (scriptJs !== null) {
  report(scriptJs.includes("renderPromoBanner"), "js/script.js does NOT contain renderPromoBanner() — you're likely still on the OLD script.js. Replace it with the latest version.");
}

// 4. Does index.html actually load both JS files, in the right order,
//    and does it have the container the script renders into?
const indexHtml = readFile("index.html");
if (indexHtml !== null) {
  report(indexHtml.includes('services-data.js'), "index.html does not include a <script> tag for js/services-data.js.");
  report(indexHtml.includes('src="js/script.js"') || indexHtml.includes("src='js/script.js'"), "index.html does not include a <script> tag for js/script.js.");
  report(indexHtml.includes('id="services-grid"'), 'index.html is missing <div id="services-grid"> — without this exact id, renderServices() has nowhere to insert the cards.');

  const dataIndex = indexHtml.indexOf("services-data.js");
  const scriptIndex = indexHtml.indexOf('src="js/script.js"');
  if (dataIndex !== -1 && scriptIndex !== -1) {
    report(dataIndex < scriptIndex, "js/script.js is loaded BEFORE js/services-data.js in index.html — script.js needs the data arrays to already exist. Swap their order so services-data.js comes first.");
  }
}

// 5. Same checks for otherservices.html
const otherHtml = readFile("otherservices.html");
if (otherHtml !== null) {
  report(otherHtml.includes('services-data.js'), "otherservices.html does not include a <script> tag for js/services-data.js.");
  report(otherHtml.includes('src="js/script.js"') || otherHtml.includes("src='js/script.js'"), "otherservices.html does not include a <script> tag for js/script.js.");
  report(otherHtml.includes('id="more-services-grid"'), 'otherservices.html is missing <div id="more-services-grid">.');
}

// 6. Do the image files referenced in services-data.js actually exist?
//    (Strip block/line comments first so the commented-out EXAMPLE entry
//    at the top of services-data.js doesn't get picked up as a real
//    service. Site now renders .webp directly — no .jpg fallback needed.)
if (dataJs !== null) {
  const dataJsNoBlockComments = dataJs.replace(/\/\*[\s\S]*?\*\//g, "");
  const dataJsNoComments = dataJsNoBlockComments
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const imgBases = [...dataJsNoComments.matchAll(/img:\s*["']([^"']+)["']/g)].map((m) => m[1]);

  log(`\nChecking ${imgBases.length} image entries found in services-data.js (excluding commented-out examples): ${imgBases.join(", ")}`);

  imgBases.forEach((base) => {
    const webpPath = path.join(ROOT, `${base}.webp`);
    const webpExists = fs.existsSync(webpPath);
    report(webpExists, `Missing image: ${base}.webp  (looked at: ${webpPath})`);
  });
}

log(`\n=== PASSED (${ok.length}) ===`);
ok.forEach((m) => log(`  OK: ${m}`));

log(`\n=== PROBLEMS (${problems.length}) ===`);
if (problems.length === 0) {
  log("  None found by this script.");
  log("\n  If images still don't render, the issue is likely browser-side:");
  log("  1. Open the page, press F12 (DevTools), go to the Console tab —");
  log("     copy any red error text you see.");
  log("  2. Go to the Network tab, reload the page, filter by 'Img' —");
  log("     look for any request showing red/404 and note its exact URL.");
  log("  3. Hard-refresh to rule out cache: Ctrl+Shift+R (Windows) or");
  log("     Cmd+Shift+R (Mac).");
} else {
  problems.forEach((m) => log(`  PROBLEM: ${m}`));
}

fs.writeFileSync(path.join(ROOT, "diagnose-report.txt"), lines.join("\n"), "utf8");
log(`\nFull report also saved to: ${path.join(ROOT, "diagnose-report.txt")}`);