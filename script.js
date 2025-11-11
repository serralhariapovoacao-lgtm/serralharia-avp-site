// URL do Web App do Google Apps Script (NOVA IMPLEMENTAÇÃO)
const GS_URL = "https://script.google.com/macros/s/AKfycbxLJPbLES90hlQ0-Hyolo2J2vihSRxso9C9TXK_BqxgXmt8VQX5YXadQjLYfxzcaAUbwg/exec";

// Função genérica para enviar um formulário (encomenda ou orçamento)
async function enviarFormulario(tipo) {
  const form = tipo === "encomenda"
    ? document.getElementById("form-encomenda")
    : document.getElementById("form-orcamento");

  if (!form) {
    console.error("Formulário não encontrado para tipo:", tipo);
    return;
  }

  const mensagemEl = document.getElementById("mensagem-" + tipo);
  if (mensagemEl) {
    mensagemEl.textContent = "A enviar o seu pedido...";
    mensagemEl.style.color = "#333";
  }

  const formData = new FormData(form);
  const payload = { tipo };

  formData.forEach((value, key) => {
    payload[key] = value;
  });

  console.log("📤 Vou enviar para Google Apps Script:", payload);

  try {
    await fetch(GS_URL, {
      method: "POST",
      mode: "no-cors", // <- MUITO IMPORTANTE para não dar CORS
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    console.log("✅ Pedido enviado (modo no-cors). Verifica o Google Sheets.");

    if (mensagemEl) {
      mensagemEl.textContent = "Pedido enviado com sucesso! Vai receber um email de confirmação.";
      mensagemEl.style.color = "green";
    }

    form.reset();
  } catch (err) {
    console.error("❌ Erro ao enviar para o Google Apps Script:", err);
    if (mensagemEl) {
      mensagemEl.textContent = "Ocorreu um erro ao enviar. Por favor tente mais tarde.";
      mensagemEl.style.color = "red";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formEncomenda = document.getElementById("form-encomenda");
  if (formEncomenda) {
    formEncomenda.addEventListener("submit", (e) => {
      e.preventDefault();
      enviarFormulario("encomenda");
    });
  }

  const formOrcamento = document.getElementById("form-orcamento");
  if (formOrcamento) {
    formOrcamento.addEventListener("submit", (e) => {
      e.preventDefault();
      enviarFormulario("orcamento");
    });
  }
});
