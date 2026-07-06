/*
  HOW TO USE (run this on your own machine, in the project folder):

    1. npm install sharp --save-dev
    2. node scripts/optimize-images.js

  WHAT IT DOES:
  For every .jpg/.jpeg/.png in assets/images/ it creates:
    - assets/images/<name>.webp   (modern format, ~30-50% smaller, used first)
    - assets/images/<name>.jpg    (resized + compressed, used as fallback)

  Your original files are NOT overwritten in place — this writes new files
  into assets/images/optimized/, so you can compare before/after and then
  swap the folder in once you're happy with quality.

  This matches the file-naming pattern used by js/services-data.js
  (e.g. "assets/images/pic3" -> pic3.webp + pic3.jpg), so once you copy the
  optimized files over, no HTML/JS changes are needed.
*/

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(__dirname, "..", "assets", "images");
const OUTPUT_DIR = path.join(SOURCE_DIR, "optimized");

// Max width for service card images — they never display wider than this,
// so there's no reason to ship a 4000px photo straight from a phone camera.
const MAX_WIDTH = 900;
const JPG_QUALITY = 72;
const WEBP_QUALITY = 68;

async function run() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source folder not found: ${SOURCE_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => /\.(jpe?g|png)$/i.test(f));

  if (files.length === 0) {
    console.log("No .jpg/.jpeg/.png files found in assets/images/");
    return;
  }

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const jpgOut = path.join(OUTPUT_DIR, `${baseName}.jpg`);
    const webpOut = path.join(OUTPUT_DIR, `${baseName}.webp`);

    const before = fs.statSync(inputPath).size;

    const pipeline = sharp(inputPath).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    await pipeline.clone().jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(jpgOut);
    await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut);

    const afterJpg = fs.statSync(jpgOut).size;
    const afterWebp = fs.statSync(webpOut).size;

    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB -> jpg ${(afterJpg / 1024).toFixed(
        0
      )}KB, webp ${(afterWebp / 1024).toFixed(0)}KB`
    );
  }

  console.log(`\nDone. Check assets/images/optimized/, then copy those files\ninto assets/images/ (overwriting the old ones) once you're happy.`);
}

run();
