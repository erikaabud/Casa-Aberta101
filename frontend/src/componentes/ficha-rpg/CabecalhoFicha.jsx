import { IconeEscudoPaladino } from './EmblemasMedievais';
import './CabecalhoFicha.css';

export function CabecalhoFicha({ nome, classePersonagem, equipe, membros = [] }) {
  return (
    <header className="cabecalho-ficha">
      <div className="cabecalho-ficha__grupo">
        <div className="cabecalho-ficha__linha-nome">
          <div className="cabecalho-ficha__nome" title={nome}>{nome}</div>
        </div>

        <div className="cabecalho-ficha__classe-area">
          <div className="cabecalho-ficha__classe">
            <IconeEscudoPaladino tamanho={18} />
            <span>{classePersonagem}</span>
          </div>
        </div>

        <div className="cabecalho-ficha__classe-area">
          <div className="cabecalho-ficha__classe">
            <span>Equipe</span>
            <strong>{equipe?.nome_equipe || 'Sem equipe'}</strong>
          </div>
        </div>

        {equipe?.codigo && (
          <div className="cabecalho-ficha__classe-area">
            <div className="cabecalho-ficha__classe">
              <span>Token</span>
              <strong>{equipe.codigo}</strong>
            </div>
          </div>
        )}

        <div className="cabecalho-ficha__classe-area">
          <div className="cabecalho-ficha__classe">
            <span>Membros</span>
            <strong>{membros.length}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
