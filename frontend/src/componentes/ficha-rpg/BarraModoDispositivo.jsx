import './BarraModoDispositivo.css';

export function BarraModoDispositivo({
  modoDispositivo,
  aoAlterarModo,
  aoSincronizarBanco,
  sincronizandoBanco,
}) {
  return (
    <div className="barra-modo-dispositivo">
      <div className="barra-modo-dispositivo__titulo">
        <span>✨</span>
        <span>Painel da Ficha RPG</span>
      </div>

      <div className="barra-modo-dispositivo__acoes">
        <button type="button" className={modoDispositivo === 'auto' ? 'ativo' : ''} onClick={() => aoAlterarModo('auto')}>Automático</button>
        <button type="button" className={modoDispositivo === 'mobile' ? 'ativo' : ''} onClick={() => aoAlterarModo('mobile')}>Mobile</button>
        <button type="button" className={modoDispositivo === 'desktop' ? 'ativo' : ''} onClick={() => aoAlterarModo('desktop')}>Desktop</button>
        <button type="button" className="botao-sincronizar" onClick={aoSincronizarBanco}>{sincronizandoBanco ? 'Sincronizando...' : 'Salvar para banco'}</button>
      </div>
    </div>
  );
}
