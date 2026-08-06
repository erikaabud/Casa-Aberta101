import { useState, useEffect, useRef } from "react";
import "./PaginaLogin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextos/AuthContext";

function PaginaLogin() {
  const navegar = useNavigate();
  const { entrar, recarregarMinhaEquipe } = useAuth();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const canvasRef = useRef(null);

  // Sistema de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleArray = [];
    for (let i = 0; i < 100; i++) {
      particleArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particleArray.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const mostrarNotificacao = (mensagem, tipo = "info") => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      mostrarNotificacao("❌ Digite seu nome de guerreiro!", "error");
      return;
    }
    if (!senha.trim()) {
      mostrarNotificacao("❌ Digite sua senha!", "error");
      return;
    }
    if (senha.length < 3) {
      mostrarNotificacao("❌ A senha deve ter pelo menos 3 caracteres!", "error");
      return;
    }

    setCarregando(true);

    try {
      await entrar({ nomeUsuario: nome, senhaUsuario: senha });

      if (lembrar) {
        localStorage.setItem('umbraeth_nome', nome);
      }

      // tenta carregar equipe (se já estiver em uma)
      await recarregarMinhaEquipe().catch(() => null);

      mostrarNotificacao(`🎉 Bem-vindo, ${nome}!`, "success");
      setTimeout(() => navegar("/equipe"), 800);
    } catch (erro) {
      mostrarNotificacao(erro?.message || "Erro ao conectar com o servidor.", "error");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar nome salvo
  useEffect(() => {
    const nomeSalvo = localStorage.getItem('umbraeth_nome');
    if (nomeSalvo) {
      setNome(nomeSalvo);
      setLembrar(true);
    }
  }, []);

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="login-particles" />
      
      {notificacao && (
        <div className={`login-notificacao ${notificacao.tipo}`}>
          {notificacao.mensagem}
        </div>
      )}

      <div className="login-card">
        {/* Selo/Emblema */}
        <div className="login-emblema">
          <div className="login-emblema-icone">⚔️</div>
          <div className="login-emblema-texto">AS CRÔNICAS DE</div>
          <div className="login-emblema-destaque">UMBRAETH</div>
          <div className="login-emblema-runa">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ</div>
        </div>

        <div className="login-divisor">
          <span>✦</span>
        </div>

        <h2 className="login-titulo">Entrar na Jornada</h2>
        <p className="login-subtitulo">Aventureiro, a escuridão te aguarda...</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-campo">
            <label htmlFor="nome">👤 Nome do Guerreiro</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="login-input"
              disabled={carregando}
              autoFocus
            />
            <span className="login-campo-runa">ᚨ</span>
          </div>

          <div className="login-campo">
            <label htmlFor="senha">🔑 Senha</label>
            <div className="login-senha-wrapper">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Sua senha secreta"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="login-input login-input-senha"
                disabled={carregando}
              />
              <button
                type="button"
                className="login-toggle-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                disabled={carregando}
              >
                {mostrarSenha ? "👁️" : "👁️‍🗨️"}
              </button>
              <span className="login-campo-runa">ᚲ</span>
            </div>
          </div>

          <div className="login-opcoes">
            <label className="login-lembrar">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                disabled={carregando}
              />
              <span>Lembrar de mim</span>
            </label>
          </div>

          <button 
            type="submit" 
            className={`login-botao ${carregando ? 'carregando' : ''}`}
            disabled={carregando}
          >
            {carregando ? (
              <>
                <span className="login-spinner"></span>
                Forjando entrada...
              </>
            ) : (
              <>
                <span>⚔️</span>
                Entrar na Aventura
              </>
            )}
          </button>
        </form>

        <div className="login-divisor">
          <span>✦</span>
        </div>

        <div className="login-cadastro">
          <p>
            Ainda não é um herói?{' '}
            <button
              type="button"
              className="login-link-cadastro"
              onClick={() => navegar("/cadastro")}
            >
              Crie sua lenda
            </button>
          </p>
        </div>

        <div className="login-runas">
          <span>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ</span>
        </div>

        <div className="login-versao">
          v1.0.0 • As Crônicas de Umbraeth
        </div>
      </div>
    </div>
  );
}

export default PaginaLogin;
