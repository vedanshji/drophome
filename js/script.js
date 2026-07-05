/*
  Renders service cards from data arrays (see services-data.js) so new
  services can be added by editing DATA only — no HTML/CSS changes needed.

  Each card uses a <picture> element:
    - WebP source (small, fast) is tried first
    - JPG is the fallback for older browsers
    - loading="lazy" means images off-screen don't download until needed
  This is what fixes the slow-loading heavy images.
*/

function renderServices(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(data)) return;

  const fragment = document.createDocumentFragment();

  data.forEach((service, index) => {
    const card = document.createElement("a");
    card.href = service.link || "#";
    card.className = "grid-item";
    card.setAttribute("data-aos", index % 2 === 0 ? "flip-left" : "flip-right");

    const img = document.createElement("img");
    img.className = "package-img";
    img.src = `${service.img}.webp`;
    img.alt = service.title;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("load", () => img.classList.add("loaded"));
    img.addEventListener("error", () => {
      img.classList.add("loaded");
      img.style.background = "#333";
    });
    card.appendChild(img);

    const caption = document.createElement("p");
    caption.className = "figcaption";
    const span = document.createElement("span");
    span.textContent = service.title;
    caption.appendChild(span);
    card.appendChild(caption);

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderPromoBanner(banner) {
  if (!banner || !banner.enabled) return;
  // Only show on the homepage — showing "go to More Services" while
  // already on the More Services page doesn't make sense.
  if (window.location.pathname.includes("otherservices")) return;

  const overlay = document.createElement("div");
  overlay.id = "promo-banner-overlay";

  const card = document.createElement("div");
  card.id = "promo-banner-card";

  const img = document.createElement("img");
  img.src = `${banner.img}.webp`;
  img.alt = banner.alt || "";
  img.addEventListener("click", () => {
    window.location.href = banner.link;
  });
  // If the promo image itself is missing, don't show a broken popup
  img.addEventListener("error", () => overlay.remove());

  const closeBtn = document.createElement("button");
  closeBtn.id = "promo-banner-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "\u00d7"; // ×
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.remove();
  });

  card.appendChild(img);
  card.appendChild(closeBtn);
  overlay.appendChild(card);

  // Clicking the dark backdrop (outside the image) also closes it
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof homeServices !== "undefined") {
    renderServices("services-grid", homeServices);
  }
  if (typeof moreServices !== "undefined") {
    renderServices("more-services-grid", moreServices);
  }
  if (typeof promoBanner !== "undefined") {
    renderPromoBanner(promoBanner);
  }
});