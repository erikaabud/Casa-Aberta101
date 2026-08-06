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
      {definicoes.map((item) => {
        const valor = item.valorAtual ? `${atributos[item.valorAtual].toLocaleString('pt-BR')} / ${atributos[item.chave].toLocaleString('pt-BR')}` : atributos[item.chave].toLocaleString('pt-BR');
        return (
          <div key={item.chave} className={`grade-atributos__card ${item.classe}`}>
            <div className="grade-atributos__icone">{item.icone}</div>
            <div className="grade-atributos__texto">
              <span className="grade-atributos__titulo">{item.titulo}</span>
              <strong>{valor}</strong>
            </div>
            <div className="grade-atributos__acoes">
              <button type="button" onClick={() => aoAtualizarAtributo(item.chave, item.passo)}>+</button>
              <button type="button" onClick={() => aoAtualizarAtributo(item.chave, -item.passo)}>-</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
