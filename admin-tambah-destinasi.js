// admin-tambah-destinasi.js
(function () {
  // ===== Banner uploader =====
  const bannerDrop = document.getElementById("bannerDrop");
  const bannerInput = document.getElementById("bannerInput");
  const bannerPreview = document.getElementById("bannerPreview");
  const btnPickBanner = document.getElementById("btnPickBanner");

  function showBanner(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    bannerPreview.innerHTML = `<img src="${url}" alt="Preview banner">`;
    bannerPreview.style.display = "block";
  }

  btnPickBanner?.addEventListener("click", () => bannerInput.click());
  bannerDrop?.addEventListener("click", (e) => {
    // biar klik tombol tidak dobel trigger
    if (e.target === btnPickBanner) return;
    bannerInput.click();
  });

  bannerInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    showBanner(file);
  });

  ["dragenter", "dragover"].forEach((ev) => {
    bannerDrop?.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      bannerDrop.classList.add("is-drag");
    });
  });

  ["dragleave", "drop"].forEach((ev) => {
    bannerDrop?.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      bannerDrop.classList.remove("is-drag");
    });
  });

  bannerDrop?.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) showBanner(file);
  });

  // ===== Akses lokasi (chip) =====
  const aksesWrap = document.getElementById("aksesLokasi");
const aksesValue = document.getElementById("aksesValue");

function syncAksesValue() {
  const active = Array.from(aksesWrap.querySelectorAll(".td-chip.is-active"))
    .map((x) => x.dataset.value)
    .filter(Boolean);

  aksesValue.value = active.join(",");
}

aksesWrap?.addEventListener("click", (e) => {
  const btn = e.target.closest(".td-chip");
  if (!btn) return;

  btn.classList.toggle("is-active");
  syncAksesValue();
});

// panggil sekali saat awal (biar hidden input sesuai state awal)
syncAksesValue();

  // ===== Fasilitas (multi-select) =====
  const facGrid = document.getElementById("facGrid");
  const facValue = document.getElementById("facValue");

  function syncFacValue() {
    const active = Array.from(facGrid.querySelectorAll(".td-fac.is-active"))
      .map((x) => x.dataset.key)
      .filter(Boolean);
    facValue.value = active.join(",");
  }

  facGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest(".td-fac");
    if (!btn) return;
    btn.classList.toggle("is-active");
    syncFacValue();
  });

  syncFacValue();

  // ===== Map update by Lat/Lng =====
  const latInput = document.getElementById("latInput");
  const lngInput = document.getElementById("lngInput");
  const mapFrame = document.getElementById("mapFrame");

  function updateMap() {
    const lat = (latInput.value || "").trim();
    const lng = (lngInput.value || "").trim();
    if (!lat || !lng) return;
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=13&output=embed`;
  }

  latInput?.addEventListener("input", updateMap);
  lngInput?.addEventListener("input", updateMap);

  // ===== Editor sederhana (contenteditable) =====
  const descBox = document.getElementById("descBox");
  const edBtns = document.querySelectorAll(".td-edBtn");

  function ensurePlaceholder() {
    const text = descBox.textContent.replace(/\s+/g, " ").trim();
    const hasPh = descBox.querySelector(".td-editor__ph");
    if (!text && !hasPh) {
      descBox.innerHTML = `<span class="td-editor__ph">Tuliskan deskripsi lengkap tentang keindahan dan keunikan destinasi ini...</span>`;
    }
    if (text && hasPh) {
      hasPh.remove();
    }
  }

  descBox?.addEventListener("focus", () => {
    const ph = descBox.querySelector(".td-editor__ph");
    if (ph) {
      ph.remove();
      // taruh caret
      const range = document.createRange();
      range.selectNodeContents(descBox);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  descBox?.addEventListener("input", ensurePlaceholder);
  descBox?.addEventListener("blur", ensurePlaceholder);

  edBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      if (!cmd) return;

      if (cmd === "createLink") {
        const url = prompt("Masukkan URL:");
        if (url) document.execCommand("createLink", false, url);
        return;
      }
      document.execCommand(cmd, false, null);
      descBox.focus();
    });
  });

  // ===== Gallery (maks 5 foto) =====
  const galInput = document.getElementById("galInput");
  const btnAddPhoto = document.getElementById("btnAddPhoto");
  const gallery = document.getElementById("gallery");

  let galFiles = []; // array of File

  function renderGallery() {
    // hapus slot preview lama
    gallery.querySelectorAll(".td-galSlot.is-filled").forEach((el) => el.remove());

    // hitung slot kosong (selain upload)
    const emptySlots = Array.from(gallery.querySelectorAll(".td-galSlot--empty"));
    emptySlots.forEach((s) => (s.style.display = "")); // reset

    // render preview sesuai galFiles
    galFiles.forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const slot = document.createElement("div");
      slot.className = "td-galSlot is-filled";
      slot.innerHTML = `
        <img src="${url}" alt="Dokumentasi ${idx + 1}">
        <button class="td-galRemove" type="button" aria-label="Hapus foto" data-idx="${idx}">✕</button>
      `;
      // sisipkan setelah tombol upload
      gallery.insertBefore(slot, gallery.children[idx + 1]);
    });

    // sembunyikan slot kosong kalau sudah penuh
    const remain = 5 - galFiles.length;
    emptySlots.forEach((s, i) => {
      s.style.display = i < remain - 1 ? "" : ""; // tetap tampil, tapi kalau mau rapih bisa diatur
    });

    // kalau penuh, disable upload
    btnAddPhoto.disabled = galFiles.length >= 5;
    btnAddPhoto.style.opacity = btnAddPhoto.disabled ? 0.6 : 1;
    btnAddPhoto.style.cursor = btnAddPhoto.disabled ? "not-allowed" : "pointer";
  }

  btnAddPhoto?.addEventListener("click", () => {
    if (galFiles.length >= 5) return;
    galInput.click();
  });

  galInput?.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (galFiles.length >= 5) break;
      galFiles.push(f);
    }
    galInput.value = "";
    renderGallery();
  });

  gallery?.addEventListener("click", (e) => {
    const btn = e.target.closest(".td-galRemove");
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    if (Number.isFinite(idx)) {
      galFiles.splice(idx, 1);
      renderGallery();
    }
  });

  renderGallery();

  // ===== Save (dummy) =====
  document.getElementById("btnSave")?.addEventListener("click", () => {
    alert("Simpan Destinasi .");
  });
})();