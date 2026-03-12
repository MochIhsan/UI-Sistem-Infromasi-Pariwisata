// ===============================
// TAMBAH ADMIN - JS
// ===============================

const namaLengkap = document.getElementById("namaLengkap");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const isActive = document.getElementById("isActive");
const activeLabel = document.getElementById("activeLabel");
const btnSave = document.getElementById("btnSaveAdmin");

// error nodes
const errNama = document.getElementById("errNama");
const errUsername = document.getElementById("errUsername");
const errEmail = document.getElementById("errEmail");
const errPass = document.getElementById("errPass");
const errConfirm = document.getElementById("errConfirm");

function setErr(el, msg) {
  if (el) el.textContent = msg || "";
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function updateActiveLabel() {
  if (!activeLabel) return;
  activeLabel.textContent = isActive?.checked ? "Aktif" : "Nonaktif";
}
isActive?.addEventListener("change", updateActiveLabel);
updateActiveLabel();

document.querySelectorAll(".ta-eye").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-toggle");
    const input = document.getElementById(id);
    if (!input) return;

    const show = input.type === "password";
    input.type = show ? "text" : "password";

    // ganti icon (eye / eye-off sederhana)
    btn.innerHTML = show
      ? `<svg viewBox="0 0 24 24" class="ta-ico"><path d="M3 3l18 18-1.4 1.4-2.3-2.3A10.6 10.6 0 0 1 12 19C5 19 2 12 2 12a19 19 0 0 1 4.2-5.6L1.6 4.4 3 3Zm6.2 6.2A4 4 0 0 0 12 16a3.9 3.9 0 0 0 2.8-1.2l-1.5-1.5A2 2 0 0 1 10 12c0-.4.1-.7.2-1L9.2 9.2Zm3.8-4.2c7 0 10 7 10 7a18.6 18.6 0 0 1-4 5.2l-2.1-2.1A4 4 0 0 0 12 8a3.9 3.9 0 0 0-1.1.2L8.9 6.2A10.3 10.3 0 0 1 13 5Z"></path></svg>`
      : `<svg viewBox="0 0 24 24" class="ta-ico"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z"></path></svg>`;
  });
});

btnSave?.addEventListener("click", () => {
  // reset errors
  [errNama, errUsername, errEmail, errPass, errConfirm].forEach((n) => setErr(n, ""));

  const data = {
    id: Date.now(),
    nama: namaLengkap.value.trim(),
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value, // dummy: jangan simpan plain password di production
    active: isActive.checked,
    createdAt: new Date().toISOString(),
  };

  let ok = true;

  if (!data.nama) { setErr(errNama, "Nama lengkap wajib diisi."); ok = false; }
  if (!data.username) { setErr(errUsername, "Username wajib diisi."); ok = false; }
  if (!data.email) { setErr(errEmail, "Email wajib diisi."); ok = false; }
  else if (!isValidEmail(data.email)) { setErr(errEmail, "Format email tidak valid."); ok = false; }

  if (!data.password || data.password.length < 6) {
    setErr(errPass, "Password minimal 6 karakter.");
    ok = false;
  }
  if (confirmPassword.value !== data.password) {
    setErr(errConfirm, "Konfirmasi password tidak sama.");
    ok = false;
  }

  if (!ok) return;

  // simpan dummy ke localStorage
  const key = "admins";
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  // cek unik username
  if (list.some((a) => String(a.username).toLowerCase() === data.username.toLowerCase())) {
    setErr(errUsername, "Username sudah digunakan.");
    return;
  }

  list.push({
    id: data.id,
    nama: data.nama,
    username: data.username,
    email: data.email,
    active: data.active,
    createdAt: data.createdAt,
  });

  localStorage.setItem(key, JSON.stringify(list));

  // redirect ke kelola admin
  window.location.href = "kelola-admin.html";
});