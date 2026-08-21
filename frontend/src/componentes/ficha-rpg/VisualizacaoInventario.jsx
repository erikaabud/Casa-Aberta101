import { useEffect, useState } from 'react';
import { requisitarJson } from '../../servicos/clienteApi';
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
    estado_item:
      item.estado_item ||
      (item.equipado ? 'Equipado' : 'Disponível'),
  };
}

export function VisualizacaoInventario({ inventario = [] }) {
  const [itens, setItens] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (Array.isArray(inventario) && inventario.length > 0) {
      return undefined;
    }

    async function carregarInventario() {
      try {
        const resposta = await requisitarJson('/itens/minha-equipe');

        setItens(resposta.itens || []);
      } catch (erro) {
        console.error('Erro ao carregar inventário:', erro);
      }
    }

    carregarInventario();
  }, [inventario]);

  const origemItens =
    Array.isArray(inventario) && inventario.length > 0 ? inventario : itens;

  const itemsData = Array.from(
    { length: TOTAL_SLOTS },
    (_, index) => normalizarItem(origemItens[index])
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

              <span>
                Estado: {selectedItem.estado_item}
              </span>

              <span>
                Quantidade: {selectedItem.quantidade}
              </span>
            </>
          ) : (
            <p className="empty-message">
              ⚔️ Selecione um item para ver seus detalhes
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
