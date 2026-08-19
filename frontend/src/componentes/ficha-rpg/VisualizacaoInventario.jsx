import { useMemo, useState } from 'react';
import './VisualizacaoInventario.css';

const TOTAL_SLOTS = 6;

function normalizarItem(item) {
  if (!item) return null;

  return {
    ...item,
    nome: item.nome || 'Item sem nome',
    descricao: item.descricao || 'Este item ainda não possui uma descrição cadastrada.',
    bonus: item.bonus || '',
    quantidade: item.quantidade ?? 1,
  };
}

export function VisualizacaoInventario({ inventario = [], aoAlternarEquipamento }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const itemsData = useMemo(() => {
    const slots = Array.from({ length: TOTAL_SLOTS }, (_, index) => normalizarItem(inventario[index]));
    return slots;
  }, [inventario]);

  const selectedItem = selectedIndex === null ? null : itemsData[selectedIndex];

  function handleSlotClick(index) {
    const item = itemsData[index];

    if (!item) {
      setSelectedIndex(null);
      return;
    }

    setSelectedIndex((current) => (current === index ? null : index));
  }

  function handleEquipClick(event) {
    event.stopPropagation();
    if (selectedItem?.id != null && aoAlternarEquipamento) {
      aoAlternarEquipamento(selectedItem.id);
    }
  }

  return (
    <section className="visualizacao-inventario">
      <div className="inventory-container">
        <h1 className="inventory-title">🛡️ Inventário</h1>

        <div className="inventory-grid" id="inventoryGrid">
          {itemsData.map((item, index) => (
            <div
              key={item?.id ?? `empty-${index}`}
              className={`inventory-slot ${item ? 'filled' : 'empty'} ${selectedIndex === index ? 'selected' : ''}`}
              data-index={index}
              onClick={() => handleSlotClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSlotClick(index);
                }
              }}
              aria-label={item ? `Selecionar ${item.nome}` : 'Slot vazio'}
            >
              {item ? (
                <div className="item-name">
                  {item.nome}
                  {item.quantidade > 1 && <span className="item-quantity">x{item.quantidade}</span>}
                </div>
              ) : (
                <div className="empty-slot">⚔️</div>
              )}
            </div>
          ))}
        </div>

        <div className="item-detail" id="itemDetail">
          {selectedItem ? (
            <>
              <h2>{selectedItem.nome}</h2>
              {selectedItem.bonus && <strong className="item-detail__bonus">{selectedItem.bonus}</strong>}
              <p>{selectedItem.descricao}</p>
            </>
          ) : (
            <p className="empty-message">⚔️ Selecione um item para ver seus detalhes</p>
          )}
        </div>
      </div>
    </section>
  );
}

