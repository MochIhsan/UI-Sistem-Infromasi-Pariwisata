// destinasi.js
(function () {
  // ====== Gallery Modal ======
  const gallery = document.getElementById("destinasiGallery");
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalImg");
  const modalClose = document.getElementById("imgModalClose");

  function openModal(src) {
    modalImg.src = src;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-full]");
      if (!btn) return;
      openModal(btn.getAttribute("data-full"));
    });
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ====== Review (demo frontend) ======
  const form = document.getElementById("reviewForm");
  const list = document.getElementById("reviewList");

  function getSelectedRating() {
    const r = document.querySelector('input[name="rate"]:checked');
    return r ? parseInt(r.value, 10) : 5;
  }

  function stars(n) {
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  if (form && list) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("reviewName").value.trim();
      const text = document.getElementById("reviewText").value.trim();
      const rate = getSelectedRating();

      if (!name || !text) return;

      const initials = name.trim().charAt(0).toUpperCase();

      const item = document.createElement("article");
      item.className = "destdetail__reviewItem";
      item.innerHTML = `
        <div class="destdetail__reviewAvatar">${initials}</div>
        <div class="destdetail__reviewBody">
          <div class="destdetail__reviewHead">
            <div class="destdetail__reviewName">${name}</div>
            <div class="destdetail__reviewMiniStars">${stars(rate)}</div>
          </div>
          <p class="destdetail__reviewText">${text}</p>
        </div>
      `;

      // insert ke atas
      list.prepend(item);

      form.reset();
      // set default 5
      const r5 = document.getElementById("r5");
      if (r5) r5.checked = true;
    });
  }
})();