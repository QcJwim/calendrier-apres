/* ============================================================================
   Calendrier de l'après — 26 décembre → 31 janvier
   ----------------------------------------------------------------------------
   Pour personnaliser : remplacez chaque URL ci-dessous par le lien du jour.
   L'ordre est : 26, 27, 28, 29, 30, 31 décembre puis 1 → 31 janvier (37 liens).
   Vous pouvez aussi renseigner NAMES pour afficher un nom personnalisé
   au lieu du nom de domaine (laisser vide pour utiliser le domaine).
   ========================================================================== */

const LINKS = [
  "https://exemple.fr/jour-01",  // 26 décembre
  "https://exemple.fr/jour-02",  // 27 décembre
  "https://exemple.fr/jour-03",  // 28 décembre
  "https://exemple.fr/jour-04",  // 29 décembre
  "https://exemple.fr/jour-05",  // 30 décembre
  "https://exemple.fr/jour-06",  // 31 décembre
  "https://exemple.fr/jour-07",  // 1 janvier
  "https://exemple.fr/jour-08",  // 2 janvier
  "https://exemple.fr/jour-09",  // 3 janvier
  "https://exemple.fr/jour-10",  // 4 janvier
  "https://exemple.fr/jour-11",  // 5 janvier
  "https://exemple.fr/jour-12",  // 6 janvier
  "https://exemple.fr/jour-13",  // 7 janvier
  "https://exemple.fr/jour-14",  // 8 janvier
  "https://exemple.fr/jour-15",  // 9 janvier
  "https://exemple.fr/jour-16",  // 10 janvier
  "https://exemple.fr/jour-17",  // 11 janvier
  "https://exemple.fr/jour-18",  // 12 janvier
  "https://exemple.fr/jour-19",  // 13 janvier
  "https://exemple.fr/jour-20",  // 14 janvier
  "https://exemple.fr/jour-21",  // 15 janvier
  "https://exemple.fr/jour-22",  // 16 janvier
  "https://exemple.fr/jour-23",  // 17 janvier
  "https://exemple.fr/jour-24",  // 18 janvier
  "https://exemple.fr/jour-25",  // 19 janvier
  "https://exemple.fr/jour-26",  // 20 janvier
  "https://exemple.fr/jour-27",  // 21 janvier
  "https://exemple.fr/jour-28",  // 22 janvier
  "https://exemple.fr/jour-29",  // 23 janvier
  "https://exemple.fr/jour-30",  // 24 janvier
  "https://exemple.fr/jour-31",  // 25 janvier
  "https://exemple.fr/jour-32",  // 26 janvier
  "https://exemple.fr/jour-33",  // 27 janvier
  "https://exemple.fr/jour-34",  // 28 janvier
  "https://exemple.fr/jour-35",  // 29 janvier
  "https://exemple.fr/jour-36",  // 30 janvier
  "https://exemple.fr/jour-37",  // 31 janvier
];

const NAMES = [
  // Exemple : "Ma plateforme préférée",  // jour 1 (26 décembre)
];

const TOTAL_DAYS = 37;
const MONTHS = { 11: "DÉCEMBRE", 0: "JANVIER" };
const MONTHS_SHORT = { 11: "DÉC", 0: "JAN" };

/* --------------------------------- Dates ---------------------------------- */

function dateForIndex(index, startYear) {
  return index < 6
    ? new Date(startYear, 11, 26 + index)
    : new Date(startYear + 1, 0, index - 5);
}

function dayIndex(date, startYear) {
  if (date.getMonth() === 11) return date.getDate() - 26;
  return 6 + date.getDate() - 1;
}

function getSeason(today) {
  const year = today.getFullYear();
  for (const startYear of [year, year - 1, year + 1]) {
    const start = new Date(startYear, 11, 26);
    const end = new Date(startYear + 1, 0, 31, 23, 59, 59, 999);
    if (today >= start && today <= end) return { startYear, start, active: true };
  }
  // Hors période : on affiche la prochaine édition, toutes portes fermées.
  return { startYear: year, start: new Date(year, 11, 26), active: false };
}

function formatDate(index, startYear, short = false) {
  const date = dateForIndex(index, startYear);
  const month = (short ? MONTHS_SHORT : MONTHS)[date.getMonth()];
  return `${date.getDate()} ${month}`;
}

/* --------------------------------- État ----------------------------------- */

const params = new URLSearchParams(window.location.search);
const preview = params.has("preview");
const today = new Date();
const season = getSeason(today);
const currentIndex = season.active ? Math.max(0, Math.min(TOTAL_DAYS - 1, dayIndex(today, season.startYear))) : -1;
const storageKey = `calendrier-apres:opened:${season.startYear}`;

function loadOpened() {
  if (preview) return new Set();
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(Array.isArray(raw) ? raw.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

const opened = loadOpened();

function saveOpened() {
  if (preview) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify([...opened]));
  } catch {
    /* navigation privée ou stockage indisponible : on continue sans sauver */
  }
}

function isAvailable(index) {
  return preview || index <= currentIndex;
}

/* --------------------------------- DOM ------------------------------------ */

const grid = document.getElementById("grid");
const dialog = document.getElementById("door-dialog");
const dialogDate = document.getElementById("dialog-date");
const dialogText = document.getElementById("dialog-text");
const dialogLink = document.getElementById("dialog-link");
const dialogClose = document.getElementById("dialog-close");
const dialogLater = document.getElementById("dialog-later");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const countdown = document.getElementById("countdown");
const toast = document.getElementById("toast");

document.getElementById("season-label").textContent = `${season.startYear} → ${season.startYear + 1}`;
if (preview) {
  document.querySelector(".hero__hint").textContent = "Mode aperçu : toutes les portes sont débloquées.";
}

function platformName(index) {
  const custom = NAMES[index];
  if (custom) return custom;
  const url = LINKS[index];
  if (!url) return "la plateforme du jour";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "la plateforme du jour";
  }
}

function cardState(index) {
  if (!isAvailable(index)) return "locked";
  if (opened.has(index)) return "open";
  return "ready";
}

function statusContent(state) {
  if (state === "locked") return { icon: "🔒", label: "À venir" };
  if (state === "open") return { icon: "✓", label: "Ouvert" };
  return { icon: "🎁", label: "Ouvrir" };
}

function renderCards() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < TOTAL_DAYS; index += 1) {
    const state = cardState(index);
    const { icon, label } = statusContent(state);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `card is-${state}`;
    card.dataset.index = String(index);
    card.style.setProperty("--i", String(index));
    card.setAttribute("aria-label", `Porte ${index + 1}, ${formatDate(index, season.startYear)} : ${label}`);
    card.innerHTML = `
      <span class="card__top">
        <span class="card__date">${formatDate(index, season.startYear, true)}</span>
        <span class="card__icon" aria-hidden="true"></span>
      </span>
      <span class="card__num">${index + 1}</span>
      <span class="card__status"><span class="card__status-icon" aria-hidden="true"></span><span class="card__status-label"></span></span>
      ${state === "ready" ? '<span class="card__glow"></span>' : ""}
    `;
    card.querySelector(".card__icon").textContent = icon;
    card.querySelector(".card__status-icon").textContent = state === "locked" ? "" : icon;
    card.querySelector(".card__status-label").textContent = label;
    fragment.appendChild(card);
  }

  grid.replaceChildren(fragment);
  updateProgress();
}

function refreshCard(index) {
  const card = grid.querySelector(`[data-index="${index}"]`);
  if (!card) return;
  const state = cardState(index);
  const { icon, label } = statusContent(state);
  card.className = `card is-${state}`;
  card.querySelector(".card__icon").textContent = icon;
  card.querySelector(".card__status-icon").textContent = state === "locked" ? "" : icon;
  card.querySelector(".card__status-label").textContent = label;
  card.setAttribute("aria-label", `Porte ${index + 1}, ${formatDate(index, season.startYear)} : ${label}`);
}

function updateProgress() {
  const count = opened.size;
  progressText.textContent = `${count} / ${TOTAL_DAYS} ouverte${count > 1 ? "s" : ""}`;
  progressBar.style.width = `${(count / TOTAL_DAYS) * 100}%`;
}

/* ------------------------------- Interactions ----------------------------- */

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function confetti(x, y) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "confetti";
  const colors = ["#f3c678", "#e88fa8", "#81d4c2", "#ffffff", "#9b8cf0"];
  for (let i = 0; i < 28; i += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.4;
    const distance = 70 + Math.random() * 150;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--ty", `${Math.sin(angle) * distance + 60}px`);
    particle.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    particle.style.setProperty("--c", colors[i % colors.length]);
    particle.style.animationDelay = `${Math.random() * 0.12}s`;
    layer.appendChild(particle);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1300);
}

function openDoor(index, event) {
  if (!isAvailable(index)) {
    const card = grid.querySelector(`[data-index="${index}"]`);
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    showToast(`Cette porte s'ouvrira le ${formatDate(index, season.startYear)}.`);
    return;
  }

  if (!opened.has(index)) {
    opened.add(index);
    saveOpened();
    refreshCard(index);
    updateProgress();
  }

  const name = platformName(index);
  const strong = document.createElement("strong");
  strong.textContent = name;
  dialogText.replaceChildren("Votre lien du jour vous attend sur ", strong, ". Bonne découverte !");
  dialogDate.textContent = `PORTE ${index + 1} · ${formatDate(index, season.startYear)}`;

  const url = LINKS[index];
  if (url && /^https?:\/\//i.test(url)) {
    dialogLink.href = url;
    dialogLink.removeAttribute("disabled");
    dialogLink.hidden = false;
  } else {
    dialogLink.removeAttribute("href");
    dialogLink.setAttribute("disabled", "");
  }

  if (!dialog.open) dialog.showModal();

  const rect = event.currentTarget.getBoundingClientRect();
  confetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) openDoor(Number(card.dataset.index), event);
});

dialogClose.addEventListener("click", () => dialog.close());
dialogLater.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (preview) {
    showToast("Mode aperçu : aucune ouverture enregistrée.");
    return;
  }
  localStorage.removeItem(storageKey);
  showToast("Vos portes ouvertes ont été réinitialisées.");
  opened.clear();
  renderCards();
});

/* -------------------------------- Countdown ------------------------------- */

function nextTarget() {
  if (!season.active) return season.start;
  if (currentIndex >= TOTAL_DAYS - 1) return null;
  const target = dateForIndex(currentIndex + 1, season.startYear);
  target.setHours(0, 0, 0, 0);
  return target;
}

function updateCountdown() {
  const target = nextTarget();
  if (!target) {
    countdown.innerHTML = '<span class="countdown__label">Toutes les portes sont ouvertes. À l’année prochaine ! ✦</span>';
    return;
  }
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const label = season.active ? "Prochaine porte dans" : "Première porte dans";
  countdown.innerHTML = `
    <span class="countdown__label">${label}</span>
    <span class="unit"><strong>${days}</strong><small>j</small></span>
    <span class="unit"><strong>${String(hours).padStart(2, "0")}</strong><small>h</small></span>
    <span class="unit"><strong>${String(minutes).padStart(2, "0")}</strong><small>m</small></span>
    <span class="unit"><strong>${String(seconds).padStart(2, "0")}</strong><small>s</small></span>
  `;
}

/* --------------------------------- Snow ----------------------------------- */

function makeSnow() {
  const container = document.getElementById("snow");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 45; i += 1) {
    const flake = document.createElement("span");
    const size = 2 + Math.random() * 4;
    flake.style.setProperty("--x", `${Math.random() * 100}%`);
    flake.style.setProperty("--s", `${size}px`);
    flake.style.setProperty("--o", String(0.25 + Math.random() * 0.5));
    flake.style.setProperty("--d", `${9 + Math.random() * 14}s`);
    flake.style.setProperty("--delay", `${-Math.random() * 20}s`);
    flake.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
    fragment.appendChild(flake);
  }
  container.appendChild(fragment);
}

/* ---------------------------------- Init ---------------------------------- */

renderCards();
updateCountdown();
setInterval(updateCountdown, 1000);
makeSnow();
