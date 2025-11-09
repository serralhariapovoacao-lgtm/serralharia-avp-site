// URL da tua implementação (já está a funcionar)
const API_URL = 'https://script.google.com/macros/s/AKfycbxQRrZG3ZyCSW-tiHPOWaXpH2YrOIiruEgD_syUK74-QJxvlWlExwTeA08rW864LqdlKg/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-encomenda');
  const statusEl = document.getElementById('status');

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    statusEl.textContent = 'A enviar...';

    const dados = {
      tipo: 'encomenda',
      nome: form.nome.value,
      nif: form.nif.value,
      telefone: form.telefone.value,
      email: form.email.value,
      morada: form.morada.value,
      metodoPagamento: form.metodoPagamento.value,
      item: form.item.value,
      quantidade: Number(form.quantidade.value || 0),
      valorItem: Number(form.valorItem.value || 0)
    };

    console.log('📤 Enviar payload:', dados);

    try {
      const res = await fetch(API_URL, {
        method:
