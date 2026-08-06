import './VisualizacaoPoderes.css';

function iconePorTipo(icone) {
  if (icone === 'espada') return '⚔️';
  if (icone === 'escudo') return '🛡️';
  return '✨';
}

export function VisualizacaoPoderes({ habilidades }) {
  return (
    <section className="visualizacao-poderes">
      <h2>Habilidades e Poderes</h2>
      <div className="visualizacao-poderes__lista">
        {habilidades.map((habilidade) => (
          <article key={habilidade.id} className="visualizacao-poderes__card">
            <div className="visualizacao-poderes__icone">{iconePorTipo(habilidade.icone)}</div>
            <div className="visualizacao-poderes__conteudo">
              <div className="visualizacao-poderes__cabecalho">
                <h3>{habilidade.nome}</h3>
                <span>{habilidade.custoMana} MP</span>
              </div>
              <small>Tipo: {habilidade.tipo} • Recarga: {habilidade.recarga}</small>
              <p>{habilidade.descricao}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
