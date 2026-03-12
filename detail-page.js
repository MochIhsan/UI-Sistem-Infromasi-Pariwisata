// ================================
// detail-page.js
// Popup foto (lightbox) + reveal on scroll + rating stars + like
// ================================

(function () {
  // ====== Reveal on scroll ======
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-in");
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // ====== Lightbox ======
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");

  function openLightbox(src) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbImg) lbImg.src = "";
  }

  document.querySelectorAll(".accd-imgBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.full || btn.querySelector("img")?.src;
      if (src) openLightbox(src);
    });
  });

  // tombol "Lihat Semua Foto" 
  // ====== Popup Semua Foto ======
const galleryPopup = document.getElementById("galleryPopup");
const galleryGrid = document.getElementById("galleryGrid");
const galleryClose = document.getElementById("galleryClose");

const openAll = document.getElementById("openAllPhotos");

if (openAll) {
  openAll.addEventListener("click", () => {

// ambil SEMUA foto dari data-full 
const sources = Array.from(document.querySelectorAll(".accd-gal button"))
  .map(btn => btn.dataset.full || btn.querySelector("img")?.src)
  .filter(Boolean);

// hilangkan duplikat
const allPhotos = [...new Set(sources)];

galleryGrid.innerHTML = "";

allPhotos.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Foto Akomodasi";
  galleryGrid.appendChild(img);
});

    galleryPopup.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
}

if (galleryClose) {
  galleryClose.addEventListener("click", () => {
    galleryPopup.classList.remove("is-open");
    document.body.style.overflow = "";
  });
}

galleryPopup?.addEventListener("click", (e) => {
  if (e.target === galleryPopup) {
    galleryPopup.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ====== Rating stars input ======
  const starsWrap = document.getElementById("revStars");
  if (starsWrap) {
    const starBtns = starsWrap.querySelectorAll(".rev-starBtn");

    function paint(val) {
      starBtns.forEach((b) => {
        const v = Number(b.dataset.val || "0");
        b.textContent = v <= val ? "★" : "☆";
        b.style.color = v <= val ? "#f59e0b" : "#cbd5e1";
      });
      starsWrap.dataset.rating = String(val);
    }

    starBtns.forEach((b) => {
      b.addEventListener("click", () => {
        const val = Number(b.dataset.val || "0");
        starsWrap.classList.add("is-set");
        paint(val);
      });
    });

    // init
    paint(0);
  }

  // ====== Like button ======
  document.querySelectorAll(".rev-like").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-liked");
      btn.textContent = btn.classList.contains("is-liked") ? "♥" : "♡";
    });
  });
})();