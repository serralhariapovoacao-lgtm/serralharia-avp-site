// URL do teu Web App do Google Apps Script
const GS_URL = "https://script.google.com/macros/s/AKfycbxQRrZG3ZyCSW-tiHPOWaXpH2YrOIiruEgD_syUK74-QJxvlWlExwTeA08rW864LqdlKg/exec";

// Função genérica para enviar um formulário (encomenda ou orçamento)
async function enviarFormulario(tipo) {
  // Escolher o formulário certo
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

  // Ler todos os campos do formulário
  const formData = new FormData(form);
  const payload = { tipo }; // "encomenda" ou "orcamento"

  formData.forEach((value, key) => {
    payload[key] = value;
  });

  console.log("📤 Vou enviar para Google Apps Script:", payload);

  try {
    // Pedido "no-cors" para evitar CORS
    await fetch(GS_URL, {
      method: "POST",
      mode: "no-cors", // <- evita o erro de CORS
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // simples para evitar preflight
      },
      body: JSON.stringify(payload)
    });

    // ATENÇÃO:
    // Em 'no-cors', não conseguimos ler a resposta.
    // Mas se não deu erro aqui, o pedido foi enviado.

    console.log("✅ Pedido enviado (modo no-cors). Verifica o Google Sheets.");

    if (mensagemEl) {
      mensagemEl.textContent = "Pedido enviado com sucesso! Vai receber um email de confirmação.";
      mensagemEl.style.color = "green";
    }

    // Limpar o formulário
    form.reset();
  } catch (err) {
    console.error("❌ Erro ao enviar para o Google Apps Script:", err);
    if (mensagemEl) {
      mensagemEl.textContent = "Ocorreu um erro ao enviar. Por favor tente mais tarde.";
      mensagemEl.style.color = "red";
    }
  }
}

// Ligar os eventos quando a página carregar
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
