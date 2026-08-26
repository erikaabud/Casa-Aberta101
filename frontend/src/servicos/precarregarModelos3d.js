const cacheUrls = new Set();

function normalizarUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.trim();
}

function rodarEmBackground(fn) {
  if (typeof window === 'undefined') return;

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => fn(), { timeout: 1500 });
    return;
  }

  window.setTimeout(() => fn(), 150);
}

async function precacheUrl(url) {
  const normalizada = normalizarUrl(url);
  if (!normalizada) return;
  if (cacheUrls.has(normalizada)) return;

  // Só faz sentido para arquivos 3D aqui
  const lower = normalizada.toLowerCase();
  if (!lower.endsWith('.glb') && !lower.endsWith('.gltf')) return;

  cacheUrls.add(normalizada);

  try {
    // Faz download em background para entrar no cache do navegador.
    // Obs: ler o body garante que o cache seja preenchido.
    const resposta = await fetch(normalizada, { cache: 'force-cache' });
    if (!resposta.ok) return;
    await resposta.arrayBuffer();
  } catch {
    // ignora: pre-cache é best-effort
  }
}

export function precacheModelos3d(urls = []) {
  if (typeof window === 'undefined') return;

  const lista = Array.isArray(urls) ? urls : [urls];
  const limpas = lista.map(normalizarUrl).filter(Boolean);
  if (!limpas.length) return;

  rodarEmBackground(() => {
    limpas.forEach((url) => {
      // não aguarda: deixa correr em paralelo
      precacheUrl(url);
    });
  });
}

