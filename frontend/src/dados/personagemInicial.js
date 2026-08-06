export const personagemInicial = {
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
    { id: 1, nome: 'Chuva Arcana', tipo: 'Ataque em área', custoMana: 40, recarga: '12s', icone: 'faísca', descricao: 'Lança projéteis arcanos sobre todos os inimigos próximos.' },
    { id: 2, nome: 'Escudo de Névoa', tipo: 'Defesa', custoMana: 22, recarga: '8s', icone: 'escudo', descricao: 'Cria uma barreira mágica que reduz dano e melhora a defesa.' },
    { id: 3, nome: 'Lâmina Sombria', tipo: 'Ataque rápido', custoMana: 18, recarga: '4s', icone: 'espada', descricao: 'Avança rapidamente com um golpe encantado por energia sombria.' }
  ],
  inventario: [
    { id: 1, nome: 'Espada de Velkar', raridade: 'lendario', descricao: 'Uma espada ancestral capaz de cortar a névoa eterna.', bonus: '+18 de ataque', icone: 'espada', equipado: true },
    { id: 2, nome: 'Escudo do Guardião', raridade: 'epico', descricao: 'Protege contra magia e impacto pesado.', bonus: '+12 de defesa', icone: 'escudo', equipado: false },
    { id: 3, nome: 'Essência Arcana', raridade: 'raro', descricao: 'Fragmento energético usado em rituais e feitiços.', bonus: '+40 de mana', icone: 'faísca', equipado: false }
  ],
  missoes: [
    { id: 1, titulo: 'A Travessia de Nex-Mortis', subtitulo: 'Atravesse a floresta antes do anoitecer.', descricao: 'Os guardiões perderam contato com os exploradores da floresta. Sua missão é atravessar Nex-Mortis e recuperar o mapa sagrado.', local: 'Floresta dos Sussurros', dificuldade: 'Média', recompensaExperiencia: 350, recompensaOuro: 90, concluida: false },
    { id: 2, titulo: 'As Cinzas de Umbraeth', subtitulo: 'Investigue o altar destruído no reino antigo.', descricao: 'Relíquias estão surgindo entre as ruínas. Descubra quem despertou a energia adormecida.', local: 'Reino das Cinzas', dificuldade: 'Alta', recompensaExperiencia: 520, recompensaOuro: 140, concluida: false }
  ]
};
