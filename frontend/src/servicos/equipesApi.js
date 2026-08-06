import { requisitarJson } from './clienteApi';

export async function listarClasses() {
  return requisitarJson('/classes', { method: 'GET' });
}

export async function criarEquipe({ nomeEquipe, idClasse }) {
  return requisitarJson('/equipes', {
    method: 'POST',
    body: JSON.stringify({ nome_equipe: nomeEquipe, id_classe: idClasse }),
  });
}

export async function entrarNaEquipe({ codigoEquipe, idClasse }) {
  return requisitarJson('/equipes/entrar', {
    method: 'POST',
    body: JSON.stringify({ codigo: codigoEquipe, id_classe: idClasse }),
  });
}

export async function buscarMinhaEquipe() {
  return requisitarJson('/equipes/minha', { method: 'GET' });
}

