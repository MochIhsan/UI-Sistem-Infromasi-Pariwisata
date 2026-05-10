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
  if (errGallery) {
    errGallery.textContent = msg || "";
  }
}

function setMain(file) {
  setGalErr("");

  if (!file) return;

  if (!file.type || !file.type.startsWith("image/")) {
    setGalErr("File harus gambar.");
    return;
  }

  const url = URL.createObjectURL(file);

  if (mainPreview) {
    mainPreview.style.backgroundImage = `url('${url}')`;
    mainPreview.classList.add("is-show");
  }

  if (mainDropInner) {
    mainDropInner.classList.add("is-hide");
  }
}

if (btnPickMain && mainPhoto) {
  btnPickMain.addEventListener("click", function () {
    mainPhoto.click();
  });
}

if (mainDrop && mainPhoto) {
  mainDrop.addEventListener("click", function (e) {
    if (e.target === mainDrop) {
      mainPhoto.click();
    }
  });
}

if (mainPhoto) {
  mainPhoto.addEventListener("change", function () {
    setMain(mainPhoto.files?.[0]);
  });
}

["dragenter", "dragover"].forEach(function (evt) {
  if (mainDrop) {
    mainDrop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      mainDrop.classList.add("is-drag");
    });
  }
});

["dragleave", "drop"].forEach(function (evt) {
  if (mainDrop) {
    mainDrop.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      mainDrop.classList.remove("is-drag");
    });
  }
});

if (mainDrop) {
  mainDrop.addEventListener("drop", function (e) {
    const file = e.dataTransfer?.files?.[0];

    if (file) {
      setMain(file);
    }
  });
}


// ========= THUMBNAIL FOTO TAMBAHAN =========
const thumbInput = document.getElementById("thumbInput");
let currentSlotBtn = null;

document.querySelectorAll(".ak-thumb").forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentSlotBtn = btn;

    if (thumbInput) {
      thumbInput.click();
    }
  });
});

if (thumbInput) {
  thumbInput.addEventListener("change", function () {
    const file = thumbInput.files?.[0];

    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      setGalErr("File harus gambar.");
      thumbInput.value = "";
      return;
    }

    if (currentSlotBtn) {
      const url = URL.createObjectURL(file);
      currentSlotBtn.style.backgroundImage = `url('${url}')`;
      currentSlotBtn.classList.add("ak-thumb--img");
      currentSlotBtn.textContent = "";
    }

    thumbInput.value = "";
  });
}


// ========= FASILITAS =========
document.querySelectorAll(".ak-fac__item").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.classList.toggle("is-active");
  });
});


// ========= SIMPAN DATA AKOMODASI =========
const btnSave = document.getElementById("btnSave");

if (btnSave) {
  btnSave.addEventListener("click", function () {
    const errNama = document.getElementById("errNama");
    const errTipe = document.getElementById("errTipe");
    const errBintang = document.getElementById("errBintang");
    const errAlamat = document.getElementById("errAlamat");
    const errHarga = document.getElementById("errHarga");

    // reset pesan error
    if (errNama) errNama.textContent = "";
    if (errTipe) errTipe.textContent = "";
    if (errBintang) errBintang.textContent = "";
    if (errAlamat) errAlamat.textContent = "";
    if (errHarga) errHarga.textContent = "";
    setGalErr("");

    const nama = document.getElementById("nama")?.value.trim() || "";
    const tipe = document.getElementById("tipe")?.value.trim() || "";
    const bintang = document.getElementById("bintang")?.value.trim() || "";
    const alamat = document.getElementById("alamat")?.value.trim() || "";
    const harga = document.getElementById("harga")?.value.trim() || "";

    let ok = true;

    if (!nama) {
      if (errNama) errNama.textContent = "Nama penginapan wajib diisi.";
      ok = false;
    }

    if (!tipe) {
      if (errTipe) errTipe.textContent = "Tipe penginapan wajib dipilih.";
      ok = false;
    }

    if (!bintang) {
      if (errBintang) errBintang.textContent = "Bintang penginapan wajib dipilih.";
      ok = false;
    }

    if (!alamat) {
      if (errAlamat) errAlamat.textContent = "Alamat penginapan wajib diisi.";
      ok = false;
    }

    if (!harga) {
      if (errHarga) errHarga.textContent = "Harga wajib diisi.";
      ok = false;
    }

    const mainHasImage =
      mainPreview && (mainPreview.style.backgroundImage || "").length > 0;

    if (!mainHasImage) {
      setGalErr("Foto utama wajib diupload.");
      ok = false;
    }

    // Kalau data kosong / belum lengkap:
    // tidak muncul alert dan tetap berada di halaman tambah-penginapan.html
    if (!ok) {
      return;
    }

    const fasilitas = Array.from(
      document.querySelectorAll(".ak-fac__item.is-active")
    ).map(function (item) {
      return item.getAttribute("data-val");
    });

    const data = {
      id: Date.now(),
      nama: nama,
      tipe: tipe,
      bintang: bintang,
      alamat: alamat,
      harga: Number(harga),
      bestPrice: document.getElementById("toggleBest")?.checked || false,
      fasilitas: fasilitas,

      // Dibuat aman, karena di tambah-penginapan.html belum ada input id="sekitar"
      sekitar: document.getElementById("sekitar")?.value || "",

      checkin: document.getElementById("checkin")?.value || "",
      checkout: document.getElementById("checkout")?.value || "",
      rules: document.getElementById("rules")?.value || "",
      lat: document.getElementById("akomLat")?.value || "",
      lng: document.getElementById("akomLng")?.value || "",
      createdAt: new Date().toISOString()
    };

    // simpan ke localStorage
    const key = "akomodasi";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push(data);
    localStorage.setItem(key, JSON.stringify(list));

    // Kalau data berhasil disimpan, kembali ke halaman admin akomodasi
    window.location.href = "admin-akomodasi.html";
  });
}


// ========= LOKASI / MAP =========
const akomLat = document.getElementById("akomLat");
const akomLng = document.getElementById("akomLng");
const akomMapFrame = document.getElementById("akomMapFrame");

function updateAkomMap() {
  if (!akomMapFrame) return;

  const lat = (akomLat?.value || "").trim();
  const lng = (akomLng?.value || "").trim();

  if (!lat || !lng) return;

  akomMapFrame.src =
    `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=13&output=embed`;
}

function debounce(fn, ms = 300) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(function () {
      fn(...args);
    }, ms);
  };
}

const updateAkomMapDebounced = debounce(updateAkomMap, 300);

if (akomLat) {
  akomLat.addEventListener("input", updateAkomMapDebounced);
}

if (akomLng) {
  akomLng.addEventListener("input", updateAkomMapDebounced);
}

// jalankan map pertama kali
updateAkomMap();