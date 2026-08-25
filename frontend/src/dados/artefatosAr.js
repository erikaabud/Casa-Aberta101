export const ARTEFATOS_AR_POR_TERRITORIO = {
  floresta_sombria: {
    titulo: 'Semente Ancestral',
    descricao: 'Relíquia viva escondida entre as raízes antigas da floresta.',
    missaoId: 2,
    item: {
      chave: 'semente-ancestral',
      nome: 'Semente Ancestral',
      raridade: 'epico',
      descricao: 'Um núcleo botânico energizado, coletado em realidade aumentada no território da floresta.',
      bonus: '+12 de mana',
      icone: 'faísca',
      quantidade: 1,
    },
    modelo: {
      caminho: '/modelos-3d/floresta_sombria/semente-ancestral.glb',
      escala: '0.45 0.45 0.45',
      posicao: '0 0.35 0',
      rotacao: '0 0 0',
    },
    fallback: {
      primitivo: 'octahedron',
      cor: '#34d399',
      emissive: '#14532d',
      escala: '0.48 0.48 0.48',
      posicao: '0 0.35 0',
      rotacao: '0 45 0',
    },
  },
  deserto_ardente: {
    titulo: 'Coração Solar',
    descricao: 'Cristal de calor concentrado forjado nas dunas e ruínas do deserto.',
    missaoId: 4,
    item: {
      chave: 'coracao-solar',
      nome: 'Coração Solar',
      raridade: 'lendario',
      descricao: 'Cristal flamejante recuperado em realidade aumentada no deserto.',
      bonus: '+18 de ataque',
      icone: 'espada',
      quantidade: 1,
    },
    modelo: {
      caminho: '/modelos-3d/deserto_ardente/coracao-solar.glb',
      escala: '0.42 0.42 0.42',
      posicao: '0 0.4 0',
      rotacao: '0 0 0',
    },
    fallback: {
      primitivo: 'dodecahedron',
      cor: '#f59e0b',
      emissive: '#7c2d12',
      escala: '0.4 0.4 0.4',
      posicao: '0 0.4 0',
      rotacao: '0 0 0',
    },
  },
  montanhas_geladas: {
    titulo: 'Fragmento Glacial',
    descricao: 'Gema arcana preservada no coração das montanhas cobertas de neve.',
    missaoId: 5,
    item: {
      chave: 'fragmento-glacial',
      nome: 'Fragmento Glacial',
      raridade: 'raro',
      descricao: 'Fragmento congelado encontrado em realidade aumentada nas montanhas geladas.',
      bonus: '+10 de defesa',
      icone: 'escudo',
      quantidade: 1,
    },
    modelo: {
      caminho: '/modelos-3d/montanhas_geladas/fragmento-glacial.glb',
      escala: '0.5 0.5 0.5',
      posicao: '0 0.38 0',
      rotacao: '0 0 0',
    },
    fallback: {
      primitivo: 'icosahedron',
      cor: '#7dd3fc',
      emissive: '#0c4a6e',
      escala: '0.46 0.46 0.46',
      posicao: '0 0.38 0',
      rotacao: '0 0 0',
    },
  },
};

export function obterArtefatoArPorTerritorio(territorioId, missoes = []) {
  const artefatoBase = ARTEFATOS_AR_POR_TERRITORIO[territorioId];

  if (!artefatoBase) {
    return null;
  }

  const missaoVinculada =
    missoes.find((missao) => missao.id === artefatoBase.missaoId) ||
    missoes[0] ||
    null;

  return {
    ...artefatoBase,
    missaoVinculada,
  };
}
