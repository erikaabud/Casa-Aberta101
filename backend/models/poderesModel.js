const poderes = [
  {
    id: 1,
    nome: "Golpe Brutal",
    classe: "Guerreiro",
    custoMP: 20,
    usoUnico: false,
  },

  {
    id: 2,
    nome: "Bola de Fogo",
    classe: "Mago",
    custoMP: 30,
    usoUnico: false,
  },

  {
    id: 3,
    nome: "Cura Sagrada",
    classe: "Clérigo",
    custoMP: 25,
    usoUnico: false,
  },

  {
    id: 4,
    nome: "Ataque Furtivo",
    classe: "Ladino",
    custoMP: 20,
    usoUnico: false,
  },

  {
    id: 5,
    nome: "Chave de Cera",
    classe: null,
    custoMP: 0,
    usoUnico: true,
  },
];

function listarPoderes() {
  return poderes;
}

function buscarPoderPorId(id_poder) {
  return poderes.find(
    (poder) => poder.id === Number(id_poder)
  );
}

module.exports = {
  listarPoderes,
  buscarPoderPorId,
};