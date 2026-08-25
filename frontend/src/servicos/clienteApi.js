const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function requisitarJson(caminho, configuracao = {}) {
  const token = localStorage.getItem('umbraeth_token');

  const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(configuracao.headers || {}),
    },
    ...configuracao,
  });

  if (!resposta.ok) {
    let detalhe = '';
    try {
      const texto = await resposta.text();
      if (texto) {
        try {
          const json = JSON.parse(texto);
          detalhe = json?.erro || json?.message || texto;
        } catch {
          detalhe = texto;
        }
      }
    } catch {
      detalhe = '';
    }

    const erro = new Error(detalhe || `Falha na requisição: ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }

  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

export function apiRealAtivada() {
  return import.meta.env.VITE_USAR_API_REAL === 'true';
}
