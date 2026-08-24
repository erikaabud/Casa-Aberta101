// src/servicos/personagemServico.js

import { apiRealAtivada, requisitarJson } from './clienteApi';
import { personagemInicial } from '../dados/personagemInicial';

const CHAVE_PERSONAGEM = 'umbraeth_personagem';
const CHAVE_CLASSE_ESCOLHIDA = 'umbraeth_classe_escolhida';

// ============ CLASSE ESCOLHIDA ============

export function carregarClasseEscolhida() {
  return localStorage.getItem(CHAVE_CLASSE_ESCOLHIDA);
}

export function salvarClasseEscolhida(classe) {
  localStorage.setItem(CHAVE_CLASSE_ESCOLHIDA, classe);
  return classe;
}

export function removerClasseEscolhida() {
  localStorage.removeItem(CHAVE_CLASSE_ESCOLHIDA);
}

// ============ PERSONAGEM ============

export function carregarPersonagem() {
  const conteudoSalvo = localStorage.getItem(CHAVE_PERSONAGEM);
  
  if (conteudoSalvo) {
    try {
      const dados = JSON.parse(conteudoSalvo);
      if (dados?.atributos && Array.isArray(dados?.inventario)) {
        return dados;
      }
    } catch (error) {
      // Erro ao parsear personagem do localStorage
    }
  }

  // Fallback inteligente: usa a classe escolhida, se existir
  const classeEscolhida = carregarClasseEscolhida();
  const personagemFallback = personagemInicial[classeEscolhida] || personagemInicial.Guerreiro;
  return personagemFallback;
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