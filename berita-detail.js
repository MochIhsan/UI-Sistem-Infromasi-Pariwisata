// ===== Scroll reveal (animasi saat scroll) =====
(function () {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-in");
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
})();

// ===== Slider tombol kiri/kanan =====
(function () {
  const slider = document.getElementById("nwdSlider");
  if (!slider) return;

  const btns = document.querySelectorAll(".nwd-navBtn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.dir;
      const amount = Math.round(slider.clientWidth * 0.9);
      slider.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    });
  });

  // drag to scroll (biar enak di desktop)
  let isDown = false, startX = 0, startScroll = 0;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("is-drag");
    startX = e.pageX;
    startScroll = slider.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("is-drag");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    slider.scrollLeft = startScroll - dx;
  });
})();