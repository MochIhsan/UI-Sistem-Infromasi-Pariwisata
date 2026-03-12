// event-detail.js

// ===== Scroll reveal animation =====
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// ===== Dokumentasi slider (scroll-snap) =====
(() => {
  const slider = document.getElementById("docSlider");
  if (!slider) return;

  const btnPrev = document.querySelector('[data-slide="prev"]');
  const btnNext = document.querySelector('[data-slide="next"]');

  const slideBy = () => slider.clientWidth * 0.9; // geser 1 "halaman" yang nyaman

  btnPrev?.addEventListener("click", () => {
    slider.scrollBy({ left: -slideBy(), behavior: "smooth" });
  });

  btnNext?.addEventListener("click", () => {
    slider.scrollBy({ left: slideBy(), behavior: "smooth" });
  });

  // Drag / swipe support (desktop)
  let isDown = false;
  let startX = 0;
  let startLeft = 0;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("is-drag");
    startX = e.pageX;
    startLeft = slider.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("is-drag");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    slider.scrollLeft = startLeft - dx;
  });

  // Touch support (mobile)
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX;
    startLeft = slider.scrollLeft;
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    const dx = e.touches[0].pageX - startX;
    slider.scrollLeft = startLeft - dx;
  }, { passive: true });
})();