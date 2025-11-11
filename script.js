/*******************************
 * Serralharia AVP – Web App
 * Recebe JSON via POST (text/plain)
 * Grava na aba "Encomendas"
 *******************************/

const CONFIG = {
  SPREADSHEET_ID: '1m6k8OPpAQa-nWsJPMvojWIo2BZifOoyqYneSemwgtxc', // <-- o teu ID
  SHEET_NAME: 'Encomendas',
  TIMEZONE: 'Atlantic/Azores'
};

// normaliza textos p/ casar cabeçalhos
function norm_(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim();
}

// mapa cabeçalho -> índice
function getHeaderMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((h, i) => {
    map[norm_(h)] = i;
  });
  return { headers, map };
}

// adiciona linha usando nomes dos cabeçalhos
function appendByHeader_(sheet, payload) {
  const { headers, map } = getHeaderMap_(sheet);
  const row = new Array(headers.length).fill('');

  // renomear campos vindos do formulário para os cabeçalhos da folha
  const rename = {
    nome: 'Nome',
    nif: 'NIF',
    telefone: 'Telefone',
    email: 'Email',
    morada: 'Morada',
    metodoPagamento: 'Método Pagamento',
    item: 'Item',
    quantidade: 'Quantidade',
    valorItem: 'Valor Item'
  };

  // copiar valores recebidos para as colunas certas
  Object.keys(payload || {}).forEach(k => {
    const headerName = rename[k];
    if (!headerName) return;
    const key = norm_(headerName);
    if (key in map) {
      row[map[key]] = payload[k];
    }
  });

  // DATA (coluna "Data")
  const now = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  if ('data' in map) {
    row[map['data']] = now; // data + hora
  }

  // NÚMERO (coluna "Número") – próximo número sequencial
  if ('numero' in map) {
    const numCol = map['numero'] + 1; // índice -> coluna
    const lastRow = sheet.getLastRow();
    let nextNum = 1;
    if (lastRow >= 2) {
      const lastNum = sheet.getRange(lastRow, numCol).getValue();
      if (lastNum && !isNaN(lastNum)) {
        nextNum = Number(lastNum) + 1;
      }
    }
    row[map['numero']] = nextNum;
  }

  // TOTAL (coluna "Total") = Quantidade * Valor Item
  if ('quantidade' in map && 'valor item' in map && 'total' in map) {
    const qRaw = row[map['quantidade']] || 0;
    const vRaw = row[map['valor item']] || 0;
    const q = parseFloat(String(qRaw).replace(',', '.')) || 0;
    const v = parseFloat(String(vRaw).replace(',', '.')) || 0;
    row[map['total']] = q * v;
  }

  sheet.appendRow(row);

  return {
    ok: true,
    savedAt: now
  };
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'No body' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // estamos a enviar JSON em text/plain
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Sheet 'Encomendas' not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const result = appendByHeader_(sheet, data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
