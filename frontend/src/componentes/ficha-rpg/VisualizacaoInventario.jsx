import { useMemo, useState } from 'react';
import './VisualizacaoInventario.css';

const TOTAL_SLOTS = 6;

function normalizarItem(item) {
  if (!item) return null;

  return {
    ...item,
    id_item: item.id_item ?? item.id ?? `item-${item.nome || 'sem-id'}`,
    nome: item.nome_item || item.nome || 'Item sem nome',
    descricao:
      item.descricao_item ||
      item.descricao ||
      'Este item ainda não possui uma descrição cadastrada.',
    quantidade: item.quantidade ?? 1,
    regiao: item.nome_regiao || item.regiao || '',
    missao: item.nome_missao || item.missao || '',
    estado_item:
      item.estado_item ||
      (item.equipado ? 'Equipado' : 'Disponível'),
  };
}

export function VisualizacaoInventario({ inventario = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const origemItens = Array.isArray(inventario) ? inventario : [];

  const itemsData = useMemo(
    () =>
      Array.from(
        { length: TOTAL_SLOTS },
        (_, index) => normalizarItem(origemItens[index]),
      ),
    [origemItens],
  );

  const selectedItem =
    selectedIndex === null ? null : itemsData[selectedIndex];

  function handleSlotClick(index) {
    const item = itemsData[index];

    if (!item) {
      setSelectedIndex(null);
      return;
    }

    setSelectedIndex((current) =>
      current === index ? null : index
    );
  }

  return (
    <section className="visualizacao-inventario">
      <div className="inventory-container">
        <h1 className="inventory-title">🛡️ Inventário</h1>

        <div className="inventory-grid" id="inventoryGrid">
          {itemsData.map((item, index) => (
            <div
              key={item?.id_item ?? `empty-${index}`}
              className={`inventory-slot ${item ? 'filled' : 'empty'
                } ${selectedIndex === index ? 'selected' : ''}`}
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
              aria-label={
                item
                  ? `Selecionar ${item.nome}`
                  : 'Slot vazio'
              }
            >
              {item ? (
                <div className="item-name">
                  {item.nome}

                  {item.quantidade > 1 && (
                    <span className="item-quantity">
                      x{item.quantidade}
                    </span>
                  )}
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

              <p>{selectedItem.descricao}</p>

              {selectedItem.missao && (
                <span>
                  Missão: {selectedItem.missao}
                </span>
              )}

              {selectedItem.regiao && (
                <span>
                  Região: {selectedItem.regiao}
                </span>
              )}

              <span>
                Estado: {selectedItem.estado_item}
              </span>

              <span>
                Quantidade: {selectedItem.quantidade}
              </span>
            </>
          ) : (
            <p className="empty-message">
              {origemItens.length
                ? '⚔️ Selecione um item para ver seus detalhes'
                : '⚔️ Nenhum item foi coletado ainda.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
