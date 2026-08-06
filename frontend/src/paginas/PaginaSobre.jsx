import { useNavigate } from 'react-router-dom';
import './PaginaSobre.css';

const PaginaSobre = () => {
  const navegar = useNavigate();

  const regions = [
    { name: 'Reino das Cinzas', icon: '🏚️', desc: 'Terra devastada pelo Rei Vazio' },
    { name: 'Floresta dos Sussurros', icon: '🌲', desc: 'Onde os espíritos falam' },
    { name: 'Cidade Afundada de Velkar', icon: '🌊', desc: 'Segredos sob as águas' },
    { name: 'Abismo Escarlate', icon: '🔴', desc: 'Sangue e ruína' },
    { name: 'Trono Esquecido', icon: '👑', desc: 'Onde tudo começou' },
  ];

  const characters = [
    { name: 'Portador das Cinzas', role: 'Protagonista', desc: 'Único sobrevivente da aldeia destruída' },
    { name: 'Rei Vazio', role: 'Vilão', desc: 'Antigo deus da esperança que deseja a escuridão eterna' },
    { name: 'Guardiões da Nex-Mortis', role: 'Aliados', desc: 'Protetores da árvore negra' },
  ];

  return (
    <div className="about-container">
      {/* ===== NAVBAR - IGUAL AO APP.CSS ===== */}
      <nav className="about-nav">
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
              <button className="nav-btn" onClick={() => navegar('/equipe')}>
                Equipe
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>
            <span className="glow-text">As Crônicas</span>
            <br />
            de Umbraeth
          </h1>
          <div className="hero-badge">✦ UMA HISTÓRIA DARK FANTASY ✦</div>
          <p className="hero-text">
            Há mil anos, o mundo de Umbraeth foi consumido pela <span className="highlight">Noite Eterna</span>.
            Reis enlouqueceram, deuses desapareceram e monstros passaram a caminhar livremente entre os homens.
          </p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="about-main">
        {/* Lore Section */}
        <div className="lore-section">
          <div className="lore-card">
            <h2>📜 A Profecia</h2>
            <p>
              No centro do continente ergue-se a árvore negra <span className="highlight">Nex-Mortis</span>,
              cujo coração guarda o último fragmento da luz. Diz a lenda que quando as estrelas se alinharem,
              o <span className="danger">Rei Vazio</span> despertará e a escuridão consumirá tudo.
            </p>
            <p className="quote">
              "Nas sombras do esquecimento, uma era de trevas desperta. O destino do reino está em suas mãos, herói."
            </p>
          </div>

          <div className="lore-card">
            <h2>⚔️ O Portador das Cinzas</h2>
            <p>
              O jogador assume o papel do <span className="highlight">Portador das Cinzas</span>,
              único sobrevivente de uma aldeia destruída pelo Rei Vazio.
              Uma estranha marca luminosa em seu peito pode decidir o destino do mundo.
            </p>
            <div className="character-grid">
              {characters.map(char => (
                <div key={char.name} className="character-card">
                  <div className="char-icon">{char.role === 'Vilão' ? '👹' : '🛡️'}</div>
                  <div className="char-info">
                    <h4>{char.name}</h4>
                    <span className="char-role">{char.role}</span>
                    <p>{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regions Section */}
        <div className="regions-section">
          <h2>🌍 Regiões de Umbraeth</h2>
          <div className="regions-grid">
            {regions.map(region => (
              <div key={region.name} className="region-card">
                <div className="region-icon">{region.icon}</div>
                <h3>{region.name}</h3>
                <p>{region.desc}</p>
                <div className="region-rune">ᚱ</div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="game-info-section">
          <div className="info-card">
            <h2>🎮 Sobre o Jogo</h2>
            <p>
              Este é um jogo <strong>Live Action com Realidade Aumentada</strong>,
              desenvolvido para transformar a exploração do espaço real em uma dinâmica
              de missão guiada por itens, pistas e leitura visual de marcadores.
            </p>
            <div className="info-features">
              <div className="feature-item">
                <span>🔮</span>
                <span>Realidade Aumentada</span>
              </div>
              <div className="feature-item">
                <span>📦</span>
                <span>Inventário de Itens</span>
              </div>
              <div className="feature-item">
                <span>⚔️</span>
                <span>Missões e Pistas</span>
              </div>
              <div className="feature-item">
                <span>🏰</span>
                <span>Exploração Física</span>
              </div>
            </div>
          </div>

          <div className="info-card tech-card">
            <h2>⚙️ Tecnologia</h2>
            <div className="tech-items">
              <span>React</span>
              <span>AR.js</span>
              <span>Three.js</span>
              <span>WebGL</span>
            </div>
            <p className="tech-version">
              <span className="version-badge">v0.1.0</span>
              <span>Modo Operação Tática</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <button className="btn-primary" onClick={() => navegar('/cadastro')}>
            ⚔️ Iniciar Jornada
          </button>
          <button className="btn-secondary" onClick={() => navegar('/inventario')}>
            📦 Ver Inventário
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span>⚔️ UMBRAETH</span>
            <span className="footer-sub">As Crônicas</span>
          </div>
          <div className="footer-copy">
            <p>© 2024 - As Crônicas de Umbraeth - Todos os direitos reservados</p>
            <div className="footer-runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaginaSobre;
