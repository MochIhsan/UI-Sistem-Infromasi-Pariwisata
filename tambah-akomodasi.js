// ===============================
// TAMBAH AKOMODASI - JS
// ===============================

// ========= GALERI: foto utama =========
const mainDrop = document.getElementById("mainDrop");
const mainPhoto = document.getElementById("mainPhoto");
const btnPickMain = document.getElementById("btnPickMain");
const mainPreview = document.getElementById("mainPreview");
const mainDropInner = document.getElementById("mainDropInner");
const errGallery = document.getElementById("errGallery");

function setGalErr(msg) {
  if (errGallery) errGallery.textContent = msg || "";
}

function setMain(file) {
  setGalErr("");
  if (!file) return;

  if (!file.type || !file.type.startsWith("image/")) {
    setGalErr("File harus gambar.");
    return;
  }

  const url = URL.createObjectURL(file);
  mainPreview.style.backgroundImage = `url('${url}')`;
  mainPreview.classList.add("is-show");
  mainDropInner.classList.add("is-hide");
}

btnPickMain?.addEventListener("click", () => mainPhoto.click());
mainDrop?.addEventListener("click", (e) => {
  if (e.target === mainDrop) mainPhoto.click();
});
mainPhoto?.addEventListener("change", () => setMain(mainPhoto.files?.[0]));

["dragenter", "dragover"].forEach((evt) => {
  mainDrop?.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainDrop.classList.add("is-drag");
  });
});
["dragleave", "drop"].forEach((evt) => {
  mainDrop?.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainDrop.classList.remove("is-drag");
  });
});
mainDrop?.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) setMain(file);
});

// ========= THUMBS (4 slot) =========
const thumbInput = document.getElementById("thumbInput");
let currentSlotBtn = null;

document.querySelectorAll(".ak-thumb").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentSlotBtn = btn;
    thumbInput.click();
  });
});

thumbInput?.addEventListener("change", () => {
  const file = thumbInput.files?.[0];
  if (!file) return;

  if (!file.type || !file.type.startsWith("image/")) {
    setGalErr("File harus gambar.");
    thumbInput.value = "";
    return;
  }

  const url = URL.createObjectURL(file);
  currentSlotBtn.style.backgroundImage = `url('${url}')`;
  currentSlotBtn.classList.add("ak-thumb--img");
  currentSlotBtn.textContent = "";
  thumbInput.value = "";
});

// ========= FASILITAS (toggle aktif) =========
document.querySelectorAll(".ak-fac__item").forEach((btn) => {
  btn.addEventListener("click", () => btn.classList.toggle("is-active"));
});

// ========= SIMPAN (dummy) =========
const btnSave = document.getElementById("btnSave");

btnSave?.addEventListener("click", () => {
  // reset error
  document.getElementById("errNama").textContent = "";
  document.getElementById("errHarga").textContent = "";
  setGalErr("");

  const nama = document.getElementById("nama").value.trim();
  const harga = document.getElementById("harga").value.trim();

  let ok = true;
  if (!nama) {
    document.getElementById("errNama").textContent = "Nama penginapan wajib diisi.";
    ok = false;
  }
  if (!harga) {
    document.getElementById("errHarga").textContent = "Harga wajib diisi.";
    ok = false;
  }

  // validasi foto utama (opsional, tapi biasanya wajib)
  const mainHasImage =
    (mainPreview?.style?.backgroundImage || "").length > 0;

  if (!mainHasImage) {
    setGalErr("Foto utama wajib diupload.");
    ok = false;
  }

  if (!ok) return;

  const fasilitas = Array.from(document.querySelectorAll(".ak-fac__item.is-active"))
    .map((x) => x.getAttribute("data-val"));

  const data = {
    id: Date.now(),
    nama,
    tipe: document.getElementById("tipe").value,
    bintang: document.getElementById("bintang").value,
    alamat: document.getElementById("alamat").value,
    harga: Number(harga),
    bestPrice: document.getElementById("toggleBest").checked,
    fasilitas,
    sekitar: document.getElementById("sekitar").value,
    checkin: document.getElementById("checkin").value,
    checkout: document.getElementById("checkout").value,
    rules: document.getElementById("rules").value,
    createdAt: new Date().toISOString(),
  };

  // simpan dummy
  const key = "akomodasi";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push(data);
  localStorage.setItem(key, JSON.stringify(list));

  // kembali ke list
  window.location.href = "admin-akomodasi.html";
});
// ========= LOKASI (samakan dengan tambah-event) =========
const akomLat = document.getElementById("akomLat");
const akomLng = document.getElementById("akomLng");
const akomMapFrame = document.getElementById("akomMapFrame");

function updateAkomMap() {
  if (!akomMapFrame) return;

  const lat = (akomLat?.value || "").trim();
  const lng = (akomLng?.value || "").trim();
  if (!lat || !lng) return;

  akomMapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=13&output=embed`;
}

// debounce ringan
function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const updateAkomMapDebounced = debounce(updateAkomMap, 300);
akomLat?.addEventListener("input", updateAkomMapDebounced);
akomLng?.addEventListener("input", updateAkomMapDebounced);

// initial
updateAkomMap();