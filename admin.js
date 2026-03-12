document.addEventListener("DOMContentLoaded", () => {
  // ===== Dropdown admin (logout) =====
  const adminUserBtn = document.getElementById("adminUserBtn");
  const adminDd = document.getElementById("adminDd");
  const logoutBtn = document.getElementById("logoutBtn");

  function closeDd() {
    adminDd?.classList.remove("open");
  }

  adminUserBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    adminDd?.classList.toggle("open");
  });

  document.addEventListener("click", () => closeDd());

  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "home.html";
  });

  // ===== Visitor chart =====
  const rangeSelect = document.getElementById("rangeSelect");
  const barsWrap = document.getElementById("barsWrap");

  const DATA = {
    6: [
      { label: "JAN", value: 38 },
      { label: "FEB", value: 52 },
      { label: "MAR", value: 74 },
      { label: "APR", value: 64 },
      { label: "MAY", value: 88, active: true},
      { label: "JUN", value: 82 },
    ],
    12: [
      { label: "JAN", value: 28 },
      { label: "FEB", value: 36 },
      { label: "MAR", value: 44 },
      { label: "APR", value: 50 },
      { label: "MAY", value: 58 },
      { label: "JUN", value: 62 },
      { label: "JUL", value: 68 },
      { label: "AUG", value: 72 },
      { label: "SEP", value: 64 },
      { label: "OCT", value: 78 },
      { label: "NOV", value: 86 },
      { label: "DEC", value: 90, active: true },
    ],
  };

  function renderBars(months) {
    if (!barsWrap) return;

    const chartData = DATA[String(months)] || DATA["6"];
    barsWrap.innerHTML = "";

    chartData.forEach((m) => {
      const bar = document.createElement("div");
      bar.className = "bar" + (m.active ? " active" : "");

      const span = document.createElement("span");
      span.style.height = `${m.value}%`;

      const em = document.createElement("em");
      em.textContent = m.label;

      bar.appendChild(span);
      bar.appendChild(em);
      barsWrap.appendChild(bar);
    });
  }

  // render awal
  renderBars(rangeSelect?.value || "6");

  // ganti periode
  rangeSelect?.addEventListener("change", (e) => {
    renderBars(e.target.value);
  });
});