/* ============================================================================
   Calendrier de l'après — Coach Annabh — 1er au 31 janvier (31 jours)
   ----------------------------------------------------------------------------
   Chaque porte cache un lien vers un entraînement ou une recette.
   Pour personnaliser, remplissez les 31 lignes ci-dessous dans l'ordre :
   1, 2, 3 ... 31 janvier.

   type  : "entrainement" ou "recette"
   title : le nom affiché quand la porte est ouverte
   url   : le lien externe (laissez "" si vous ne l'avez pas encore)
   ========================================================================== */

const DAYS = [
  { type: "entrainement", title: "Entraînement du jour 1", url: "" },  // 1 janvier
  { type: "recette",      title: "Recette du jour 2",      url: "" },  // 2 janvier
  { type: "entrainement", title: "Entraînement du jour 3", url: "" },  // 3 janvier
  { type: "recette",      title: "Recette du jour 4",      url: "" },  // 4 janvier
  { type: "entrainement", title: "Entraînement du jour 5", url: "" },  // 5 janvier
  { type: "recette",      title: "Recette du jour 6",      url: "" },  // 6 janvier
  { type: "entrainement", title: "Entraînement du jour 7", url: "" },  // 7 janvier
  { type: "recette",      title: "Recette du jour 8",      url: "" },  // 8 janvier
  { type: "entrainement", title: "Entraînement du jour 9", url: "" },  // 9 janvier
  { type: "recette",      title: "Recette du jour 10",     url: "" },  // 10 janvier
  { type: "entrainement", title: "Entraînement du jour 11", url: "" }, // 11 janvier
  { type: "recette",      title: "Recette du jour 12",     url: "" },  // 12 janvier
  { type: "entrainement", title: "Entraînement du jour 13", url: "" }, // 13 janvier
  { type: "recette",      title: "Recette du jour 14",     url: "" },  // 14 janvier
  { type: "entrainement", title: "Entraînement du jour 15", url: "" }, // 15 janvier
  { type: "recette",      title: "Recette du jour 16",     url: "" },  // 16 janvier
  { type: "entrainement", title: "Entraînement du jour 17", url: "" }, // 17 janvier
  { type: "recette",      title: "Recette du jour 18",     url: "" },  // 18 janvier
  { type: "entrainement", title: "Entraînement du jour 19", url: "" }, // 19 janvier
  { type: "recette",      title: "Recette du jour 20",     url: "" },  // 20 janvier
  { type: "entrainement", title: "Entraînement du jour 21", url: "" }, // 21 janvier
  { type: "recette",      title: "Recette du jour 22",     url: "" },  // 22 janvier
  { type: "entrainement", title: "Entraînement du jour 23", url: "" }, // 23 janvier
  { type: "recette",      title: "Recette du jour 24",     url: "" },  // 24 janvier
  { type: "entrainement", title: "Entraînement du jour 25", url: "" }, // 25 janvier
  { type: "recette",      title: "Recette du jour 26",     url: "" },  // 26 janvier
  { type: "entrainement", title: "Entraînement du jour 27", url: "" }, // 27 janvier
  { type: "recette",      title: "Recette du jour 28",     url: "" },  // 28 janvier
  { type: "entrainement", title: "Entraînement du jour 29", url: "" }, // 29 janvier
  { type: "recette",      title: "Recette du jour 30",     url: "" },  // 30 janvier
  { type: "entrainement", title: "Entraînement du jour 31", url: "" }, // 31 janvier
];

const TOTAL_DAYS = 31;
const MONTH = "JANVIER";
const MONTH_SHORT = "JAN";

/* --------------------------------- Dates ---------------------------------- */

function dateForIndex(index, year) {
  return new Date(year, 0, 1 + index);
}

function dayIndex(date) {
  return date.getMonth() === 0 ? date.getDate() - 1 : -1;
}

function getSeason(today) {
  const year = today.getFullYear();
  for (const candidate of [year, year + 1, year - 1]) {
    const start = new Date(candidate, 0, 1);
    const end = new Date(candidate, 0, TOTAL_DAYS, 23, 59, 59, 999);
    if (today >= start && today <= end) return { year: candidate, start, active: true };
  }
  const endOfThisYear = new Date(year, 0, TOTAL_DAYS, 23, 59, 59, 999);
  const upcomingYear = today > endOfThisYear ? year + 1 : year;
  return { year: upcomingYear, start: new Date(upcomingYear, 0, 1), active: false };
}

function formatDate(index, year, short = false) {
  const date = dateForIndex(index, year);
  return `${date.getDate()} ${short ? MONTH_SHORT : MONTH}`;
}

/* --------------------------------- État ----------------------------------- */

const params = new URLSearchParams(window.location.search);
const preview = params.has("preview");
const today = new Date();
const season = getSeason(today);
const rawIndex = dayIndex(today);
const currentIndex = season.active ? Math.max(0, Math.min(TOTAL_DAYS - 1, rawIndex)) : -1;
const storageKey = `calendrier-apres-annah:opened:${season.year}`;

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
    /* stockage indisponible : on continue sans sauvegarder */
  }
}

function isAvailable(index) {
  return preview || index <= currentIndex;
}

function cardState(index) {
  if (!isAvailable(index)) return "locked";
  if (opened.has(index)) return "open";
  return "ready";
}

/* --------------------------------- Textes --------------------------------- */

function typeLabel(type) {
  return type === "recette" ? "RECETTE" : "ENTRAÎNEMENT";
}

function dialogHeading(type) {
  return type === "recette" ? "Ta recette du jour" : "Ton entraînement du jour";
}

function actionLabel(type) {
  return type === "recette" ? "Voir la recette" : "Voir l'entraînement";
}

/* ---------------------------------- DOM ----------------------------------- */

const grid = document.getElementById("grid");
const dialog = document.getElementById("door-dialog");
const dialogDate = document.getElementById("dialog-date");
const dialogType = document.getElementById("dialog-type");
const dialogTitle = document.getElementById("dialog-title");
const dialogText = document.getElementById("dialog-text");
const dialogLink = document.getElementById("dialog-link");
const dialogClose = document.getElementById("dialog-close");
const dialogLater = document.getElementById("dialog-later");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const countdown = document.getElementById("countdown");
const toast = document.getElementById("toast");

function describeCard(index, state) {
  const base = `Porte ${index + 1}, ${formatDate(index, season.year)}`;
  if (state === "locked") return `${base} : à venir`;
  if (state === "open") return `${base} : ${typeLabel(DAYS[index].type)} — ${DAYS[index].title}`;
  return `${base} : à ouvrir`;
}

function setCardContent(card, index, state) {
  const icon = card.querySelector(".card__icon");
  const foot = card.querySelector(".card__foot");
  foot.replaceChildren();

  if (state === "open") {
    const day = DAYS[index];
    const typeEl = document.createElement("span");
    typeEl.className = "card__type";
    typeEl.textContent = typeLabel(day.type);
    const titleEl = document.createElement("span");
    titleEl.className = "card__title";
    titleEl.textContent = day.title;
    foot.append(typeEl, titleEl);
    icon.textContent = day.type === "recette" ? "🥗" : "💪";
  } else {
    const statusEl = document.createElement("span");
    statusEl.className = "card__status";
    const iconEl = document.createElement("span");
    iconEl.setAttribute("aria-hidden", "true");
    iconEl.textContent = state === "locked" ? "🔒" : "🎁";
    const labelEl = document.createElement("span");
    labelEl.textContent = state === "locked" ? "À venir" : "Ouvrir";
    statusEl.append(iconEl, labelEl);
    foot.appendChild(statusEl);
    icon.textContent = state === "locked" ? "🔒" : "🎁";
  }
}

function renderCards() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < TOTAL_DAYS; index += 1) {
    const state = cardState(index);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `card is-${state}`;
    card.dataset.index = String(index);
    card.style.setProperty("--i", String(index));
    card.setAttribute("aria-label", describeCard(index, state));
    card.innerHTML = `
      <span class="card__top">
        <span class="card__date">${formatDate(index, season.year, true)}</span>
        <span class="card__icon" aria-hidden="true"></span>
      </span>
      <span class="card__num">${index + 1}</span>
      <span class="card__foot"></span>
    `;
    setCardContent(card, index, state);
    fragment.appendChild(card);
  }

  grid.replaceChildren(fragment);
  updateProgress();
}

function refreshCard(index) {
  const card = grid.querySelector(`[data-index="${index}"]`);
  if (!card) return;
  const state = cardState(index);
  card.className = `card is-${state}`;
  card.setAttribute("aria-label", describeCard(index, state));
  setCardContent(card, index, state);
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
  const colors = ["#b40225", "#ec1c46", "#ffffff", "#1e1e1e", "#f3a6b7"];
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
    showToast(`Cette porte s'ouvrira le ${formatDate(index, season.year)}.`);
    return;
  }

  const day = DAYS[index];

  if (!opened.has(index)) {
    opened.add(index);
    saveOpened();
    refreshCard(index);
    updateProgress();
  }

  dialogDate.textContent = `PORTE ${index + 1} · ${formatDate(index, season.year)}`;
  dialogType.textContent = typeLabel(day.type);
  dialogTitle.textContent = dialogHeading(day.type);

  const strong = document.createElement("strong");
  strong.textContent = day.title;
  const url = day.url;
  if (url && /^https?:\/\//i.test(url)) {
    dialogText.replaceChildren(strong, document.createTextNode(". Clique ci-dessous pour y accéder."));
    dialogLink.href = url;
    dialogLink.textContent = `${actionLabel(day.type)} ↗`;
    dialogLink.removeAttribute("disabled");
  } else {
    dialogText.replaceChildren(strong, document.createTextNode(". Le lien sera ajouté prochainement."));
    dialogLink.removeAttribute("href");
    dialogLink.textContent = "Lien à ajouter";
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
  opened.clear();
  renderCards();
  showToast("Vos portes ouvertes ont été réinitialisées.");
});

/* -------------------------------- Countdown ------------------------------- */

function nextTarget() {
  if (!season.active) return season.start;
  if (currentIndex >= TOTAL_DAYS - 1) return null;
  const target = dateForIndex(currentIndex + 1, season.year);
  target.setHours(0, 0, 0, 0);
  return target;
}

function updateCountdown() {
  const target = nextTarget();
  if (!target) {
    countdown.innerHTML = '<span class="countdown__label">Toutes les portes sont ouvertes. À l’an prochain ! ✦</span>';
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

/* ---------------------------------- Init ---------------------------------- */

renderCards();
updateCountdown();
setInterval(updateCountdown, 1000);
