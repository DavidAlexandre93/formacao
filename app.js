const CONFIG = {
  linkedin: "https://www.linkedin.com/in/david-fernandes-08b005b4/"
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const VALID_DOC_IMAGE = /^img\/[a-z0-9._\-/]+$/i;
let certs = [];
let previousFocus = null;
let activeModal = null;

const grid = $("#grid");
const statsPanel = $("#statsPanel");
const search = $("#search");
const fCat = $("#filterCategory");
const fIssuer = $("#filterIssuer");
const sortBy = $("#sortBy");

function isSafeUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(String(value).trim(), window.location.origin);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function safeText(v, fallback = "") {
  return String(v ?? fallback).trim() || fallback;
}

function setTheme(mode) {
  const isLight = mode === "light";
  if (isLight) document.body.setAttribute("data-theme", "light");
  else document.body.removeAttribute("data-theme");
  $("#btnLight").classList.toggle("active", isLight);
  $("#btnDark").classList.toggle("active", !isLight);
  $("#btnLight").setAttribute("aria-pressed", String(isLight));
  $("#btnDark").setAttribute("aria-pressed", String(!isLight));
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function fmtDate(ym) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const ms = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${ms[(+m || 1) - 1]}/${y}`;
}

function createLink(className, href, text) {
  if (!isSafeUrl(href)) return null;
  const a = document.createElement("a");
  a.className = className;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = text;
  return a;
}

function createImage(className, src, alt) {
  if (!isSafeUrl(src)) return null;
  const img = document.createElement("img");
  img.className = className;
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  return img;
}

function getPrimaryDocImage(cert) {
  if (!Array.isArray(cert.docs)) return null;
  return cert.docs.find((doc) => doc?.imagePath && VALID_DOC_IMAGE.test(doc.imagePath)) || null;
}

function openModal(modal, focusEl) {
  previousFocus = focusEl || document.activeElement;
  activeModal = modal;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  const first = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  (first || modal).focus();
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  activeModal = null;
  if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
}

function trapFocus(e) {
  if (!activeModal || e.key !== "Tab") return;
  const focusables = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", activeModal)
    .filter((el) => !el.hasAttribute("disabled"));
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function createCard(cert) {
  const card = document.createElement("article");
  card.className = "card fade-in";

  const head = document.createElement("div");
  head.className = "card-head";
  const left = document.createElement("div");
  left.className = "left";
  const right = document.createElement("div");
  right.className = "right";

  const badge = createImage("badge", cert.badgeUrl, "Badge");
  if (badge) left.appendChild(badge);

  const textWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = safeText(cert.title, "Título indisponível");

  const issuer = document.createElement("p");
  issuer.textContent = safeText(cert.issuer, "—");

  const meta = document.createElement("p");
  const parts = [];
  if (fmtDate(cert.issueDate)) parts.push(`Emitido: ${fmtDate(cert.issueDate)}`);
  if (fmtDate(cert.expireDate)) parts.push(`Expira: ${fmtDate(cert.expireDate)}`);
  if (cert.id) parts.push(`ID: ${safeText(cert.id)}`);
  meta.textContent = parts.join(" • ");

  textWrap.append(title, issuer, meta);
  left.appendChild(textWrap);

  if (isSafeUrl(cert.verifyUrl)) {
    const qrImage = createImage("qr-code", cert.qrCodeUrl, `QR Code de verificação de ${safeText(cert.title, "credencial")}`);
    if (qrImage) right.appendChild(qrImage);
    else {
      const qrFallback = document.createElement("div");
      qrFallback.className = "qr-placeholder";
      qrFallback.textContent = "QR indisponível";
      right.appendChild(qrFallback);
    }
  }

  head.append(left, right);
  card.appendChild(head);

  if (Array.isArray(cert.skills) && cert.skills.length) {
    const chips = document.createElement("div");
    chips.className = "chips";
    cert.skills.forEach((s) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = safeText(s);
      chips.appendChild(chip);
    });
    card.appendChild(chips);
  }

  if (Array.isArray(cert.docs) && cert.docs.length) {
    const ul = document.createElement("ul");
    cert.docs.forEach((doc) => {
      const li = document.createElement("li");
      if (!(doc.imagePath && VALID_DOC_IMAGE.test(doc.imagePath))) {
        const docLink = createLink("", doc.url, safeText(doc.label, "Documento"));
        if (docLink) li.appendChild(docLink);
      }
      if (li.children.length) ul.appendChild(li);
    });
    if (ul.children.length) card.appendChild(ul);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const primaryDocImage = getPrimaryDocImage(cert);
  let verify = null;
  if (primaryDocImage) {
    verify = document.createElement("button");
    verify.className = "verify primary btn";
    verify.textContent = "Ver certificado aqui";
    verify.dataset.docImagePath = primaryDocImage.imagePath;
    verify.dataset.docTitle = safeText(primaryDocImage.label, cert.title);
  } else {
    verify = createLink("verify primary", cert.verifyUrl, "Verificar credencial");
  }
  const badgeLink = createLink("verify", cert.badgeUrl, "Abrir badge");
  if (verify) actions.appendChild(verify);
  if (badgeLink) actions.appendChild(badgeLink);
  if (actions.children.length) card.appendChild(actions);

  return card;
}

function renderStats(list) {
  const uniqueIssuers = [...new Set(list.map((c) => c.issuer).filter(Boolean))].length;
  const valid = list.filter((c) => isSafeUrl(c.verifyUrl)).length;
  const items = [
    ["Credenciais", list.length],
    ["Com verificação", valid],
    ["Emissores", uniqueIssuers],
    ["Skills", [...new Set(list.flatMap((c) => c.skills || []))].length]
  ];
  statsPanel.replaceChildren(...items.map(([label, value]) => {
    const el = document.createElement("article");
    el.className = "stat";
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const span = document.createElement("span");
    span.textContent = label;
    el.append(strong, span);
    return el;
  }));
}

function render() {
  const term = search.value.toLowerCase().trim();
  let list = [...certs]
    .filter((c) => !term || `${c.title} ${c.issuer} ${(c.skills || []).join(" ")}`.toLowerCase().includes(term))
    .filter((c) => !fCat.value || c.category === fCat.value)
    .filter((c) => !fIssuer.value || c.issuer === fIssuer.value);

  const sorters = {
    dateDesc: (a, b) => (b.issueDate || "").localeCompare(a.issueDate || ""),
    dateAsc: (a, b) => (a.issueDate || "").localeCompare(b.issueDate || ""),
    titleAsc: (a, b) => a.title.localeCompare(b.title, "pt-BR")
  };
  list.sort(sorters[sortBy.value] || sorters.dateDesc);

  if (!list.length) {
    const empty = document.createElement("article");
    empty.className = "card";
    empty.textContent = "Nenhum item encontrado.";
    grid.replaceChildren(empty);
    renderStats([]);
    return;
  }

  grid.replaceChildren(...list.map(createCard));
  renderStats(list);
}

async function initData() {
  const response = await fetch("./data/certs.json", { cache: "no-store" });
  certs = await response.json();
  const categories = [...new Set(certs.map((c) => c.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  categories.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    fCat.appendChild(opt);
  });
  const issuers = [...new Set(certs.map((c) => c.issuer).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  issuers.forEach((issuer) => {
    const opt = document.createElement("option");
    opt.value = issuer;
    opt.textContent = issuer;
    fIssuer.appendChild(opt);
  });
  render();
}

function initEvents() {
  [search, fCat, fIssuer, sortBy].forEach((el) => el.addEventListener("input", render));
  $("#btnLight").addEventListener("click", () => setTheme("light"));
  $("#btnDark").addEventListener("click", () => setTheme("dark"));
  $("#btnPrint").addEventListener("click", () => window.print());

  const btnLinkedIn = $("#btnLinkedIn");
  if (isSafeUrl(CONFIG.linkedin)) btnLinkedIn.href = CONFIG.linkedin; else btnLinkedIn.classList.add("hidden");

  const zoomOverlay = $("#zoomOverlay");
  const certModal = $("#certModal");
  const certModalImg = $("#certModalImg");

  $("#avatarImg").addEventListener("click", (e) => openModal(zoomOverlay, e.currentTarget));
  zoomOverlay.addEventListener("click", (e) => { if (e.target === zoomOverlay) closeModal(zoomOverlay); });
  certModal.addEventListener("click", (e) => { if (e.target === certModal) closeModal(certModal); });

  grid.addEventListener("click", (e) => {
    const target = e.target.closest("button[data-doc-image-path]");
    if (!target) return;
    certModalImg.src = target.dataset.docImagePath;
    certModalImg.alt = target.dataset.docTitle || "Certificado";
    openModal(certModal, target);
  });

  grid.addEventListener("mousemove", (e) => {
    if (reducedMotion) return;
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });
  grid.addEventListener("mouseleave", () => $$(".card", grid).forEach((c) => { c.style.transform = ""; }));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeModal) closeModal(activeModal);
    trapFocus(e);
  });
}

(function init() {
  setTheme(localStorage.getItem("theme") || "dark");
  initEvents();
  initData();
})();
