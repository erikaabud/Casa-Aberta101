import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaVitoria.css';

export function TelaVitoria({
  totalMissoes = 0,
  nomeEquipe = '',
}) {
  const [etapa, setEtapa] = useState('explosao');
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setEtapa('titulo'), 450);
    const t2 = setTimeout(() => setEtapa('detalhes'), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const voltarEquipe = () => navigate('/equipe');
  const voltarInicio = () => navigate('/');

  return (
    <div className="tela-vitoria" role="dialog" aria-modal="true" aria-label="Jogo concluido">
      <div className="tela-vitoria__fundo" />

      <div className={`tela-vitoria__explosao ${etapa !== 'explosao' ? 'tela-vitoria__explosao--expandida' : ''}`}>
        <span className="tela-vitoria__anel tela-vitoria__anel--1" />
        <span className="tela-vitoria__anel tela-vitoria__anel--2" />
        <span className="tela-vitoria__anel tela-vitoria__anel--3" />
        <span className="tela-vitoria__flash" />
      </div>

      {(etapa === 'titulo' || etapa === 'detalhes') && (
        <div className="tela-vitoria__conteudo">
          <h1 className="tela-vitoria__titulo">Vitória!</h1>

          {etapa === 'detalhes' && (
            <div className="tela-vitoria__detalhes">
              {nomeEquipe && <p className="tela-vitoria__equipe">Parabéns, {nomeEquipe}!</p>}
              <p className="tela-vitoria__resumo">
                Todas as missões foram concluídas ({totalMissoes}{' '}
                {totalMissoes === 1 ? 'missão' : 'missões'} no total).
              </p>

              <div className="tela-vitoria__botoes">
                <button
                  type="button"
                  className="tela-vitoria__botao tela-vitoria__botao--reiniciar"
                  onClick={voltarEquipe}
                >
                   Voltar para a Equipe
                </button>

                <button
                  type="button"
                  className="tela-vitoria__botao tela-vitoria__botao--inicio"
                  onClick={voltarInicio}
                >
                   Voltar ao Início
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
