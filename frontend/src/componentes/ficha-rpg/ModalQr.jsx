import { LeitorQr } from './LeitorQr';
import './ModalQr.css';

export function ModalQr({ regiao, missao, item, aoFechar, aoColetar }) {
  return (
    <div className="modal-qr" onClick={aoFechar}>
      <div className="modal-qr__cartao" onClick={(evento) => evento.stopPropagation()}>
        <button type="button" className="modal-qr__fechar" onClick={aoFechar}>✕</button>
        <div className="modal-qr__barra">
          <h3>Leitor do marcador HIRO</h3>
          <div className="modal-qr__info">
            <h4>{regiao?.nome_regiao || 'Região não selecionada'}</h4>
            <p>{missao?.nome_missao || 'Selecione uma missão para coletar os itens.'}</p>
            <strong>{item?.nome_item || 'Nenhum item pendente nesta missão.'}</strong>
          </div>
        </div>

        <div className="modal-qr__conteudo">
          <LeitorQr
            regiao={regiao}
            missao={missao}
            item={item}
            aoColetar={aoColetar}
            aoEncerrar={aoFechar}
            modo="modal"
          />
        </div>
      </div>
    </div>
  );
}
