import { useMemo } from 'react';
import './SecaoMissoes.css';

function obterProximoItemPendente(missao) {
  return missao?.itens?.find((item) => !item.coletado_por_usuario) || null;
}

export function SecaoMissoes({
  missoes = [],
  missaoSelecionadaId,
  aoSelecionarMissao,
}) {
  const missoesOrdenadas = useMemo(
    () => [...missoes].sort((a, b) => Number(a.concluida) - Number(b.concluida) || a.id_missao - b.id_missao),
    [missoes],
  );

  if (!missoesOrdenadas.length) {
    return (
      <section className="secao-missoes">
        <h2>Missões ativas</h2>
        <div className="secao-missoes__lista">
          <article className="secao-missoes__card">
            <div className="secao-missoes__esquerda">
              <div>
                <h3>Nenhuma missão cadastrada</h3>
                <p>Cadastre missões no banco para começar a coleta dos itens.</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="secao-missoes">
      <h2>Missões ativas</h2>

      <div className="secao-missoes__lista">
        {missoesOrdenadas.map((missao) => {
          const selecionada = missao.id_missao === missaoSelecionadaId;
          const proximoItem = obterProximoItemPendente(missao);

          return (
            <article
              key={missao.id_missao}
              className="secao-missoes__card"
              style={{
                borderColor: selecionada ? 'rgba(212, 175, 55, 0.45)' : undefined,
                boxShadow: selecionada ? '0 0 0 1px rgba(212, 175, 55, 0.25)' : undefined,
              }}
            >
              <div className="secao-missoes__esquerda">
                <div>
                  <h3>{missao.nome_missao}</h3>
                  <p>{missao.descricao_missao}</p>
                </div>
              </div>

              <div className="secao-missoes__recompensas">
                <span>{missao.tipo_missao}</span>
                <span>{missao.itens_coletados_equipe}/{missao.total_itens} itens</span>
                <span>{missao.concluida ? 'Concluída' : 'Em andamento'}</span>
              </div>

              <div className="secao-missoes__recompensas">
                {missao.itens.map((item) => (
                  <span key={item.id_item}>
                    {item.coletado_por_usuario ? '✅' : item.coletado_pela_equipe ? '🟡' : '⬜'} {item.nome_item}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="secao-missoes__concluir"
                onClick={() => aoSelecionarMissao?.(missao.id_missao)}
              >
                {selecionada
                  ? proximoItem
                    ? `Item alvo: ${proximoItem.nome_item}`
                    : 'Missão pronta para revisão'
                  : 'Selecionar missão'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
