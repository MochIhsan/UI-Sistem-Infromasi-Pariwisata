// ====== BACK/BATAL sudah pakai <a href="admin-event.html"> di HTML ======

/* ========= Banner uploader (samakan dengan destinasi) ========= */
const bannerDrop = document.getElementById("bannerDrop");
const bannerInput = document.getElementById("bannerInput");
const btnPickBanner = document.getElementById("btnPickBanner");
const bannerPreview = document.getElementById("bannerPreview");
const bannerErr = document.getElementById("bannerErr");

function setBannerError(msg) {
  if (bannerErr) bannerErr.textContent = msg || "";
}

function previewBanner(file) {
  setBannerError("");

  if (!file) return;

  // Validasi ringan
  const isImg = file.type && file.type.startsWith("image/");
  if (!isImg) {
    setBannerError("File banner harus berupa gambar.");
    return;
  }

  // preview seperti destinasi: div preview background-image
  const url = URL.createObjectURL(file);
  bannerPreview.style.backgroundImage = `url('${url}')`;
  bannerPreview.classList.add("is-show"); // kalau style.css kamu pakai class ini, bagus
}

btnPickBanner?.addEventListener("click", () => bannerInput.click());

bannerDrop?.addEventListener("click", (e) => {
  // klik area uploader -> open file
  if (e.target !== btnPickBanner) bannerInput.click();
});

bannerInput?.addEventListener("change", () => {
  const file = bannerInput.files?.[0];
  previewBanner(file);
});

// Drag & drop
["dragenter", "dragover"].forEach((evt) => {
  bannerDrop?.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    bannerDrop.classList.add("is-drag"); // kalau style.css destinasi pakai state ini
  });
});
["dragleave", "drop"].forEach((evt) => {
  bannerDrop?.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    bannerDrop.classList.remove("is-drag");
  });
});
bannerDrop?.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) previewBanner(file);
});

/* ========= Lokasi: update iframe map saat lat/lng berubah ========= */
const latInput = document.getElementById("latInput");
const lngInput = document.getElementById("lngInput");
const mapFrame = document.getElementById("mapFrame");

function updateMap() {
  if (!mapFrame) return;

  const lat = (latInput?.value || "").trim();
  const lng = (lngInput?.value || "").trim();

  // kalau kosong, jangan ganti
  if (!lat || !lng) return;

  // google maps embed query lat,lng
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=13&output=embed`;
}

latInput?.addEventListener("input", () => {
  // debounce ringan
  clearTimeout(updateMap._t);
  updateMap._t = setTimeout(updateMap, 300);
});
lngInput?.addEventListener("input", () => {
  clearTimeout(updateMap._t);
  updateMap._t = setTimeout(updateMap, 300);
});

/* ========= Editor (samakan) ========= */
document.querySelectorAll(".td-edBtn[data-cmd]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.getAttribute("data-cmd");
    if (!cmd) return;

    if (cmd === "createLink") {
      const url = prompt("Masukkan URL:");
      if (!url) return;
      document.execCommand("createLink", false, url);
      return;
    }

    document.execCommand(cmd, false, null);
  });
});

// placeholder handling (biar placeholder hilang saat fokus)
const descBox = document.getElementById("descBox");
descBox?.addEventListener("focus", () => {
  const ph = descBox.querySelector(".td-editor__ph");
  if (ph) ph.remove();
});

/* ========= Gallery (samakan dengan destinasi) ========= */
const galInput = document.getElementById("galInput");
const btnAddPhoto = document.getElementById("btnAddPhoto");
const gallery = document.getElementById("gallery");
const errGal = document.getElementById("errGal");

let galleryFiles = []; // array of { id, url }

function setGalError(msg) {
  if (errGal) errGal.textContent = msg || "";
}

btnAddPhoto?.addEventListener("click", () => galInput.click());

galInput?.addEventListener("change", () => {
  setGalError("");
  const files = Array.from(galInput.files || []);
  if (!files.length) return;

  const remaining = 5 - galleryFiles.length;
  if (remaining <= 0) {
    setGalError("Maksimal 5 foto.");
    galInput.value = "";
    return;
  }

  const toAdd = files.slice(0, remaining);

  toAdd.forEach((f) => {
    if (!f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    galleryFiles.push({ id: `${Date.now()}_${Math.random()}`, url });
  });

  galInput.value = "";
  renderGallery();
});

function renderGallery() {
  if (!gallery) return;

  // Bersihkan slot preview lama (yang kita buat)
  gallery.querySelectorAll(".td-galSlot.td-galSlot--img").forEach((n) => n.remove());

  // Cari slot empty yang sudah ada
  const emptySlots = Array.from(gallery.querySelectorAll(".td-galSlot--empty"));

  // Reset empty slot tampil
  emptySlots.forEach((s) => (s.style.display = ""));

  // Buat slot image untuk setiap foto
  galleryFiles.forEach((item, idx) => {
    const slot = document.createElement("div");
    slot.className = "td-galSlot td-galSlot--img";

    slot.style.backgroundImage = `url('${item.url}')`;
    slot.style.backgroundSize = "cover";
    slot.style.backgroundPosition = "center";

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "td-galRm";
    rm.textContent = "✕";
    rm.title = "Hapus foto";
    rm.addEventListener("click", () => {
      galleryFiles = galleryFiles.filter((x) => x.id !== item.id);
      renderGallery();
    });

    slot.appendChild(rm);

    // sisipkan setelah tombol upload (biar urut)
    gallery.insertBefore(slot, emptySlots[0] || null);

    // sembunyikan slot empty sesuai jumlah foto
    if (emptySlots[idx]) emptySlots[idx].style.display = "none";
  });
}

/* ========= Simpan Event (dummy) ========= */
const btnSaveEvent = document.getElementById("btnSaveEvent");
const judulEvent = document.getElementById("judulEvent");
const tanggalEvent = document.getElementById("tanggalEvent");
const hargaTiket = document.getElementById("hargaTiket");
const alamatEvent = document.getElementById("alamatEvent");

const errJudul = document.getElementById("errJudul");
const errTanggal = document.getElementById("errTanggal");
const errHarga = document.getElementById("errHarga");
const errAlamat = document.getElementById("errAlamat");
const errDesc = document.getElementById("errDesc");

function setText(el, msg) {
  if (el) el.textContent = msg || "";
}

btnSaveEvent?.addEventListener("click", () => {
  // reset error
  setText(errJudul, "");
  setText(errTanggal, "");
  setText(errHarga, "");
  setText(errAlamat, "");
  setText(errDesc, "");
  setBannerError("");
  setGalError("");

  const bannerSelected = !!bannerInput?.files?.[0] || (bannerPreview?.style.backgroundImage || "").length > 0;

  const title = (judulEvent?.value || "").trim();
  const date = (tanggalEvent?.value || "").trim();
  const price = (hargaTiket?.value || "").trim();
  const address = (alamatEvent?.value || "").trim();
  const lat = (latInput?.value || "").trim();
  const lng = (lngInput?.value || "").trim();

  const descHtml = (descBox?.innerHTML || "").trim();
  const descText = descBox ? descBox.innerText.trim() : "";

  let ok = true;

  if (!bannerSelected) { setBannerError("Banner utama wajib diupload."); ok = false; }
  if (!title) { setText(errJudul, "Judul event wajib diisi."); ok = false; }
  if (!date) { setText(errTanggal, "Tanggal event wajib diisi."); ok = false; }
  if (!price) { setText(errHarga, "Harga tiket wajib diisi."); ok = false; }
  if (!address) { setText(errAlamat, "Alamat lokasi wajib diisi."); ok = false; }
  if (!descText || descText.length < 10) { setText(errDesc, "Deskripsi minimal 10 karakter."); ok = false; }

  if (!ok) return;

  // Simpan dummy ke localStorage
  const key = "events";
  const old = JSON.parse(localStorage.getItem(key) || "[]");

  old.push({
    id: Date.now(),
    title,
    date,
    price,
    address,
    lat,
    lng,
    descHtml,
    galleryCount: galleryFiles.length,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(key, JSON.stringify(old));

  // kembali ke admin-event
  window.location.href = "admin-event.html";
});