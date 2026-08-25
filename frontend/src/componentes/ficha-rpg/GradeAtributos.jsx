import './GradeAtributos.css';

const definicoes = [
  { chave: 'vidaMaxima', titulo: 'Vida', valorAtual: 'vidaAtual', icone: '❤️', classe: 'vida', passo: 50 },
  { chave: 'manaMaxima', titulo: 'Mana', valorAtual: 'manaAtual', icone: '🔷', classe: 'mana', passo: 25 },
  { chave: 'forca', titulo: 'Força', icone: '⚔️', classe: 'forca', passo: 2 },
  { chave: 'defesa', titulo: 'Defesa', icone: '🛡️', classe: 'defesa', passo: 2 },
];

export function GradeAtributos({ atributos, aoAtualizarAtributo }) {
  return (
    <div className="grade-atributos">
      
    </div>
  );
}
