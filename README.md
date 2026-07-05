<<<<<<< HEAD
## Drop Home
=======
# What changed

## 1. Services are now data-driven (no more hardcoded HTML)
All service cards on both `index.html` and `otherservices.html` are now
generated automatically from `js/services-data.js`.

**To add a new service:** open `js/services-data.js`, add one object to
`homeServices` (for the homepage) or `moreServices` (for the More page):

```js
{
  img: "assets/images/pic-new-service",   // no extension
  title: "New Service Name",
  link: "#"
},
```

Then put `pic-new-service.jpg` and `pic-new-service.webp` in
`assets/images/`. That's it — no HTML editing, no CSS editing.

I left `// TODO(client request)` markers in that file where the new
service(s) the customer asked for should go. Send me the names and I'll
fill them in for you.

## 2. Image loading fix
Two changes were made:

- **`loading="lazy"`** on every image — images below the fold don't
  download until the user scrolls near them.
- **`<picture>` with WebP + JPG fallback** — browsers that support WebP
  (nearly all of them now) get a file that's typically 30-50% smaller than
  a JPG at the same visual quality. Older browsers still get the JPG.
- Cards now reserve their space with a dark placeholder background before
  the image loads, so the page doesn't jump around (this alone often fixes
  the "feels slow/janky" complaint even before file sizes shrink).

## 3. Compressing your existing images
I don't have your actual image files, so I couldn't compress them from my
end. Instead, run this once on your machine:

```bash
npm install sharp --save-dev
node scripts/optimize-images.js
```

This reads everything in `assets/images/`, resizes anything wider than
900px (service cards never display bigger than that anyway), and writes
compressed `.jpg` + `.webp` pairs into `assets/images/optimized/`. Check
the console output for before/after file sizes, then copy those files into
`assets/images/` once you're happy with how they look.

## Folder structure expected
```
project/
├── index.html
├── otherservices.html
├── css/style.css
├── js/services-data.js
├── js/script.js
├── scripts/optimize-images.js
└── assets/images/...
```
>>>>>>> f0bee04 (optimised/added new services)
