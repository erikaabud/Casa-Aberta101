// Definimos as classes como um dicionário (objeto), com todas no mesmo nível
export const personagensPreDefinidos = {
  Guerreiro: {
    nome: 'Tharion Ironfist',
    classe: 'Guerreiro',
    nivel: 1,
    experienciaAtual: 0,
    experienciaMaxima: 1000,
    ouro: 200,
    atributos: {
      forca: 25,
      defesa: 20,
      vidaMaxima: 500,
      vidaAtual: 500,
      manaMaxima: 120,
      manaAtual: 120,
    },
    habilidades: [
      { id: 1, nome: 'Golpe da Espada Selada', tipo: 'Ataque Pesado', custoMana: 20, recarga: '12s', icone: 'espada', descricao: 'Um golpe poderoso com a espada sagrada.' },
      { id: 2, nome: 'Postura Defensiva', tipo: 'Defesa', custoMana: 15, recarga: '8s', icone: 'escudo', descricao: 'Aumenta a defesa e reduz dano recebido.' }
    ],
    inventario: [ ],
    missoes: [ ]
     
  },

  Ladino: {
    nome: 'Sylas Nightblade',
    classe: 'Ladino',
    nivel: 1,
    experienciaAtual: 0,
    experienciaMaxima: 1000,
    ouro: 250,
    atributos: {
      forca: 15,
      defesa: 12,
      vidaMaxima: 350,
      vidaAtual: 350,
      manaMaxima: 200,
      manaAtual: 200,
    },
    habilidades: [
      { id: 1, nome: 'Desarmar Armadilha', tipo: 'Utilitário', custoMana: 10, recarga: '15s', icone: 'chave', descricao: 'Remove armadilhas da arena e abre caminhos.' },
      { id: 2, nome: 'Chave de Cera', tipo: 'Ataque', custoMana: 18, recarga: 'Uso único', icone: 'vela', descricao: 'Molda uma chave improvisada com cera para forçar uma passagem. Só pode ser usada uma vez.' }
    ],
    inventario: [],
    missoes: []
  },

  Mago: {
    nome: 'Aria Shadowvale',
    classe: 'Mago',
    nivel: 5,
    experienciaAtual: 2500,
    experienciaMaxima: 5000,
    ouro: 850,
    atributos: {
      forca: 18,
      defesa: 22,
      vidaMaxima: 420,
      vidaAtual: 420,
      manaMaxima: 650,
      manaAtual: 650,
    },
    habilidades: [
      { id: 1, nome: 'Feitiço de Purificação', tipo: 'Magia', custoMana: 25, recarga: '10s', icone: 'faísca', descricao: 'Enfraquece a corrupção do inimigo.' },
      { id: 2, nome: 'Alquimia Arcana', tipo: 'Suporte', custoMana: 15, recarga: '20s', icone: 'escudo', descricao: 'Resolve enigmas alquímicos para liberar joias.' },
      { id: 3, nome: 'Bomba Alquímica', tipo: 'Ataque Especial', custoMana: 50, recarga: '30s', icone: 'espada', descricao: 'Explosivo mágico que causa alto dano e interrompe ataques.' }
    ],
    inventario: [],
    missoes: []
  },

  Clérigo: {
    nome: 'Elandra Dawnlight',
    classe: 'Clérigo',
    nivel: 1,
    experienciaAtual: 0,
    experienciaMaxima: 1000,
    ouro: 300,
    atributos: {
      forca: 12,
      defesa: 18,
      vidaMaxima: 400,
      vidaAtual: 400,
      manaMaxima: 500,
      manaAtual: 500,
    },
    habilidades: [
      { id: 1, nome: 'Oração de Proteção', tipo: 'Suporte', custoMana: 20, recarga: '12s', icone: 'escudo', descricao: 'Cria uma barreira que protege aliados.' },
      { id: 2, nome: 'Cura Divina', tipo: 'Suporte', custoMana: 30, recarga: '15s', icone: 'cruz', descricao: 'Restaura a vida de um aliado.' }
    ],
    inventario: [],
    missoes: []
  }
};