import './VisualizacaoPoderes.css';

function iconePorClasse(classe) {
  if (classe === 'Guerreiro') return '⚔️';
  if (classe === 'Mago') return '🔥';
  if (classe === 'Clérigo') return '✨';
  if (classe === 'Ladino') return '🗡️';
  return '🔑';
}

export function VisualizacaoPoderes({
  habilidades = [],
  classePersonagem,
  mpAtual,
  chaveDeCeraUsada,
  aoUsarPoder,
}) {
  // ✅ REMOVIDO O FILTRO REDUNDANTE - as habilidades já vêm filtradas por classe
  const habilidadesNormalizadas = Array.isArray(habilidades) ? habilidades : [];

  return (
    <section className="visualizacao-poderes">
      <h2>Habilidades e Poderes</h2>
      <div className="visualizacao-poderes__lista">
        {habilidadesNormalizadas.map((habilidade) => {
          const custo = habilidade.custoMP ?? habilidade.custoMana ?? habilidade.custo ?? 0;
          const tipo = habilidade.tipo ?? 'Poder';
          const recarga = habilidade.recarga ?? (habilidade.usoUnico ? 'Uso único' : 'Sem recarga');
          const descricao = habilidade.descricao ?? `Poder da classe ${classePersonagem ?? 'aventureiro'}.`;

          return (
            <article key={habilidade.id} className="visualizacao-poderes__card">
              <div className="visualizacao-poderes__icone">{iconePorClasse(classePersonagem)}</div>
              <div className="visualizacao-poderes__conteudo">
                <div className="visualizacao-poderes__cabecalho">
                  <h3>{habilidade.nome}</h3>
                  <span>{custo} MP</span>
                </div>
                <small>Tipo: {tipo} • Recarga: {recarga}</small>
                <p>{descricao}</p>
                {aoUsarPoder && (
                  <button
                    onClick={() => aoUsarPoder(habilidade)}
                    disabled={mpAtual < custo}
                    className="visualizacao-poderes__botao"
                  >
                    Usar Poder
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}