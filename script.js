const GS_URL = 'https://script.google.com/macros/s/AKfycbxQRrZG3ZyCSW-tiHPOWaXpH2YrOIiruEgD_syUK74-QJxvlWlExwTeA08rW864LqdlKg/exec';

async function enviar(payload) {
  // obrigatórios: tipo e os campos do formulário
  // payload.ex: { tipo:'encomenda', nome:'...', ... }

  const res = await fetch(GS_URL, {
    method: 'POST',
    // usar text/plain para ser "simple request" (não há preflight)
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload)
  });

  // Apps Script devolve JSON normal - aqui já consegues ler
  const data = await res.json();
  return data; // { ok:true, numero:..., ... }
}
