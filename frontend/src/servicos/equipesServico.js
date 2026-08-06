import { apiRealAtivada, requisitarJson } from './clienteApi';

const CHAVE_EQUIPES = 'umbraeth_equipes';

function criarIntegrantesPadrao() {
  return [
    { id: 1, nome: '', classe: '', isLider: true, level: 1, experiencia: 0, jogador: '', podeEditar: true },
    { id: 2, nome: '', classe: '', isLider: false, level: 1, experiencia: 0, jogador: '', podeEditar: false },
    { id: 3, nome: '', classe: '', isLider: false, level: 1, experiencia: 0, jogador: '', podeEditar: false },
    { id: 4, nome: '', classe: '', isLider: false, level: 1, experiencia: 0, jogador: '', podeEditar: false },
  ];
}

export function criarEquipePadrao(indice = 0) {
  return {
    id: indice + 1,
    nomeGrupo: indice === 0 ? '' : `Equipe ${String.fromCharCode(65 + indice)}`,
    token: '',
    tokenGerado: false,
    integrantes: criarIntegrantesPadrao(),
  };
}

export function carregarEquipes() {
  const conteudoSalvo = localStorage.getItem(CHAVE_EQUIPES);
  if (!conteudoSalvo) return [criarEquipePadrao()];
  try {
    const equipes = JSON.parse(conteudoSalvo);
    return Array.isArray(equipes) && equipes.length ? equipes : [criarEquipePadrao()];
  } catch {
    return [criarEquipePadrao()];
  }
}

export function gerarTokenEquipe() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let indice = 0; indice < 8; indice += 1) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    if (indice === 3) token += '-';
  }
  return token;
}

export function persistirEquipes(equipes) {
  localStorage.setItem(CHAVE_EQUIPES, JSON.stringify(equipes));
  if (apiRealAtivada()) {
    requisitarJson('/equipes/sincronizar', {
      method: 'POST',
      body: JSON.stringify({ equipes }),
    }).catch(() => {});
  }
  return equipes;
}

export function buscarEquipePorToken(token, equipes = carregarEquipes()) {
  return equipes.find((equipe) => equipe.token === token) || null;
}
