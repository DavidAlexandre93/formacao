const form = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const submitBtn = document.querySelector("#submitBtn");

function pushEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

function readUtmParams() {
  const params = new URLSearchParams(window.location.search);
  document.querySelector("#utmSource").value = params.get("utm_source") || "";
  document.querySelector("#utmMedium").value = params.get("utm_medium") || "";
  document.querySelector("#utmCampaign").value = params.get("utm_campaign") || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = type;
}

async function sendLead(payload) {
  const webhookUrl = window.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    localStorage.setItem("lastLead", JSON.stringify(payload));
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(form).entries());

  if (payload.company) {
    showMessage("Não foi possível enviar. Atualize e tente novamente.", "error");
    return;
  }

  if (!payload.name || payload.name.trim().length < 2) {
    showMessage("Digite seu nome completo para continuar.", "error");
    return;
  }

  if (!isValidEmail(payload.email)) {
    showMessage("Digite um e-mail válido para receber o plano.", "error");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    await sendLead({
      ...payload,
      createdAt: new Date().toISOString(),
      page: window.location.href
    });

    pushEvent("lead_submit", { lead_source: payload.utm_source || "direct" });
    showMessage("Recebemos seu pedido! Em até 1 dia útil você receberá o próximo passo por e-mail.", "success");
    form.reset();
    readUtmParams();
  } catch {
    showMessage("Falha no envio. Tente novamente em instantes.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Quero receber meu plano";
  }
}

function bindTracking() {
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      pushEvent("cta_click", { cta_name: element.dataset.track });
    });
  });
}

readUtmParams();
bindTracking();
form.addEventListener("submit", handleSubmit);
