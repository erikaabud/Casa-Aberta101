import { requisitarJson } from './clienteApi';

export async function obterMinhaFicha() {
  return requisitarJson('/jogo/ficha', {
    method: 'GET',
  });
}

export async function coletarItemHiro(idItem) {
  return requisitarJson('/jogo/coletar-item', {
    method: 'POST',
    body: JSON.stringify({
      id_item: idItem,
      marcador: 'hiro',
    }),
  });
}
