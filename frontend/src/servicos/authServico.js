import { requisitarJson } from './clienteApi';

const CHAVE_TOKEN = 'umbraeth_token';

export async function cadastrarUsuario({ nomeUsuario, senhaUsuario }) {
  return requisitarJson('/auth/cadastrar', {
    method: 'POST',
    body: JSON.stringify({
      nome_usuario: nomeUsuario,
      senha_usuario: senhaUsuario,
    }),
  });
}

export async function loginUsuario({ nomeUsuario, senhaUsuario }) {
  const resultado = await requisitarJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      nome_usuario: nomeUsuario,
      senha_usuario: senhaUsuario,
    }),
  });

  if (resultado?.token) {
    localStorage.setItem(CHAVE_TOKEN, resultado.token);
  }

  return resultado;
}

export function logoutUsuario() {
  localStorage.removeItem(CHAVE_TOKEN);
}

