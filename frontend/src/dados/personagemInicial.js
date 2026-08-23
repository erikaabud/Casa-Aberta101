export const personagemInicial = {
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
      { 
        id: 1, 
        nome: 'Golpe da Espada Selada', 
        tipo: 'Ataque Pesado', 
        custoMana: 20, 
        recarga: '12s', 
        icone: 'espada', 
        descricao: 'Um golpe poderoso com a espada sagrada.' 
      },
      { 
        id: 2, 
        nome: 'Postura Defensiva', 
        tipo: 'Defesa', 
        custoMana: 15, 
        recarga: '8s', 
        icone: 'escudo', 
        descricao: 'Aumenta a defesa e reduz dano recebido.' 
      }
    ],
    inventario: [],
    missoes: []
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
      { 
        id: 1, 
        nome: 'Desarmar Armadilha', 
        tipo: 'Utilitário', 
        custoMana: 10, 
        recarga: '15s', 
        icone: 'chave', 
        descricao: 'Remove armadilhas da arena e abre caminhos.' 
      },
      { 
        id: 2, 
        nome: 'Chave de Cera', 
        tipo: 'Ataque', 
        custoMana: 18, 
        recarga: 'Uso único', 
        icone: 'vela', 
        descricao: 'Molda uma chave improvisada com cera para forçar uma passagem. Só pode ser usada uma vez.' 
      }
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
      { 
        id: 1, 
        nome: 'Chuva Arcana', 
        tipo: 'Ataque em área', 
        custoMana: 40, 
        recarga: '12s', 
        icone: 'faísca', 
        descricao: 'Lança projéteis arcanos sobre todos os inimigos próximos.' 
      },
      { 
        id: 2, 
        nome: 'Escudo de Névoa', 
        tipo: 'Defesa', 
        custoMana: 22, 
        recarga: '8s', 
        icone: 'escudo', 
        descricao: 'Cria uma barreira mágica que reduz dano e melhora a defesa.' 
      },
      { 
        id: 3, 
        nome: 'Lâmina Sombria', 
        tipo: 'Ataque rápido', 
        custoMana: 18, 
        recarga: '4s', 
        icone: 'espada', 
        descricao: 'Avança rapidamente com um golpe encantado por energia sombria.' 
      }
    ],
    inventario: [
      { 
        id: 1, 
        nome: 'Espada de Velkar', 
        raridade: 'lendario', 
        descricao: 'Uma espada ancestral capaz de cortar a névoa eterna.', 
        bonus: '+18 de ataque', 
        icone: 'espada', 
        equipado: true 
      },
      { 
        id: 2, 
        nome: 'Escudo do Guardião', 
        raridade: 'epico', 
        descricao: 'Protege contra magia e impacto pesado.', 
        bonus: '+12 de defesa', 
        icone: 'escudo', 
        equipado: false 
      },
      { 
        id: 3, 
        nome: 'Essência Arcana', 
        raridade: 'raro', 
        descricao: 'Fragmento energético usado em rituais e feitiços.', 
        bonus: '+40 de mana', 
        icone: 'faísca', 
        equipado: false 
      }
    ],
    missoes: [
      { 
        id: 1, 
        titulo: 'A Travessia de Nex-Mortis', 
        subtitulo: 'Atravesse a floresta antes do anoitecer.', 
        descricao: 'Os guardiões perderam contato com os exploradores da floresta. Sua missão é atravessar Nex-Mortis e recuperar o mapa sagrado.', 
        local: 'Floresta dos Sussurros', 
        dificuldade: 'Média', 
        recompensaExperiencia: 350, 
        recompensaOuro: 90, 
        concluida: false 
      },
      { 
        id: 2, 
        titulo: 'As Cinzas de Umbraeth', 
        subtitulo: 'Investigue o altar destruído no reino antigo.', 
        descricao: 'Relíquias estão surgindo entre as ruínas. Descubra quem despertou a energia adormecida.', 
        local: 'Reino das Cinzas', 
        dificuldade: 'Alta', 
        recompensaExperiencia: 520, 
        recompensaOuro: 140, 
        concluida: false 
      }
    ]
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
      { 
        id: 1, 
        nome: 'Oração de Proteção', 
        tipo: 'Suporte', 
        custoMana: 20, 
        recarga: '12s', 
        icone: 'escudo', 
        descricao: 'Cria uma barreira que protege aliados.' 
      },
      { 
        id: 2, 
        nome: 'Cura Divina', 
        tipo: 'Suporte', 
        custoMana: 30, 
        recarga: '15s', 
        icone: 'cruz', 
        descricao: 'Restaura a vida de um aliado.' 
      }
    ],
    inventario: [],
    missoes: []
  }
};