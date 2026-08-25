import { useMemo } from 'react';
import './SecaoMissoes.css';

function obterProximoItemPendente(missao) {
  if (!missao?.itens?.length) return null;

  return (
    missao.itens.find((item) => {
      const necessario = Number(item.quantidade_necessaria || 1);
      const atual = Number(item.quantidade_usuario || 0);
      return atual < necessario;
    }) || null
  );
}

function calcularPercentualMissao(missao) {
  const total = Number(missao?.total_itens || 0);
  const coletados = Number(missao?.itens_coletados_equipe || 0);

  if (!total) return 0;
  return Math.min(100, Math.round((coletados / total) * 100));
}

function formatarTipoMissao(tipo = '') {
  if (!tipo) return 'Missão';

  return tipo
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
    .join(' ');
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

  const resumo = useMemo(() => {
    const total = missoesOrdenadas.length;
    const concluidas = missoesOrdenadas.filter((missao) => Number(missao.concluida)).length;
    const emAndamento = total - concluidas;

    return { total, concluidas, emAndamento };
  }, [missoesOrdenadas]);

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
      <header className="secao-missoes__topo">
        <div className="secao-missoes__titulo-area">
          <h2>Missões ativas</h2>
          <p>Escolha uma missão para destacar o próximo item a ser coletado no marcador HIRO.</p>
        </div>

        <div className="secao-missoes__resumo">
          <div className="secao-missoes__resumo-card">
            <strong>{resumo.total}</strong>
            <span>Total</span>
          </div>
          <div className="secao-missoes__resumo-card">
            <strong>{resumo.emAndamento}</strong>
            <span>Em andamento</span>
          </div>
          <div className="secao-missoes__resumo-card">
            <strong>{resumo.concluidas}</strong>
            <span>Concluídas</span>
          </div>
        </div>
      </header>

      <div className="secao-missoes__lista">
        {missoesOrdenadas.map((missao) => {
          const selecionada = missao.id_missao === missaoSelecionadaId;
          const proximoItem = obterProximoItemPendente(missao);
          const percentual = calcularPercentualMissao(missao);
          const classesCard = [
            'secao-missoes__card',
            selecionada ? 'secao-missoes__card--selecionada' : '',
            Number(missao.concluida) ? 'secao-missoes__card--concluida' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <article
              key={missao.id_missao}
              className={classesCard}
            >
              <div className="secao-missoes__cabecalho-card">
                <div className="secao-missoes__conteudo-principal">
                  <h3>{missao.nome_missao}</h3>
                  <p>{missao.descricao_missao}</p>
                </div>

                <div className="secao-missoes__etiquetas">
                  <span className="secao-missoes__etiqueta">{formatarTipoMissao(missao.tipo_missao)}</span>
                  <span className="secao-missoes__etiqueta">{missao.concluida ? 'Concluída' : 'Em andamento'}</span>
                </div>
              </div>

              <div className="secao-missoes__progresso">
                <div className="secao-missoes__progresso-texto">
                  <span>Progresso da equipe</span>
                  <strong>{missao.itens_coletados_equipe}/{missao.total_itens}</strong>
                </div>
                <div className="secao-missoes__barra">
                  <span style={{ width: `${percentual}%` }} />
                </div>
              </div>

              <div className="secao-missoes__subtitulo">Itens da missão</div>

              <div className="secao-missoes__itens">
                {missao.itens.map((item) => {
                  const necessario = Number(item.quantidade_necessaria || 1);
                  const qtdEquipe = Number(item.quantidade_equipe || 0);
                  const qtdUsuario = Number(item.quantidade_usuario || 0);
                  const completoUsuario = qtdUsuario >= necessario;
                  const completoEquipe = qtdEquipe >= necessario;
                  const status = completoUsuario ? 'Concluído por você' : completoEquipe ? 'Equipe completou' : 'Pendente';
                  const icone = completoUsuario ? '✓' : completoEquipe ? '◐' : '○';
                  const classesItem = [
                    'secao-missoes__item',
                    completoUsuario ? 'secao-missoes__item--usuario' : '',
                    !completoUsuario && completoEquipe ? 'secao-missoes__item--equipe' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div key={item.id_item} className={classesItem}>
                      <div className="secao-missoes__item-info">
                        <span className="secao-missoes__item-icone">{icone}</span>
                        <div>
                          <strong>{item.nome_item}</strong>
                          <span>{status}</span>
                        </div>
                      </div>

                      <div className="secao-missoes__item-metricas">
                        <span>Você {Math.min(qtdUsuario, necessario)}/{necessario}</span>
                        <span>Equipe {Math.min(qtdEquipe, necessario)}/{necessario}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="secao-missoes__rodape">
                <div className="secao-missoes__alvo">
                  {proximoItem ? (
                    <>
                      <span>Próximo alvo</span>
                      <strong>{proximoItem.nome_item}</strong>
                    </>
                  ) : (
                    <>
                      <span>Status</span>
                      <strong>Todos os itens já foram coletados</strong>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="secao-missoes__concluir"
                  onClick={() => aoSelecionarMissao?.(missao.id_missao)}
                >
                  {selecionada ? 'Missão selecionada' : 'Selecionar missão'}
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
