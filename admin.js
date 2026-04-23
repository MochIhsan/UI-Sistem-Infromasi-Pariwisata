document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DROPDOWN SIDEBAR
  ========================= */
  document.querySelectorAll(".admin-nav__toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".admin-nav__group");
      group.classList.toggle("open");
    });
  });

  // Auto open jika ada menu aktif
  document.querySelectorAll(".admin-subnav__item.active").forEach(item => {
    item.closest(".admin-nav__group")?.classList.add("open");
  });


  /* =========================
     DROPDOWN ADMIN (LOGOUT)
  ========================= */
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
    window.location.href = "index.html";
  });


  /* =========================
     VISITOR CHART (UPDATE)
  ========================= */
  const yearSelect = document.getElementById("yearSelect");
  const categorySelect = document.getElementById("categorySelect");
  const barsWrap = document.getElementById("barsWrap");
  const chartLegend = document.getElementById("chartLegend");

  const VISITOR_DATA = {
    2024: [
      { month: "JAN", destinasi: 820, event: 300, berita: 180, akomodasi: 260 },
      { month: "FEB", destinasi: 860, event: 340, berita: 200, akomodasi: 280 },
      { month: "MAR", destinasi: 910, event: 380, berita: 230, akomodasi: 300 },
      { month: "APR", destinasi: 970, event: 450, berita: 240, akomodasi: 330 },
      { month: "MAY", destinasi: 1020, event: 520, berita: 260, akomodasi: 360 },
      { month: "JUN", destinasi: 1080, event: 560, berita: 290, akomodasi: 390 },
      { month: "JUL", destinasi: 1130, event: 610, berita: 320, akomodasi: 420 },
      { month: "AUG", destinasi: 1170, event: 650, berita: 340, akomodasi: 450 },
      { month: "SEP", destinasi: 1110, event: 590, berita: 310, akomodasi: 430 },
      { month: "OCT", destinasi: 1190, event: 700, berita: 360, akomodasi: 470 },
      { month: "NOV", destinasi: 1240, event: 760, berita: 390, akomodasi: 500 },
      { month: "DEC", destinasi: 1300, event: 820, berita: 410, akomodasi: 540 }
    ],
    2025: [
      { month: "JAN", destinasi: 1000, event: 2000, berita: 500, akomodasi: 700 },
      { month: "FEB", destinasi: 1100, event: 1800, berita: 520, akomodasi: 760 },
      { month: "MAR", destinasi: 1200, event: 2100, berita: 560, akomodasi: 800 },
      { month: "APR", destinasi: 1300, event: 2200, berita: 600, akomodasi: 860 },
      { month: "MAY", destinasi: 1450, event: 2400, berita: 650, akomodasi: 910 },
      { month: "JUN", destinasi: 1500, event: 2350, berita: 690, akomodasi: 940 },
      { month: "JUL", destinasi: 1600, event: 2600, berita: 720, akomodasi: 990 },
      { month: "AUG", destinasi: 1700, event: 2800, berita: 760, akomodasi: 1040 },
      { month: "SEP", destinasi: 1580, event: 2500, berita: 710, akomodasi: 980 },
      { month: "OCT", destinasi: 1800, event: 3000, berita: 800, akomodasi: 1100 },
      { month: "NOV", destinasi: 1900, event: 3200, berita: 860, akomodasi: 1180 },
      { month: "DEC", destinasi: 2100, event: 3400, berita: 920, akomodasi: 1250 }
    ],
    2026: [
      { month: "JAN", destinasi: 1250, event: 2200, berita: 620, akomodasi: 820 },
      { month: "FEB", destinasi: 1340, event: 2280, berita: 660, akomodasi: 860 },
      { month: "MAR", destinasi: 1400, event: 2350, berita: 700, akomodasi: 900 },
      { month: "APR", destinasi: 1490, event: 2440, berita: 730, akomodasi: 950 },
      { month: "MAY", destinasi: 1560, event: 2520, berita: 770, akomodasi: 990 },
      { month: "JUN", destinasi: 1620, event: 2600, berita: 810, akomodasi: 1040 },
      { month: "JUL", destinasi: 1700, event: 2750, berita: 860, akomodasi: 1100 },
      { month: "AUG", destinasi: 1780, event: 2880, berita: 900, akomodasi: 1160 },
      { month: "SEP", destinasi: 1720, event: 2790, berita: 870, akomodasi: 1120 },
      { month: "OCT", destinasi: 1840, event: 2960, berita: 930, akomodasi: 1190 },
      { month: "NOV", destinasi: 1930, event: 3100, berita: 980, akomodasi: 1260 },
      { month: "DEC", destinasi: 2050, event: 3280, berita: 1030, akomodasi: 1330 }
    ]
  };

  function getTotal(item) {
    return item.destinasi + item.event + item.berita + item.akomodasi;
  }

  function getBarValue(item, category) {
    if (category === "destinasi") return item.destinasi;
    if (category === "event") return item.event;
    if (category === "berita") return item.berita;
    if (category === "akomodasi") return item.akomodasi;
    return getTotal(item);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  function renderLegend(category) {
    if (!chartLegend) return;

    if (category === "all") {
      chartLegend.innerHTML = `
        <span class="chart-legend__item"><span class="chart-legend__dot dot-destinasi"></span>Destinasi</span>
        <span class="chart-legend__item"><span class="chart-legend__dot dot-event"></span>Event</span>
        <span class="chart-legend__item"><span class="chart-legend__dot dot-berita"></span>Berita</span>
        <span class="chart-legend__item"><span class="chart-legend__dot dot-akomodasi"></span>Akomodasi</span>
      `;
      return;
    }

    const labels = {
      destinasi: "Destinasi",
      event: "Event",
      berita: "Berita",
      akomodasi: "Akomodasi"
    };

    chartLegend.innerHTML = `
      <span class="chart-legend__item">
        <span class="chart-legend__dot dot-${category}"></span>${labels[category]}
      </span>
    `;
  }

  function renderBars() {
    if (!barsWrap || !yearSelect || !categorySelect) return;

    const year = yearSelect.value;
    const category = categorySelect.value;
    const chartData = VISITOR_DATA[year] || VISITOR_DATA["2025"];

    const maxValue = Math.max(...chartData.map((item) => getBarValue(item, category)));

    barsWrap.innerHTML = "";

    chartData.forEach((item) => {
      const value = getBarValue(item, category);
      const barHeight = Math.max((value / maxValue) * 100, 8);

      const bar = document.createElement("div");
      bar.className = "bar bar--interactive";

      const tooltip = document.createElement("div");
      tooltip.className = "bar-tooltip";
      tooltip.innerHTML = `
        <div class="bar-tooltip__month">${item.month} ${year}</div>
        <div>Destinasi: ${formatNumber(item.destinasi)}</div>
        <div>Event: ${formatNumber(item.event)}</div>
        <div>Berita: ${formatNumber(item.berita)}</div>
        <div>Akomodasi: ${formatNumber(item.akomodasi)}</div>
        <div class="bar-tooltip__total">Total: ${formatNumber(getTotal(item))}</div>
      `;

      const valueLabel = document.createElement("strong");
      valueLabel.className = "bar-value";
      valueLabel.textContent = formatNumber(value);

      const span = document.createElement("span");
      span.style.height = `${barHeight}%`;

      if (category === "all") {
        span.classList.add("bar-fill--all");
      } else {
        span.classList.add(`bar-fill--${category}`);
      }

      const monthLabel = document.createElement("em");
      monthLabel.textContent = item.month;

      bar.appendChild(tooltip);
      bar.appendChild(valueLabel);
      bar.appendChild(span);
      bar.appendChild(monthLabel);

      barsWrap.appendChild(bar);
    });

    renderLegend(category);
  }

  yearSelect?.addEventListener("change", renderBars);
  categorySelect?.addEventListener("change", renderBars);

  renderBars();
// TOOLTIP DONUT FOLLOW CURSOR
const donut = document.getElementById("popularDonut");
const tooltip = document.getElementById("donutTooltip");

if (donut && tooltip) {

  donut.addEventListener("mousemove", (e) => {
    tooltip.style.opacity = "1";
    tooltip.style.visibility = "visible";

    // posisi mengikuti cursor + offset biar ga nutup
    tooltip.style.left = (e.clientX + 15) + "px";
    tooltip.style.top  = (e.clientY + 15) + "px";
  });

  donut.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
    tooltip.style.visibility = "hidden";
  });

}
const userSearch = document.getElementById("userSearch");
const userStatusFilter = document.getElementById("userStatusFilter");
const userRows = document.querySelectorAll(".adminm-row");

function filterUserRows() {
  const keyword = (userSearch?.value || "").toLowerCase();
  const status = userStatusFilter?.value || "all";

  userRows.forEach(row => {
    const username = row.querySelector(".adminm-username")?.textContent.toLowerCase() || "";
    const email = row.querySelector(".adminm-email")?.textContent.toLowerCase() || "";
    const rowStatus = row.dataset.status || "active";

    const matchKeyword = username.includes(keyword) || email.includes(keyword);
    const matchStatus = status === "all" || rowStatus === status;

    row.style.display = (matchKeyword && matchStatus) ? "grid" : "none";
  });
}

userSearch?.addEventListener("input", filterUserRows);
userStatusFilter?.addEventListener("change", filterUserRows);

/* =========================
   FILTER KELOLA ULASAN
========================= */
const reviewSearch = document.getElementById("reviewSearch");
const reviewRatingFilter = document.getElementById("reviewRatingFilter");
const reviewCategoryFilter = document.getElementById("reviewCategoryFilter");
const reviewRows = document.querySelectorAll(".ulasan-row");

function filterReviewRows() {
  const keyword = (reviewSearch?.value || "").toLowerCase();
  const rating = reviewRatingFilter?.value || "all";
  const category = reviewCategoryFilter?.value || "all";

  reviewRows.forEach(row => {
    const user = (row.dataset.user || "").toLowerCase();
    const target = (row.dataset.target || "").toLowerCase();
    const rowRating = row.dataset.rating || "";
    const rowCategory = row.dataset.category || "";

    const matchKeyword = user.includes(keyword) || target.includes(keyword);
    const matchRating = rating === "all" || rowRating === rating;
    const matchCategory = category === "all" || rowCategory === category;

    row.style.display = (matchKeyword && matchRating && matchCategory) ? "grid" : "none";
  });
}

reviewSearch?.addEventListener("input", filterReviewRows);
reviewRatingFilter?.addEventListener("change", filterReviewRows);
reviewCategoryFilter?.addEventListener("change", filterReviewRows);
/* =========================
   HAPUS ULASAN
========================= */
document.querySelectorAll(".ulasan-delete").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".ulasan-row");
    if (!row) return;

    const ok = confirm("Yakin ingin menghapus ulasan ini?");
    if (!ok) return;

    row.remove();
    updateReviewFootnote();
  });
});

function updateReviewFootnote() {
  const visibleRows = [...document.querySelectorAll(".ulasan-row")]
    .filter(row => row.style.display !== "none");

  const footnote = document.querySelector(".ulasan-footnote");
  if (footnote) {
    footnote.textContent = `Menampilkan 1-${visibleRows.length} dari ${visibleRows.length} ulasan`;
  }
}
/* =========================
   HAPUS USER
========================= */
document.querySelectorAll(".adminm-act--danger").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".adminm-row");
    if (!row) return;

    const username = row.querySelector(".adminm-username")?.textContent || "user";
    const ok = confirm(`Yakin ingin menghapus akun "${username}"?`);
    if (!ok) return;

    row.remove();
    updateUserFootnote();
  });
});

function updateUserFootnote() {
  const visibleRows = [...document.querySelectorAll(".adminm-row")]
    .filter(row => row.style.display !== "none");

  const footnote = document.querySelector(".adminm-footnote");
  if (footnote) {
    footnote.textContent = `Showing 1-${visibleRows.length} of ${visibleRows.length} results`;
  }
}
/* =========================
   DESTINASI: SEARCH + FILTER + DELETE
========================= */
const destSearch = document.getElementById("destSearch");
const destCategoryFilter = document.getElementById("destCategoryFilter");
const destRows = document.querySelectorAll(".adm-row");

function filterDestRows() {
  const keyword = (destSearch?.value || "").toLowerCase().trim();
  const category = (destCategoryFilter?.value || "Semua Kategori").toLowerCase().trim();

  destRows.forEach((row) => {
    const name = row.querySelector(".adm-name")?.textContent.toLowerCase() || "";
    const location = row.querySelector(".adm-loc")?.textContent.toLowerCase() || "";
    const rowCategory = (row.dataset.category || row.querySelector(".adm-badge")?.textContent || "").toLowerCase().trim();

    const matchKeyword = name.includes(keyword) || location.includes(keyword);
    const matchCategory = category === "semua kategori" || rowCategory === category;

    row.style.display = (matchKeyword && matchCategory) ? "grid" : "none";
  });

  updateDestFootnote();
}

document.querySelectorAll(".adm-row .evt-act--del, .adm-row .adm-act--del").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".adm-row");
    if (!row) return;

    const name = row.querySelector(".adm-name")?.textContent.trim() || "destinasi";
    if (!confirm(`Yakin ingin menghapus destinasi "${name}"?`)) return;

    row.remove();
    updateDestFootnote();
  });
});

function updateDestFootnote() {
  const visible = [...document.querySelectorAll(".adm-row")].filter((row) => row.style.display !== "none").length;
  const footnote = document.querySelector(".adm-footnote");
  if (footnote) footnote.textContent = `Menampilkan 1-${visible} dari ${visible} destinasi`;
}

destSearch?.addEventListener("input", filterDestRows);
destCategoryFilter?.addEventListener("change", filterDestRows);


/* =========================
   EVENT: SEARCH + FILTER + DELETE
========================= */
const eventSearch = document.getElementById("eventSearch");
const eventStatusFilter = document.getElementById("eventStatusFilter");
const eventRows = document.querySelectorAll(".evt-row");

function filterEventRows() {
  const keyword = (eventSearch?.value || "").toLowerCase().trim();
  const status = (eventStatusFilter?.value || "Semua Kategori").toLowerCase().trim();

  eventRows.forEach((row) => {
    const name = row.querySelector(".evt-name__title")?.textContent.toLowerCase() || "";
    const location = row.querySelector(".evt-loc")?.textContent.toLowerCase() || "";
    const rowStatus = (row.dataset.status || row.querySelector(".evt-badge")?.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();

    const filterStatus = status === "semua kategori" ? "all" : status;
    const matchKeyword = name.includes(keyword) || location.includes(keyword);
    const matchStatus = filterStatus === "all" || rowStatus.includes(filterStatus);

    row.style.display = (matchKeyword && matchStatus) ? "grid" : "none";
  });

  updateEventFootnote();
}

document.querySelectorAll(".evt-row .evt-act--del").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".evt-row");
    if (!row) return;

    const name = row.querySelector(".evt-name__title")?.textContent.trim() || "event";
    if (!confirm(`Yakin ingin menghapus event "${name}"?`)) return;

    row.remove();
    updateEventFootnote();
  });
});

function updateEventFootnote() {
  const visible = [...document.querySelectorAll(".evt-row")].filter((row) => row.style.display !== "none").length;
  const footnote = document.querySelector(".evt-footnote, .evt-foot__text");
  if (footnote) footnote.textContent = `Menampilkan 1-${visible} dari ${visible} event`;
}

eventSearch?.addEventListener("input", filterEventRows);
eventStatusFilter?.addEventListener("change", filterEventRows);


/* =========================
   BERITA: SEARCH + FILTER + DELETE
========================= */
const newsSearch = document.getElementById("newsSearch");
const newsCategoryFilter = document.getElementById("newsCategoryFilter");
const newsRows = document.querySelectorAll(".newsadm-row");

function filterNewsRows() {
  const keyword = (newsSearch?.value || "").toLowerCase().trim();
  const category = (newsCategoryFilter?.value || "Semua Kategori").toLowerCase().trim();

  newsRows.forEach((row) => {
    const title = row.querySelector(".newsadm-title__txt")?.textContent.toLowerCase() || "";
    const author = row.querySelector(".newsadm-author")?.textContent.toLowerCase() || "";
    const rowCategory = (row.dataset.category || row.querySelector(".newsadm-badge")?.textContent || "").toLowerCase().trim();

    const matchKeyword = title.includes(keyword) || author.includes(keyword);
    const matchCategory = category === "semua kategori" || rowCategory === category;

    row.style.display = (matchKeyword && matchCategory) ? "grid" : "none";
  });

  updateNewsFootnote();
}

document.querySelectorAll(".newsadm-row .newsadm-act--del").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".newsadm-row");
    if (!row) return;

    const title = row.querySelector(".newsadm-title__txt")?.textContent.trim() || "berita";
    if (!confirm(`Yakin ingin menghapus berita "${title}"?`)) return;

    row.remove();
    updateNewsFootnote();
  });
});

function updateNewsFootnote() {
  const visible = [...document.querySelectorAll(".newsadm-row")].filter((row) => row.style.display !== "none").length;
  const footnote = document.querySelector(".newsadm-footnote");
  if (footnote) footnote.textContent = `Menampilkan 1-${visible} dari ${visible} berita`;
}

newsSearch?.addEventListener("input", filterNewsRows);
newsCategoryFilter?.addEventListener("change", filterNewsRows);


/* =========================
   AKOMODASI: SEARCH + FILTER + DELETE
========================= */
const staySearch = document.getElementById("staySearch");
const stayTypeFilter = document.getElementById("stayTypeFilter");
const stayRows = document.querySelectorAll(".acmdm-row");

function filterStayRows() {
  const keyword = (staySearch?.value || "").toLowerCase().trim();
  const type = (stayTypeFilter?.value || "Semua Tipe").toLowerCase().trim();

  stayRows.forEach((row) => {
    const name = row.querySelector(".acmdm-name")?.textContent.toLowerCase() || "";
    const location = row.querySelector(".acmdm-muted")?.textContent.toLowerCase() || "";
    const rowType = (row.dataset.type || row.querySelector(".acmdm-badge")?.textContent || "").toLowerCase().trim();

    const matchKeyword = name.includes(keyword) || location.includes(keyword);
    const matchType = type === "semua tipe" || rowType === type;

    row.style.display = (matchKeyword && matchType) ? "grid" : "none";
  });

  updateStayFootnote();
}

document.querySelectorAll(".acmdm-row .newsadm-act--del, .acmdm-row .acmdm-act--del").forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".acmdm-row");
    if (!row) return;

    const name = row.querySelector(".acmdm-name")?.textContent.trim() || "akomodasi";
    if (!confirm(`Yakin ingin menghapus akomodasi "${name}"?`)) return;

    row.remove();
    updateStayFootnote();
  });
});

function updateStayFootnote() {
  const visible = [...document.querySelectorAll(".acmdm-row")].filter((row) => row.style.display !== "none").length;
  const footnote = document.querySelector(".acmdm-footnote, .newsadm-footnote");
  if (footnote) footnote.textContent = `Menampilkan 1-${visible} dari ${visible} penginapan`;
}

staySearch?.addEventListener("input", filterStayRows);
stayTypeFilter?.addEventListener("change", filterStayRows);
});
