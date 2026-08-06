import { useState } from 'react';
import { IconeEspadaAlada } from './EmblemasMedievais';
import './ModalQr.css';

export function ModalQr({ personagem, poderTotal, aoFechar }) {
  const [copiado, setCopiado] = useState(false);

  function copiarLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="modal-qr" onClick={aoFechar}>
      <div className="modal-qr__cartao" onClick={(evento) => evento.stopPropagation()}>
        <button type="button" className="modal-qr__fechar" onClick={aoFechar}>✕</button>
        <h3>Passaporte do Personagem</h3>
        <IconeEspadaAlada tamanho={54} />

        <div className="modal-qr__caixa">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="#070b12" aria-hidden="true">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="5" y="5" width="25" height="25" fill="#070b12" />
            <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
            <rect x="13" y="13" width="9" height="9" fill="#070b12" />
            <rect x="70" y="5" width="25" height="25" fill="#070b12" />
            <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
            <rect x="78" y="13" width="9" height="9" fill="#070b12" />
            <rect x="5" y="70" width="25" height="25" fill="#070b12" />
            <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
            <rect x="13" y="78" width="9" height="9" fill="#070b12" />
            <rect x="35" y="10" width="10" height="10" fill="#070b12" />
            <rect x="50" y="5" width="5" height="15" fill="#070b12" />
            <rect x="40" y="25" width="15" height="5" fill="#070b12" />
            <rect x="10" y="35" width="20" height="5" fill="#070b12" />
            <rect x="35" y="40" width="30" height="20" fill="#070b12" />
            <rect x="45" y="45" width="10" height="10" fill="#ffffff" />
            <rect x="70" y="35" width="20" height="15" fill="#070b12" />
            <rect x="75" y="55" width="15" height="10" fill="#070b12" />
            <rect x="35" y="70" width="15" height="20" fill="#070b12" />
            <rect x="55" y="75" width="25" height="15" fill="#070b12" />
          </svg>
        </div>

        <div className="modal-qr__info">
          <h4>{personagem.nome}</h4>
          <p>{personagem.classe} • Nível {personagem.nivel}</p>
          <strong>Poder total: {poderTotal.toLocaleString('pt-BR')}</strong>
        </div>

        <div className="modal-qr__acoes">
          <button type="button" onClick={copiarLink}>{copiado ? 'Copiado!' : 'Copiar link'}</button>
          <button type="button" className="primario" onClick={copiarLink}>Compartilhar</button>
        </div>
      </div>
    </div>
  );
}
