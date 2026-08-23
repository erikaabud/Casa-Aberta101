import { requisitarJson } from './clienteApi';

export async function listarPoderes() {
  return requisitarJson('/poderes', {
    method: 'GET',
  });
}

export async function buscarEstadoPoderes() {
  return requisitarJson('/poderes/estado', {
    method: 'GET',
  });
}

export async function usarPoder(idPoder) {
  return requisitarJson('/poderes/usar', {
    method: 'POST',
    body: JSON.stringify({
      id_poder: idPoder,
    }),
  });
}