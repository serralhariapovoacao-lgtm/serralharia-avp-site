// URL da implementação Web App do Google Apps Script
const GS_URL = 'https://script.google.com/macros/s/AKfycbz-wpl2m8qXwGsdDG8XPh5KX7Mfq5sjtRFN0jsvsGRorDD7qF3J1soo3EFdUga832_UYg/exec';

// Função que envia o formulário para o Google Sheets
async function enviarPedido(e) {
  e.preventDefault(); // não recarregar a página

  const form = e.target;

  // Lê os campos do formulário
  const payload = {
    tipo: 'encomenda', // o Apps Script usa isto para saber que é encomenda
    nome: form.nome.value.trim(),
    nif: form.nif.value.trim(),
    telefone: form.telefone.value.trim(),
    email: form.email.value.trim(),
    morada: form.morada.value.trim(),
    metodoPagamento: form.metodoPagamento.value,
    item: form.item.value.trim(),
    quantidade: Number(form.quantidade.value || 1),
    valorItem: Number(form.valorItem.value || 0)
  };

  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = 'A enviar pedido...';
    statusEl.style.color = '#333';
  }

  try {
    console.log('A enviar payload (no-cors):', payload);

    // IMPORTANTE: no-cors e sem cabeçalhos estranhos
    await fetch(GS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    // Aqui não conseguimos ler a resposta, mas o pedido foi enviado
    if (statusEl) {
      statusEl.textContent = 'Encomenda enviada com sucesso! Em breve receberá confirmação por email.';
      statusEl.style.color = 'green';
    }

    form.reset();

  } catch (err) {
    console.error('Erro ao enviar:', err);
    if (statusEl) {
      statusEl.textContent = 'Erro de ligação ao servidor. Tente novamente mais tarde.';
      statusEl.style.color = 'red';
    }
  }
}

// Quando a página carregar, ligamos o listener ao formulário
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'); // só tens um formulário
  if (!form) {
    console.error('Formulário não encontrado na página.');
    return;
  }
  form.addEventListener('submit', enviarPedido);
});
