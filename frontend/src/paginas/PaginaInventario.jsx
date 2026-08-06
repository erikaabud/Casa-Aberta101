import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaInventario.css';

// Dados dos itens baseados na lore de Umbraeth
const mockItems = [
  {
    id: 1,
    name: 'Fragmento de Nex-Mortis',
    rarity: 'Lendário',
    category: 'Artefato',
    description: 'Um pedaço da árvore negra que pulsa com energia ancestral. Dizem que quem o toca pode vislumbrar o futuro.',
    collected: true,
    location: 'Trono Esquecido',
    mark: '#NEX-01'
  },
  {
    id: 2,
    name: 'Carta do Rei Vazio',
    rarity: 'Épico',
    category: 'Pista',
    description: 'Uma carta escrita com sangue de dragão. Revela os planos do Rei Vazio para mergulhar o mundo na escuridão eterna.',
    collected: true,
    location: 'Abismo Escarlate',
    mark: '#VOID-07'
  },
  {
    id: 3,
    name: 'Cinzas da Aldeia',
    rarity: 'Raro',
    category: 'Item',
    description: 'As cinzas da sua antiga casa. Um lembrete doloroso do que foi perdido para o Rei Vazio.',
    collected: true,
    location: 'Reino das Cinzas',
    mark: '#ASH-03'
  },
  {
    id: 4,
    name: 'Selo de Velkar',
    rarity: 'Épico',
    category: 'Chave',
    description: 'Um selo antigo da cidade afundada. Permite acesso aos salões proibidos onde a verdade está enterrada.',
    collected: false,
    location: 'Cidade Afundada de Velkar',
    mark: '#VEL-09'
  },
  {
    id: 5,
    name: 'Lágrima de Umbral',
    rarity: 'Lendário',
    category: 'Artefato',
    description: 'Uma gema negra que contém a essência da Noite Eterna. Dizem que pode abrir portais para outras dimensões.',
    collected: false,
    location: 'Floresta dos Sussurros',
    mark: '#UMB-05'
  },
  {
    id: 6,
    name: 'Mapa dos Deuses',
    rarity: 'Épico',
    category: 'Pista',
    description: 'Um mapa que mostra a localização dos deuses desaparecidos. Será que ainda há esperança?',
    collected: false,
    location: 'Trono Esquecido',
    mark: '#MAP-42'
  }
];

const PaginaInventario = () => {
  const navegar = useNavigate();
  const [itens, setItens] = useState(mockItems);
  const [itemSelecionado, setItemSelecionado] = useState(itens[0]);
  const [filtro, setFiltro] = useState('Todos');

  // Filtro de itens
  const itensFiltrados = filtro === 'Todos' 
    ? itens 
    : itens.filter(item => item.category === filtro);

  // Estatísticas de progresso
  const totalItens = itens.length;
  const itensColetados = itens.filter(item => item.collected).length;
  const progresso = Math.round((itensColetados / totalItens) * 100);

  // Categorias únicas para filtro
  const categorias = ['Todos', ...new Set(itens.map(item => item.category))];

  // Função para coletar item (simulação)
  const lidarComColetaItem = (itemId) => {
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, collected: !item.collected } : item
    ));
  };

  // Função para ir ao AR (simulação)
  const abrirPainelAr = () => {
    alert('🎮 Abrindo Painel AR para escanear marcadores...');
  };

  return (
    <div className="inventory-container">
      {/* ===== NAVBAR - IGUAL AO APP.CSS ===== */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            {/* <span className="logo-icon">⚔️</span> */}
            <span className="logo-text">UMBRAETH</span>
            <span className="logo-subtitle">As Crônicas</span>
          </div>
          <ul className="nav-menu">
            <li>
              <button className="nav-btn" onClick={() => navegar('/')}>
                Início
              </button>
            </li>
            <li>
              <button className="nav-btn" onClick={() => navegar('/cadastro')}>
                Cadastro
              </button>
            </li>
            <li>
              <button className="nav-btn" onClick={() => navegar('/sobre')}>
                Sobre
              </button>
            </li>
            <li>
              <button className="nav-btn nav-btn-ar" onClick={abrirPainelAr}>
                AR
              </button>
            </li>
          </ul>
          <div className="nav-toggle">☯</div>
        </div>
      </nav>

      {/* ===== HERO PROGRESS ===== */}
      <div className="inventory-hero">
        <div className="hero-content">
          <h1>
            <span className="glow-text">Inventário</span>
            <br />
            <span className="subtitle">do Portador das Cinzas</span>
          </h1>
          <div className="progress-container">
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-number">{itensColetados}</span>
                <span className="stat-label">Itens Coletados</span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <span className="stat-number">{totalItens}</span>
                <span className="stat-label">Total de Itens</span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <span className="stat-number">{progresso}%</span>
                <span className="stat-label">Progresso</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progresso}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="inventory-main">
        {/* Left: Item List */}
        <div className="item-list-panel">
          <div className="panel-header">
            <h2>📦 Evidências Coletadas</h2>
            <div className="filter-group">
              {categorias.map(categoria => (
                <button 
                  key={categoria}
                  className={`filter-btn ${filtro === categoria ? 'active' : ''}`}
                  onClick={() => setFiltro(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
          <div className="items-list">
            {itensFiltrados.map((item) => (
              <div 
                key={item.id}
                className={`item-card ${item.collected ? 'collected' : 'locked'} ${itemSelecionado?.id === item.id ? 'selected' : ''}`}
                onClick={() => setItemSelecionado(item)}
              >
                <div className="item-status-icon">
                  {item.collected ? '✅' : '🔒'}
                </div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">
                    <span className={`item-rarity ${item.rarity.toLowerCase()}`}>
                      {item.rarity}
                    </span>
                    <span className="item-category">{item.category}</span>
                  </div>
                </div>
                <div className="item-location">
                  {item.location}
                </div>
              </div>
            ))}
          </div>
          <div className="panel-footer">
            <span>⚔️ {itensFiltrados.length} itens encontrados</span>
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="detail-panel">
          {itemSelecionado ? (
            <>
              <div className="detail-header">
                <h3>🔍 Detalhes do Item</h3>
                <button 
                  className="collect-btn"
                  onClick={() => lidarComColetaItem(itemSelecionado.id)}
                >
                  {itemSelecionado.collected ? '📤 Remover' : '📥 Coletar'}
                </button>
              </div>
              <div className="detail-content">
                <div className="detail-rarity">
                  <span className={`rarity-badge ${itemSelecionado.rarity.toLowerCase()}`}>
                    {itemSelecionado.rarity}
                  </span>
                  <span className="detail-category">{itemSelecionado.category}</span>
                </div>
                <h2 className="detail-name">{itemSelecionado.name}</h2>
                <p className="detail-description">{itemSelecionado.description}</p>
                <div className="detail-meta">
                  <div className="meta-item">
                    <span className="meta-label">📍 Localização</span>
                    <span className="meta-value">{itemSelecionado.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">🔖 Marcador AR</span>
                    <span className="meta-value">{itemSelecionado.mark}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📊 Status</span>
                    <span className={`meta-value ${itemSelecionado.collected ? 'collected' : 'locked'}`}>
                      {itemSelecionado.collected ? '✅ Coletado' : '🔒 Bloqueado'}
                    </span>
                  </div>
                </div>
                {itemSelecionado.collected && (
                  <div className="detail-actions">
                    <button className="btn-primary">📖 Ler Pista Completa</button>
                    <button className="btn-secondary">🔮 Escanear AR</button>
                  </div>
                )}
                <div className="detail-lore">
                  <p className="lore-text">
                    <span className="lore-icon">📜</span>
                    "Este item guarda segredos antigos que podem mudar o destino de Umbraeth."
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="detail-empty">
              <span className="empty-icon">🗡️</span>
              <h3>Nenhum item selecionado</h3>
              <p>Escolha um item da lista para ver seus detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="inventory-footer">
        <div className="footer-content">
          <span>⚔️ As Crônicas de Umbraeth - Inventário do Herói</span>
          <div className="footer-runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>
        </div>
      </footer>
    </div>
  );
};

export default PaginaInventario;
