import { useState } from 'react';
import { IconeDiamanteMissao } from './EmblemasMedievais';
import './SecaoMissoes.css';

export function SecaoMissoes({ missoes, aoConcluirMissao }) {
  const [missaoSelecionada, setMissaoSelecionada] = useState(null);

  return (
    <section className="secao-missoes">
      <h2>Missões Ativas</h2>
      <div className="secao-missoes__lista">
        {missoes.filter((missao) => !missao.concluida).map((missao) => (
          <article key={missao.id} className="secao-missoes__card" onClick={() => setMissaoSelecionada(missao)}>
            <div className="secao-missoes__esquerda">
              <IconeDiamanteMissao tamanho={26} />
              <div>
                <h3>{missao.titulo}</h3>
                <p>{missao.subtitulo}</p>
              </div>
            </div>
            <span>›</span>
          </article>
        ))}
      </div>

      {missaoSelecionada && (
        <div className="secao-missoes__modal-fundo" onClick={() => setMissaoSelecionada(null)}>
          <div className="secao-missoes__modal" onClick={(evento) => evento.stopPropagation()}>
            <button type="button" className="secao-missoes__fechar" onClick={() => setMissaoSelecionada(null)}>✕</button>
            <h3>{missaoSelecionada.titulo}</h3>
            <small>{missaoSelecionada.local} • Dificuldade {missaoSelecionada.dificuldade}</small>
            <p>{missaoSelecionada.descricao}</p>
            <div className="secao-missoes__recompensas">
              <span>+{missaoSelecionada.recompensaExperiencia} EXP</span>
              <span>+{missaoSelecionada.recompensaOuro} ouro</span>
            </div>
            <button type="button" className="secao-missoes__concluir" onClick={() => { aoConcluirMissao(missaoSelecionada.id); setMissaoSelecionada(null); }}>Concluir missão</button>
          </div>
        </div>
      )}
    </section>
  );
}
