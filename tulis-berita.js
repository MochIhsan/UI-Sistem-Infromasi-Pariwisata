// ===============================
// TULIS BERITA - JS
// ===============================
(function () {
  // Banner upload
  const drop = document.getElementById("bannerDrop");
  const input = document.getElementById("bannerInput");
  const empty = document.getElementById("bannerEmpty");
  const preview = document.getElementById("bannerPreview");
  const img = document.getElementById("bannerImg");
  const removeBtn = document.getElementById("bannerRemove");

  function showPreview(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    img.src = url;
    preview.hidden = false;
    empty.hidden = true;
  }

  function resetBanner() {
    input.value = "";
    img.src = "";
    preview.hidden = true;
    empty.hidden = false;
  }

  input?.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) showPreview(file);
  });

  removeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetBanner();
  });

  // Drag & drop
  ["dragenter", "dragover"].forEach((evt) => {
    drop?.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.add("is-drag");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    drop?.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.remove("is-drag");
    });
  });

  drop?.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    // set to input (optional)
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
    } catch {}
    showPreview(file);
  });

  // Keyboard open file
  drop?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      input?.click();
    }
  });

  // Editor toolbar (simple execCommand)
  const editor = document.getElementById("editor");
  document.querySelectorAll(".wb-tool[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      const arg = btn.getAttribute("data-arg");
      editor?.focus();

      if (cmd === "formatBlock" && arg) {
        document.execCommand(cmd, false, arg);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  });

  // Link
  const linkBtn = document.querySelector(".wb-tool[data-link]");
  linkBtn?.addEventListener("click", () => {
    editor?.focus();
    const url = prompt("Masukkan URL:");
    if (!url) return;
    document.execCommand("createLink", false, url);
  });

  // Tags
  const tagsWrap = document.getElementById("tagsWrap");
  const tagInput = document.getElementById("tagInput");

  const tags = new Set(["Pariwisata", "Bima"]); // default seperti gambar

  function renderTags() {
    tagsWrap.innerHTML = "";
    Array.from(tags).forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "wb-tag";
      chip.innerHTML = `
        <span>${t}</span>
        <button type="button" aria-label="Hapus tag">×</button>
      `;
      chip.querySelector("button").addEventListener("click", () => {
        tags.delete(t);
        renderTags();
      });
      tagsWrap.appendChild(chip);
    });
  }

  function addTag(raw) {
    const val = (raw || "").trim();
    if (!val) return;
    tags.add(val);
    renderTags();
  }

  tagInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput.value);
      tagInput.value = "";
    }
  });

  tagInput?.addEventListener("input", () => {
    // jika user mengetik koma, split
    if (tagInput.value.includes(",")) {
      const parts = tagInput.value.split(",");
      parts.slice(0, -1).forEach(addTag);
      tagInput.value = parts[parts.length - 1];
    }
  });

  renderTags();

  // Buttons (dummy)
  const btnDraft = document.getElementById("btnDraft");
  const btnPublish = document.getElementById("btnPublish");

  btnDraft?.addEventListener("click", () => {
    alert("Draft disimpan (contoh).");
  });

  btnPublish?.addEventListener("click", () => {
    alert("Berita diterbitkan (contoh).");
  });
})();