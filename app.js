const CONFIG = {
  linkedin: "https://www.linkedin.com/in/david-fernandes-08b005b4/",
  dataFile: "./data/certs.json"
};

const VALID_DOC_IMAGE = /^img\/[a-z0-9._\-/]+$/i;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const UI = {
  grid: $("#grid"),
  statsPanel: $("#statsPanel"),
  search: $("#search"),
  category: $("#filterCategory"),
  issuer: $("#filterIssuer"),
  sortBy: $("#sortBy"),
  btnLight: $("#btnLight"),
  btnDark: $("#btnDark"),
  btnPrint: $("#btnPrint"),
  languageSelect: $("#languageSelect"),
  btnLinkedIn: $("#btnLinkedIn"),
  avatarImg: $("#avatarImg"),
  zoomOverlay: $("#zoomOverlay"),
  certModal: $("#certModal"),
  certModalImg: $("#certModalImg")
};

const AppState = {
  certs: [],
  previousFocus: null,
  activeModal: null,
  locale: "pt-BR"
};

const I18N = {
  "pt-BR": {
    pageTitle: "David Alexandre Fernandes 🎓 Certificados & Certificações",
    languageLabel: "Idioma",
    languageAuto: "Idioma automático",
    btnPrint: "🖨️ Exportar PDF",
    linkedinText: "LinkedIn de David Alexandre Fernandes",
    linkedinAria: "Abrir LinkedIn de David Alexandre Fernandes",
    avatarAlt: "Foto de perfil de David Alexandre Fernandes",
    avatarZoomAlt: "Foto ampliada de David Alexandre Fernandes",
    searchLabel: "Busca",
    searchPlaceholder: "Buscar por título, emissor, habilidade…",
    categoryLabel: "Categoria",
    allCategories: "Todas",
    issuerLabel: "Emissor",
    allIssuers: "Todos",
    sortLabel: "Ordenação",
    sortDateDesc: "Mais recentes",
    sortDateAsc: "Mais antigos",
    sortTitleAsc: "Título A→Z",
    statsLabel: "Métricas",
    statsCredentials: "Credenciais",
    statsVerified: "Com verificação",
    statsIssuers: "Emissores",
    statsSkills: "Skills",
    statsVisibleItems: "Itens visíveis no momento",
    statsOfficialLink: "Com link oficial",
    statsDifferentInstitutions: "Instituições diferentes",
    statsCatalogedSkills: "Competências catalogadas",
    issued: "Emitido",
    expires: "Expira",
    id: "ID",
    qrUnavailable: "QR indisponível",
    viewCertificate: "Ver certificado aqui",
    verifyCredential: "Verificar credencial",
    openBadge: "Abrir badge",
    emptyItems: "Nenhum item encontrado.",
    loadError: "Não foi possível carregar as credenciais no momento.",
    certificateFallbackAlt: "Certificado"
  },
  en: {
    pageTitle: "David Alexandre Fernandes 🎓 Certificates & Credentials",
    languageLabel: "Language",
    languageAuto: "Automatic language",
    btnPrint: "🖨️ Export PDF",
    linkedinText: "David Alexandre Fernandes' LinkedIn",
    linkedinAria: "Open David Alexandre Fernandes' LinkedIn",
    avatarAlt: "Profile photo of David Alexandre Fernandes",
    avatarZoomAlt: "Zoomed profile photo of David Alexandre Fernandes",
    searchLabel: "Search",
    searchPlaceholder: "Search by title, issuer, skill…",
    categoryLabel: "Category",
    allCategories: "All",
    issuerLabel: "Issuer",
    allIssuers: "All",
    sortLabel: "Sort",
    sortDateDesc: "Most recent",
    sortDateAsc: "Oldest",
    sortTitleAsc: "Title A→Z",
    statsLabel: "Metrics",
    statsCredentials: "Credentials",
    statsVerified: "Verified",
    statsIssuers: "Issuers",
    statsSkills: "Skills",
    statsVisibleItems: "Currently visible items",
    statsOfficialLink: "With official link",
    statsDifferentInstitutions: "Different institutions",
    statsCatalogedSkills: "Cataloged skills",
    issued: "Issued",
    expires: "Expires",
    id: "ID",
    qrUnavailable: "QR unavailable",
    viewCertificate: "View certificate",
    verifyCredential: "Verify credential",
    openBadge: "Open badge",
    emptyItems: "No items found.",
    loadError: "Unable to load credentials right now.",
    certificateFallbackAlt: "Certificate"
  },
  es: {
    pageTitle: "David Alexandre Fernandes 🎓 Certificados y Certificaciones",
    languageLabel: "Idioma",
    languageAuto: "Idioma automático",
    btnPrint: "🖨️ Exportar PDF",
    linkedinText: "LinkedIn de David Alexandre Fernandes",
    linkedinAria: "Abrir LinkedIn de David Alexandre Fernandes",
    avatarAlt: "Foto de perfil de David Alexandre Fernandes",
    avatarZoomAlt: "Foto de perfil ampliada de David Alexandre Fernandes",
    searchLabel: "Búsqueda",
    searchPlaceholder: "Buscar por título, emisor, habilidad…",
    categoryLabel: "Categoría",
    allCategories: "Todas",
    issuerLabel: "Emisor",
    allIssuers: "Todos",
    sortLabel: "Orden",
    sortDateDesc: "Más recientes",
    sortDateAsc: "Más antiguos",
    sortTitleAsc: "Título A→Z",
    statsLabel: "Métricas",
    statsCredentials: "Credenciales",
    statsVerified: "Con verificación",
    statsIssuers: "Emisores",
    statsSkills: "Habilidades",
    statsVisibleItems: "Elementos visibles actualmente",
    statsOfficialLink: "Con enlace oficial",
    statsDifferentInstitutions: "Instituciones diferentes",
    statsCatalogedSkills: "Competencias catalogadas",
    issued: "Emitido",
    expires: "Vence",
    id: "ID",
    qrUnavailable: "QR no disponible",
    viewCertificate: "Ver certificado",
    verifyCredential: "Verificar credencial",
    openBadge: "Abrir badge",
    emptyItems: "No se encontraron elementos.",
    loadError: "No fue posible cargar las credenciales en este momento.",
    certificateFallbackAlt: "Certificado"
  }
};

function getPreferredLocale() {
  const savedLocale = safeText(localStorage.getItem("locale"));
  if (savedLocale && I18N[savedLocale]) return savedLocale;

  const browserLocales = safeArray(navigator.languages).concat([navigator.language]);
  const match = browserLocales
    .map((locale) => safeText(locale).toLowerCase())
    .find((locale) => locale.startsWith("pt") || locale.startsWith("en") || locale.startsWith("es"));

  if (match?.startsWith("pt")) return "pt-BR";
  if (match?.startsWith("es")) return "es";
  return "en";
}

function t(key) {
  return I18N[AppState.locale]?.[key] || I18N["pt-BR"][key] || key;
}

function applyTranslations() {
  document.documentElement.lang = AppState.locale;

  const setText = (selector, key) => {
    const element = $(selector);
    if (element) element.textContent = t(key);
  };

  setText("#pageTitle", "pageTitle");
  setText("#languageLabel", "languageLabel");
  setText("#btnPrint", "btnPrint");
  setText("#linkedinSrOnly", "linkedinText");
  setText("#searchLabel", "searchLabel");
  setText("#categoryLabel", "categoryLabel");
  setText("#issuerLabel", "issuerLabel");
  setText("#sortLabel", "sortLabel");
  setText("#allCategoriesOption", "allCategories");
  setText("#allIssuersOption", "allIssuers");
  setText("#sortDateDesc", "sortDateDesc");
  setText("#sortDateAsc", "sortDateAsc");
  setText("#sortTitleAsc", "sortTitleAsc");

  UI.search.placeholder = t("searchPlaceholder");
  UI.statsPanel.setAttribute("aria-label", t("statsLabel"));
  UI.btnLinkedIn.setAttribute("aria-label", t("linkedinAria"));

  $$("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split(":");
    if (attribute && key) element.setAttribute(attribute, t(key));
  });

  if (UI.languageSelect) {
    const autoOption = UI.languageSelect.querySelector('option[value=""]');
    if (autoOption) autoOption.textContent = t("languageAuto");
  }
}

function setLocale(locale, persist = true) {
  AppState.locale = I18N[locale] ? locale : "pt-BR";
  if (persist) localStorage.setItem("locale", AppState.locale);
  applyTranslations();
}

function safeText(value, fallback = "") {
  return String(value ?? fallback).trim() || fallback;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isSafeUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(String(value).trim(), window.location.origin);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeImagePath(path) {
  return VALID_DOC_IMAGE.test(safeText(path));
}

function normalizeDoc(doc) {
  return {
    label: safeText(doc?.label, "Documento"),
    url: isSafeUrl(doc?.url) ? doc.url : "",
    imagePath: isSafeImagePath(doc?.imagePath) ? doc.imagePath : ""
  };
}

function normalizeCert(cert) {
  const docs = safeArray(cert?.docs).map(normalizeDoc);

  return {
    id: safeText(cert?.id),
    title: safeText(cert?.title, "Título indisponível"),
    issuer: safeText(cert?.issuer, "—"),
    category: safeText(cert?.category),
    issueDate: safeText(cert?.issueDate),
    expireDate: safeText(cert?.expireDate),
    verifyUrl: isSafeUrl(cert?.verifyUrl) ? cert.verifyUrl : "",
    badgeUrl: isSafeUrl(cert?.badgeUrl) ? cert.badgeUrl : "",
    logoUrl: isSafeUrl(cert?.logoUrl) ? cert.logoUrl : "",
    qrCodeUrl: isSafeUrl(cert?.qrCodeUrl) ? cert.qrCodeUrl : "",
    skills: safeArray(cert?.skills).map((skill) => safeText(skill)).filter(Boolean),
    docs
  };
}

function getBadgeSource(cert) {
  return cert.badgeUrl || cert.logoUrl;
}

function getPrimaryDocImage(cert) {
  return cert.docs.find((doc) => doc.imagePath) || null;
}

function setTheme(mode) {
  const isLight = mode === "light";
  if (isLight) document.body.setAttribute("data-theme", "light");
  else document.body.removeAttribute("data-theme");

  UI.btnLight.classList.toggle("active", isLight);
  UI.btnDark.classList.toggle("active", !isLight);
  UI.btnLight.setAttribute("aria-pressed", String(isLight));
  UI.btnDark.setAttribute("aria-pressed", String(!isLight));

  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function formatDate(ym) {
  if (!ym) return "";
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), (+month || 1) - 1, 1);
  return new Intl.DateTimeFormat(AppState.locale, { month: "short", year: "numeric" }).format(date);
}

function createLink(className, href, text) {
  if (!isSafeUrl(href)) return null;

  const link = document.createElement("a");
  link.className = className;
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = text;
  return link;
}

function createImage(className, src, alt) {
  if (!isSafeUrl(src)) return null;

  const img = document.createElement("img");
  img.className = className;
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.decoding = "async";
  return img;
}

function openModal(modal, triggerElement) {
  AppState.previousFocus = triggerElement || document.activeElement;
  AppState.activeModal = modal;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  const firstFocusable = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  (firstFocusable || modal).focus();
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  AppState.activeModal = null;

  if (AppState.previousFocus && document.contains(AppState.previousFocus)) {
    AppState.previousFocus.focus();
  }
}

function trapFocus(event) {
  if (!AppState.activeModal || event.key !== "Tab") return;

  const focusables = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", AppState.activeModal)
    .filter((element) => !element.hasAttribute("disabled"));

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function renderStats(list) {
  const uniqueIssuers = [...new Set(list.map((cert) => cert.issuer).filter(Boolean))].length;
  const validLinks = list.filter((cert) => cert.verifyUrl).length;
  const totalSkills = [...new Set(list.flatMap((cert) => cert.skills))].length;

  const items = [
    { label: t("statsCredentials"), value: list.length, icon: "🎓", helper: t("statsVisibleItems") },
    { label: t("statsVerified"), value: validLinks, icon: "✅", helper: t("statsOfficialLink") },
    { label: t("statsIssuers"), value: uniqueIssuers, icon: "🏢", helper: t("statsDifferentInstitutions") },
    { label: t("statsSkills"), value: totalSkills, icon: "🧠", helper: t("statsCatalogedSkills") }
  ];

  UI.statsPanel.replaceChildren(...items.map(({ label, value, icon, helper }) => {
    const stat = document.createElement("article");
    stat.className = "stat";

    const top = document.createElement("div");
    top.className = "stat-top";

    const badge = document.createElement("span");
    badge.className = "stat-icon";
    badge.textContent = icon;

    const strong = document.createElement("strong");
    strong.textContent = String(value);

    const name = document.createElement("span");
    name.textContent = label;

    const helperText = document.createElement("small");
    helperText.textContent = helper;

    top.append(badge, strong);
    stat.append(top, name, helperText);
    return stat;
  }));
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

  const badge = createImage("badge", getBadgeSource(cert), "Badge");
  if (badge) left.appendChild(badge);

  const textWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = cert.title;

  const issuer = document.createElement("p");
  issuer.textContent = cert.issuer;

  const meta = document.createElement("p");
  const parts = [];
  if (formatDate(cert.issueDate)) parts.push(`${t("issued")}: ${formatDate(cert.issueDate)}`);
  if (formatDate(cert.expireDate)) parts.push(`${t("expires")}: ${formatDate(cert.expireDate)}`);
  if (cert.id) parts.push(`${t("id")}: ${cert.id}`);
  meta.textContent = parts.join(" • ");

  textWrap.append(title, issuer, meta);
  left.appendChild(textWrap);

  if (cert.verifyUrl) {
    const qrImage = createImage("qr-code", cert.qrCodeUrl, `QR Code de verificação de ${cert.title}`);
    if (qrImage) {
      right.appendChild(qrImage);
    } else {
      const qrFallback = document.createElement("div");
      qrFallback.className = "qr-placeholder";
      qrFallback.textContent = t("qrUnavailable");
      right.appendChild(qrFallback);
    }
  }

  head.append(left, right);
  card.appendChild(head);

  if (cert.skills.length) {
    const chips = document.createElement("div");
    chips.className = "chips";

    cert.skills.forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = skill;
      chips.appendChild(chip);
    });

    card.appendChild(chips);
  }

  const docLinks = cert.docs.filter((doc) => doc.url && !doc.imagePath);
  if (docLinks.length) {
    const list = document.createElement("ul");

    docLinks.forEach((doc) => {
      const item = document.createElement("li");
      const link = createLink("", doc.url, doc.label);
      if (!link) return;
      item.appendChild(link);
      list.appendChild(item);
    });

    if (list.children.length) card.appendChild(list);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const primaryDocImage = getPrimaryDocImage(cert);
  if (primaryDocImage) {
    const openCertificate = document.createElement("button");
    openCertificate.className = "verify primary btn";
    openCertificate.textContent = t("viewCertificate");
    openCertificate.dataset.docImagePath = primaryDocImage.imagePath;
    openCertificate.dataset.docTitle = primaryDocImage.label || cert.title;
    actions.appendChild(openCertificate);
  } else {
    const verifyLink = createLink("verify primary", cert.verifyUrl, t("verifyCredential"));
    if (verifyLink) actions.appendChild(verifyLink);
  }

  const badgeLink = createLink("verify", getBadgeSource(cert), t("openBadge"));
  if (badgeLink) actions.appendChild(badgeLink);

  if (actions.children.length) card.appendChild(actions);
  return card;
}

function applyFiltersAndSort() {
  const term = UI.search.value.toLowerCase().trim();

  const filtered = AppState.certs
    .filter((cert) => {
      if (!term) return true;
      const searchable = `${cert.title} ${cert.issuer} ${cert.skills.join(" ")}`.toLowerCase();
      return searchable.includes(term);
    })
    .filter((cert) => !UI.category.value || cert.category === UI.category.value)
    .filter((cert) => !UI.issuer.value || cert.issuer === UI.issuer.value);

  const sorters = {
    dateDesc: (a, b) => (b.issueDate || "").localeCompare(a.issueDate || ""),
    dateAsc: (a, b) => (a.issueDate || "").localeCompare(b.issueDate || ""),
    titleAsc: (a, b) => a.title.localeCompare(b.title, AppState.locale)
  };

  filtered.sort(sorters[UI.sortBy.value] || sorters.dateDesc);
  return filtered;
}

function renderEmptyState(message) {
  const empty = document.createElement("article");
  empty.className = "card";
  empty.textContent = message;
  UI.grid.replaceChildren(empty);
  renderStats([]);
}

function render() {
  const list = applyFiltersAndSort();

  if (!list.length) {
    renderEmptyState(t("emptyItems"));
    return;
  }

  UI.grid.replaceChildren(...list.map(createCard));
  renderStats(list);
}

function populateSelectOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

async function initData() {
  try {
    const response = await fetch(CONFIG.dataFile, { cache: "no-store" });
    if (!response.ok) throw new Error(`Falha ao carregar dados (${response.status})`);

    const data = await response.json();
    AppState.certs = safeArray(data).map(normalizeCert);

    const categories = [...new Set(AppState.certs.map((cert) => cert.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, AppState.locale));
    const issuers = [...new Set(AppState.certs.map((cert) => cert.issuer).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, AppState.locale));

    populateSelectOptions(UI.category, categories);
    populateSelectOptions(UI.issuer, issuers);

    render();
  } catch (error) {
    console.error(error);
    renderEmptyState(t("loadError"));
  }
}

function initEvents() {
  UI.search.addEventListener("input", render);
  UI.category.addEventListener("change", render);
  UI.issuer.addEventListener("change", render);
  UI.sortBy.addEventListener("change", render);

  UI.btnLight.addEventListener("click", () => setTheme("light"));
  UI.btnDark.addEventListener("click", () => setTheme("dark"));
  UI.btnPrint.addEventListener("click", () => window.print());

  UI.languageSelect.addEventListener("change", () => {
    const selected = UI.languageSelect.value || getPreferredLocale();
    setLocale(selected, true);
    render();
  });

  if (isSafeUrl(CONFIG.linkedin)) UI.btnLinkedIn.href = CONFIG.linkedin;
  else UI.btnLinkedIn.classList.add("hidden");

  UI.avatarImg.addEventListener("click", (event) => openModal(UI.zoomOverlay, event.currentTarget));
  UI.zoomOverlay.addEventListener("click", (event) => {
    if (event.target === UI.zoomOverlay) closeModal(UI.zoomOverlay);
  });

  UI.certModal.addEventListener("click", (event) => {
    if (event.target === UI.certModal) closeModal(UI.certModal);
  });

  UI.grid.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-doc-image-path]");
    if (!target) return;

    UI.certModalImg.src = target.dataset.docImagePath;
    UI.certModalImg.alt = target.dataset.docTitle || t("certificateFallbackAlt");
    openModal(UI.certModal, target);
  });

  UI.grid.addEventListener("mousemove", (event) => {
    if (REDUCED_MOTION) return;

    const card = event.target.closest(".card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });

  UI.grid.addEventListener("mouseleave", () => {
    $$(".card", UI.grid).forEach((card) => {
      card.style.transform = "";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && AppState.activeModal) closeModal(AppState.activeModal);
    trapFocus(event);
  });
}

(function init() {
  const preferredLocale = getPreferredLocale();
  setLocale(preferredLocale, false);
  if (UI.languageSelect) UI.languageSelect.value = localStorage.getItem("locale") || "";
  setTheme(localStorage.getItem("theme") || "dark");
  initEvents();
  initData();
})();
