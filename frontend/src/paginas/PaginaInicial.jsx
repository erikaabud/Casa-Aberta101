import { Link, useNavigate } from 'react-router-dom';
import './PaginaInicial.css';
import { useAuth } from '../contextos/AuthContext';

export default function PaginaInicial() {
  const navegar = useNavigate();
  const { estaLogado, estaEmEquipe, usuario, sair } = useAuth();

  // Função para ler o conteúdo da página em voz alta
  const lerConteudo = () => {
    // Verifica se o navegador suporta a API de síntese de fala
    if ('speechSynthesis' in window) {
      // Cancela qualquer fala em andamento
      window.speechSynthesis.cancel();

      // Seleciona o conteúdo principal da página
      const conteudo = document.querySelector('.heroi') || document.body;
      const texto = conteudo.textContent || '';
      
      // Cria uma nova instância de fala
      const utterance = new SpeechSynthesisUtterance(texto);
      
      // Configurações de leitura
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; // Velocidade de leitura
      utterance.pitch = 1; // Tom de voz
      
      // Fala o conteúdo
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não suporta a funcionalidade de leitura em voz alta.');
    }
  };

  return (
    <>
      <nav className="barra-navegacao">
        <div className="container-nav">
          <div className="logo-nav">
            <span className="texto-logo">UMBRAETH</span>
            <span className="subtitulo-logo">As Crônicas</span>
          </div>
          <ul className="menu-nav">
            {!estaLogado && (
              <>
                <li><Link to="/cadastro">Cadastro</Link></li>
                <li><Link to="/login">Entrar</Link></li>
              </>
            )}
            {estaLogado && (
              <>
                <li><Link to="/equipe">Equipe</Link></li>
                <li>
                  <button type="button" className="btn-sair" onClick={sair}>
                    Sair ({usuario?.nome_usuario || 'usuário'})
                  </button>
                </li>
              </>
            )}
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/desenvolvedores">Desenvolvedores</Link></li>
            <li>
              <Link
                to="#"
                className="link-acessibilidade"
                onClick={(e) => {
                  e.preventDefault();
                  lerConteudo();
                }}
                aria-label="Ler conteúdo da página em voz alta"
                title="Ler conteúdo da página"
              >
                🔊 Acessibilidade
              </Link>
            </li>
            <li><Link
              to="/jogar"
              className={`botao-rpg ${!estaEmEquipe ? 'desativado' : ''}`}
              aria-disabled={!estaEmEquipe}
              title={!estaEmEquipe ? 'Entre em uma equipe para jogar' : 'Jogar'}
              onClick={(e) => {
                if (!estaEmEquipe) e.preventDefault();
              }}
            >
              Jogar
            </Link>
            </li>
          </ul>
          {/* <div className="toggle-nav">☯</div> */}
        </div>
      </nav>

      <section className="heroi">
        <div className="container-heroi">
          <div className="conteudo-heroi">
            <div className="emblema-heroi">✦ REINO DE UMBRAETH ✦</div>
            <h1>
              <span className="texto-brilhante">As Crônicas</span>
              <br />
              de Umbraeth
            </h1>
            <p className="subtitulo-heroi">
              "Nas sombras do esquecimento, uma era de trevas desperta.
              O destino do reino está em suas mãos, herói."
            </p>
            <div className="botoes-heroi">
              {!estaLogado && (
                <button className="botao-primario" onClick={() => navegar('/cadastro')}>
                  🗡️ Criar Cadastro
                </button>
              )}
              {!estaLogado && (
                <button className="botao-secundario" onClick={() => navegar('/login')}>
                  🔑 Entrar
                </button>
              )}

              {estaLogado && !estaEmEquipe && (
                <button className="botao-primario" onClick={() => navegar('/equipe')}>
                  🛡️ Criar/Entrar em equipe
                </button>
              )}
              {estaLogado && !estaEmEquipe && (
                <button className="botao-secundario" onClick={() => navegar('/sobre')}>
                  📜 A Profecia
                </button>
              )}

              {estaLogado && estaEmEquipe && (
                <button className="botao-primario" onClick={() => navegar('/jogar')}>
                  🎮 Jogar agora
                </button>
              )}
              {estaLogado && estaEmEquipe && (
                <button className="botao-secundario" onClick={() => navegar('/equipe')}>
                  🧭 Minha equipe
                </button>
              )}
            </div>
            <div className="estatisticas-heroi">
              <div className="item-estatistica">
                <span className="numero-estatistica">7</span>
                <span className="rotulo-estatistica">Reinos</span>
              </div>
              <div className="divisor-estatistica">|</div>
              <div className="item-estatistica">
                <span className="numero-estatistica">12</span>
                <span className="rotulo-estatistica">Heróis Lendários</span>
              </div>
              <div className="divisor-estatistica">|</div>
              <div className="item-estatistica">
                <span className="numero-estatistica">∞</span>
                <span className="rotulo-estatistica">Aventuras</span>
              </div>
            </div>
          </div>

          <div className="imagem-heroi">
            <div className="moldura-imagem">
              <div className="placeholder-imagem">
                <span className="icone-placeholder">⚔️</span>
                <span className="texto-placeholder">UMBRAETH</span>
                <span className="subtitulo-placeholder">As Crônicas</span>
              </div>
              <div className="sobreposicao-imagem"></div>
              <div className="runas-imagem">ᚠ ᚢ ᚦ ᚨ ᚱ</div>
            </div>
          </div>
        </div>
      </section>

      <section className="caracteristicas">
        <h2>O Que Te Aguarda em Umbraeth</h2>
        <div className="grade-caracteristicas">
          <div className="cartao-caracteristica">
            <div className="icone-caracteristica">🏰</div>
            <h3>Reinos Sombrios</h3>
            <p>Explore terras esquecidas, castelos amaldiçoados e florestas encantadas.</p>
            <div className="runa-caracteristica">ᚲ</div>
          </div>
          <div className="cartao-caracteristica">
            <div className="icone-caracteristica">🐲</div>
            <h3>Criaturas Lendárias</h3>
            <p>Enfrente dragões anciões, demônios das trevas e seres ancestrais.</p>
            <div className="runa-caracteristica">ᚷ</div>
          </div>
          <div className="cartao-caracteristica">
            <div className="icone-caracteristica">⚡</div>
            <h3>Magia Ancestral</h3>
            <p>Domine os elementos e desvende os segredos da magia proibida.</p>
            <div className="runa-caracteristica">ᚹ</div>
          </div>
        </div>
      </section>

      <footer className="rodape">
        <div className="conteudo-rodape">
          <div className="logo-rodape">
            <span>UMBRAETH</span>
            <span className="subtitulo-rodape">As Crônicas</span>
          </div>
          <div className="links-rodape">
            {!estaLogado && <Link to="/cadastro">Cadastro</Link>}
            {!estaLogado && <Link to="/login">Entrar</Link>}
            {estaLogado && <Link to="/equipe">Equipe</Link>}
            <Link to="/sobre">Profecia</Link>
          </div>
          <div className="copiar-rodape" >
            <p>© 2026 - As Crônicas de Umbraeth - FEITO PELA TURMA T.I 101 </p>
            <div className="runas-rodape">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>
          </div>
        </div>
      </footer>
    </>
  );
}