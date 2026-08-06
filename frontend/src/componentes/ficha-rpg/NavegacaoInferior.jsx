import './NavegacaoInferior.css';
const abas = [
  { id: 'poderes', rotulo: 'Poderes', icone: '⭐' },
  { id: 'inventario', rotulo: 'Inventário', icone: '🎒' },
  { id: 'missoes', rotulo: 'Missões', icone: '📜' },
  { id: 'qrcode', rotulo: 'QR', icone: '🔳' },
];

export function NavegacaoInferior({ abaAtiva, aoSelecionarAba }) {
  return (
    <nav className="navegacao-inferior">
      {abas.map((aba) => (
        <button type="button" key={aba.id} className={abaAtiva === aba.id ? 'ativo' : ''} onClick={() => aoSelecionarAba(aba.id)}>
          <span>{aba.icone}</span>
          <small>{aba.rotulo}</small>
        </button>
      ))}
    </nav>
  );
}
