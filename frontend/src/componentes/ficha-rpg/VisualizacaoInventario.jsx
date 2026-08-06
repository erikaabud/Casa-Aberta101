import './VisualizacaoInventario.css';

function iconeItem(icone) { if (icone === 'espada') return '⚔️'; if (icone === 'escudo') return '🛡️'; return '✨'; }
function estiloRaridade(raridade) {
  if (raridade === 'lendario') return { '--cor-raridade': '#dd6b20', '--fundo-raridade': 'rgba(221, 107, 32, 0.12)' };
  if (raridade === 'epico') return { '--cor-raridade': '#805ad5', '--fundo-raridade': 'rgba(128, 90, 213, 0.12)' };
  if (raridade === 'raro') return { '--cor-raridade': '#3182ce', '--fundo-raridade': 'rgba(49, 130, 206, 0.12)' };
  return { '--cor-raridade': '#d4af37', '--fundo-raridade': 'rgba(212, 175, 55, 0.12)' };
}

export function VisualizacaoInventario({ inventario, aoAlternarEquipamento }) {
  return (
    <section className="visualizacao-inventario">
      <h2>Inventário e Equipamentos</h2>
      <div className="visualizacao-inventario__lista">
        {inventario.map((item) => (
          <article key={item.id} className="visualizacao-inventario__card" style={estiloRaridade(item.raridade)} onClick={() => aoAlternarEquipamento(item.id)}>
            <div className="visualizacao-inventario__topo">
              <div className="visualizacao-inventario__icone">{iconeItem(item.icone)}</div>
              <div>
                <h3>{item.nome}</h3>
                <span>{item.raridade}</span>
              </div>
            </div>
            <strong>{item.bonus}</strong>
            <p>{item.descricao}</p>
            {item.equipado && <div className="visualizacao-inventario__tag">Equipado</div>}
          </article>
        ))}
      </div>
    </section>
  );
}
