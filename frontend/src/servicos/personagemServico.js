import { apiRealAtivada, requisitarJson } from './clienteApi';
import { personagemInicial } from '../dados/personagemInicial';

const CHAVE_PERSONAGEM = 'umbraeth_personagem';

export function carregarPersonagem() {
  const conteudoSalvo = localStorage.getItem(CHAVE_PERSONAGEM);
  if (!conteudoSalvo) return personagemInicial;
  try {
    return JSON.parse(conteudoSalvo);
  } catch {
    return personagemInicial;
  }
}

export function salvarPersonagem(personagem) {
  localStorage.setItem(CHAVE_PERSONAGEM, JSON.stringify(personagem));
  return personagem;
}

export async function sincronizarPersonagem(personagem) {
  salvarPersonagem(personagem);
  if (!apiRealAtivada()) {
    return {
      modo: 'local',
      mensagem: 'Dados salvos localmente. Defina VITE_USAR_API_REAL=true para enviar ao backend futuramente.',
    };
  }
  await requisitarJson('/personagens/sincronizar', {
    method: 'POST',
    body: JSON.stringify({ personagem }),
  });
  return { modo: 'api', mensagem: 'Personagem sincronizado com a API.' };
}
