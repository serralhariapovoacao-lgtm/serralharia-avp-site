// URL da implementação Web App do Google Apps Script
const GS_URL = 'https://script.google.com/macros/s/AKfycbxQRrZG3ZyCSW-tiHPOWaXpH2YrOIiruEgD_syUK74-QJxvlWlExwTeA08rW864LqdlKg/exec';

// Função que envia o formulário para o Google Sheets
async function enviarPedido(e) {
  e.preventDefault(); // não recarregar a página

  const form = e.target;

  // Lê os campos do formulário
  const payload = {
    tipo: 'encomenda', // importante: o Apps Script usa isto para saber que é encomenda
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

  // Mensagem de estado (precisas de ter <p id="status"></p> no HTML)
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = 'A enviar pedido...';
    statusEl.style.color = '#333';
  }

  try {
    console.log('A enviar payload:', payload);

    const res = await fetch(GS_URL, {
      method: 'POST',
      // text/plain para evitar CORS / preflight
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload)
    });

    console.log('Resposta HTTP:', res.status, res.statusText);

    // tentar ler o JSON devolvido pelo Apps Script
    const data = await res.json().catch(() => null);
    console.log('JSON recebido:', data);

    if (!res.ok || !data || data.ok !== true) {
      throw new Error(data && data.error ? data.error : 'Erro ao guardar na folha');
    }

    // Sucesso
    if (statusEl) {
      statusEl.textContent = `Encomenda enviada com sucesso! Número: ${data.numero}`;
      statusEl.style.color = 'green';
    }

    form.reset();

  } catch (err) {
    console.error('Erro ao enviar:', err);
    if (statusEl) {
      statusEl.textContent = 'Erro ao enviar pedido. Tenta novamente dentro de alguns minutos.';
      statusEl.style.color = 'red';
    }
  }
}

// Quando a página carregar, ligamos o listener ao formulário
document.addEventListener('DOMContentLoaded', () => {
  // como só tens um formulário na página, é seguro usar querySelector('form')
  const form = document.querySelector('form');
  if (!form) {
    console.error('Formulário não encontrado na página.');
    return;
  }
  form.addEventListener('submit', enviarPedido);
});
