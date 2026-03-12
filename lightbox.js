// lightbox.js
(function () {
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");

  const items = Array.from(document.querySelectorAll("[data-lb-item]"));
  let idx = 0;

  function openAt(i) {
    idx = Math.max(0, Math.min(i, items.length - 1));
    const el = items[idx];
    const src = el.getAttribute("data-lb-src") || el.getAttribute("src");
    const cap = el.getAttribute("data-lb-cap") || el.getAttribute("alt") || "";

    lbImg.src = src;
    lbImg.alt = cap || "Preview";
    lbCap.textContent = cap;

    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
    lbCap.textContent = "";
  }

  function next() {
    if (!items.length) return;
    openAt((idx + 1) % items.length);
  }

  function prev() {
    if (!items.length) return;
    openAt((idx - 1 + items.length) % items.length);
  }

  // Klik item -> open
  items.forEach((el, i) => {
    el.addEventListener("click", () => openAt(i));
  });

  // Tombol close/backdrop
  lb.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-lb-close]");
    const prevBtn = e.target.closest("[data-lb-prev]");
    const nextBtn = e.target.closest("[data-lb-next]");

    if (closeBtn) close();
    if (prevBtn) prev();
    if (nextBtn) next();
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();