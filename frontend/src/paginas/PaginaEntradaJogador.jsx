import { useState, useEffect, useRef } from "react";
import "./PaginaEntradaJogador.css";
import { persistirEquipes } from "../servicos/equipesServico";

function PaginaEntradaJogador({ onEntrar, grupos, onVoltar }) {
  const [token, setToken] = useState("");
  const [nomeJogador, setNomeJogador] = useState("");
  const [senhaJogador, setSenhaJogador] = useState("");
  const [grupoEncontrado, setGrupoEncontrado] = useState(null);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [personagemNome, setPersonagemNome] = useState("");
  const [classeSelecionada, setClasseSelecionada] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [notificacao, setNotificacao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const canvasRef = useRef(null);

  const classesDisponiveis = [
    { nome: "Guerreiro Sombrio", emoji: "⚔️", cor: "#ef4444", descricao: "Mestre das espadas sombrias", forca: 5, agilidade: 3, magia: 1 },
    { nome: "Mago das Sombras", emoji: "🔮", cor: "#8b5cf6", descricao: "Domina a magia das trevas", forca: 1, agilidade: 2, magia: 5 },
    { nome: "Caçador de Espectros", emoji: "🏹", cor: "#22d3ee", descricao: "Preciso e letal à distância", forca: 2, agilidade: 5, magia: 2 },
    { nome: "Assassino Etéreo", emoji: "🗡️", cor: "#ec4899", descricao: "Sombra mortal e silenciosa", forca: 3, agilidade: 5, magia: 1 },
  ];

  // Sistema de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleArray = [];
    for (let i = 0; i < 80; i++) {
      particleArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
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
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
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

  // Etapa 1: Buscar grupo pelo token
  const buscarGrupo = () => {
    const tokenLimpo = token.toUpperCase().trim();
    const grupo = grupos.find(g => g.token === tokenLimpo);
    
    if (grupo) {
      const vagasDisponiveis = grupo.integrantes.filter(integ => !integ.jogador && !integ.isLider);
      if (vagasDisponiveis.length === 0) {
        mostrarNotificacao("❌ Não há vagas disponíveis nesta equipe!", "error");
        return;
      }
      setGrupoEncontrado(grupo);
      setEtapa(2);
      mostrarNotificacao("✅ Token válido! Faça login para continuar.", "success");
    } else {
      mostrarNotificacao("❌ Token inválido! Verifique e tente novamente.", "error");
    }
  };

  // Etapa 2: Fazer login
  const fazerLogin = () => {
    if (!nomeJogador.trim()) {
      mostrarNotificacao("❌ Digite seu nome/apelido!", "error");
      return;
    }
    if (!senhaJogador.trim()) {
      mostrarNotificacao("❌ Digite sua senha!", "error");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      
      const jogadorExistente = grupoEncontrado.integrantes.find(
        integ => integ.jogador === nomeJogador.trim()
      );
      
      if (jogadorExistente) {
        mostrarNotificacao("❌ Este nome já está sendo usado na equipe!", "error");
        return;
      }

      setEtapa(3);
      mostrarNotificacao(`🎉 Bem-vindo ${nomeJogador}! Escolha sua vaga.`, "success");
    }, 1500);
  };

  // Etapa 3: Selecionar vaga
  const selecionarVaga = (integranteId) => {
    setVagaSelecionada(integranteId);
    setEtapa(4);
  };

  // Etapa 4: Criar personagem
  const criarPersonagem = () => {
    if (!personagemNome.trim()) {
      mostrarNotificacao("❌ Digite o nome do seu personagem!", "error");
      return;
    }
    if (!classeSelecionada) {
      mostrarNotificacao("❌ Selecione uma classe!", "error");
      return;
    }

    const grupoAtualizado = {
      ...grupoEncontrado,
      integrantes: grupoEncontrado.integrantes.map(integ => {
        if (integ.id === vagaSelecionada) {
          return {
            ...integ,
            jogador: nomeJogador.trim(),
            nome: personagemNome.trim(),
            classe: classeSelecionada,
            podeEditar: true
          };
        }
        return integ;
      })
    };

    const novosGrupos = grupos.map(g => 
      g.id === grupoEncontrado.id ? grupoAtualizado : g
    );

    localStorage.setItem('umbraeth_jogador', JSON.stringify({
      nome: nomeJogador.trim(),
      senha: senhaJogador.trim(),
      equipeId: grupoEncontrado.id,
      vagaId: vagaSelecionada
    }));

    persistirEquipes(novosGrupos);
    onEntrar(novosGrupos);
    mostrarNotificacao(`🎉 ${nomeJogador} entrou na equipe ${grupoEncontrado.nomeGrupo}!`, "success");
    
    setTimeout(() => {
      setEtapa(1);
      setToken("");
      setNomeJogador("");
      setSenhaJogador("");
      setGrupoEncontrado(null);
      setVagaSelecionada(null);
      setPersonagemNome("");
      setClasseSelecionada("");
    }, 2000);
  };

  const voltarEtapa = () => {
    if (etapa === 1) {
      onVoltar();
    } else {
      setEtapa(etapa - 1);
      if (etapa === 4) setVagaSelecionada(null);
    }
  };

  const getClasseInfo = (nomeClasse) => {
    return classesDisponiveis.find(c => c.nome === nomeClasse);
  };

  return (
    <div className="player-entry-container">
      <canvas ref={canvasRef} className="particles-canvas" />
      
      {notificacao && (
        <div className={`notificacao ${notificacao.tipo}`}>
          {notificacao.mensagem}
        </div>
      )}

      <div className="entry-card">
        <div className="entry-header">
          <div className="entry-logo">🎮</div>
          <h1>ENTRAR NA EQUIPE</h1>
          <p className="entry-subtitle">Junte-se à aventura em As Crônicas de Umbraeth</p>
        </div>

        <div className="entry-progress">
          <div className={`progress-step ${etapa >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Token</span>
          </div>
          <div className={`progress-line ${etapa >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${etapa >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Login</span>
          </div>
          <div className={`progress-line ${etapa >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${etapa >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Vaga</span>
          </div>
          <div className={`progress-line ${etapa >= 4 ? 'active' : ''}`}></div>
          <div className={`progress-step ${etapa >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Personagem</span>
          </div>
        </div>

        <div className="entry-content">
          {/* ETAPA 1: TOKEN */}
          {etapa === 1 && (
            <div className="etapa-token">
              <div className="etapa-icon">🔑</div>
              <h2>Digite o Token da Equipe</h2>
              <p>Peça o token ao líder da sua equipe</p>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Ex: ABCD-1234"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="input-token-grande"
                  maxLength="9"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && buscarGrupo()}
                />
                <button 
                  className="btn-buscar"
                  onClick={buscarGrupo}
                  disabled={token.length < 9}
                >
                  🔍 Buscar
                </button>
              </div>

              <div className="dica-token">
                <span>💡 O token tem 8 caracteres no formato XXXX-XXXX</span>
              </div>
            </div>
          )}

          {/* ETAPA 2: LOGIN */}
          {etapa === 2 && grupoEncontrado && (
            <div className="etapa-login">
              <div className="etapa-icon">🔐</div>
              <h2>Faça seu Login</h2>
              <p className="grupo-nome">🏹 Entrando em: {grupoEncontrado.nomeGrupo}</p>
              
              <div className="form-login">
                <div className="campo-login">
                  <label>👤 Nome/Apelido</label>
                  <input
                    type="text"
                    placeholder="Seu nome na equipe"
                    value={nomeJogador}
                    onChange={(e) => setNomeJogador(e.target.value)}
                    className="input-login"
                    disabled={carregando}
                  />
                </div>

                <div className="campo-login">
                  <label>🔑 Senha</label>
                  <input
                    type="password"
                    placeholder="Sua senha secreta"
                    value={senhaJogador}
                    onChange={(e) => setSenhaJogador(e.target.value)}
                    className="input-login"
                    disabled={carregando}
                    onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
                  />
                </div>

                <button 
                  className="btn-login"
                  onClick={fazerLogin}
                  disabled={carregando || !nomeJogador.trim() || !senhaJogador.trim()}
                >
                  {carregando ? (
                    <>
                      <span className="spinner"></span>
                      Entrando...
                    </>
                  ) : (
                    '🎮 Entrar na Equipe'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: VAGA */}
          {etapa === 3 && grupoEncontrado && (
            <div className="etapa-vaga">
              <div className="etapa-icon">👥</div>
              <h2>Escolha sua Vaga</h2>
              <p className="grupo-nome">🏹 {grupoEncontrado.nomeGrupo}</p>
              <p className="jogador-logado">👤 Logado como: <strong>{nomeJogador}</strong></p>
              <div className="vagas-grid">
                {grupoEncontrado.integrantes.map((integ) => {
                  const ocupado = !!integ.jogador;
                  const isLider = integ.isLider;
                  
                  return (
                    <div
                      key={integ.id}
                      className={`vaga-card ${ocupado ? 'ocupado' : 'disponivel'} ${isLider ? 'lider' : ''} ${vagaSelecionada === integ.id ? 'selecionado' : ''}`}
                      onClick={() => {
                        if (isLider) {
                          mostrarNotificacao("❌ Esta vaga é do Líder e está bloqueada!", "error");
                          return;
                        }
                        if (!ocupado) {
                          selecionarVaga(integ.id);
                        }
                      }}
                    >
                      <div className="vaga-card-header">
                        <span className="vaga-icone">
                          {isLider ? '👑' : '🛡️'}
                        </span>
                        <span className="vaga-nome">
                          {isLider ? 'Líder' : `Membro ${integ.id}`}
                        </span>
                        {isLider && (
                          <span className="badge-lider-vaga">BLOQUEADO</span>
                        )}
                      </div>
                      <div className="vaga-card-status">
                        {isLider ? (
                          <span className="status-lider">👑 Ocupado pelo Líder</span>
                        ) : ocupado ? (
                          <span className="status-ocupado">👤 {integ.jogador}</span>
                        ) : (
                          <span className="status-disponivel">✅ Disponível</span>
                        )}
                      </div>
                      {vagaSelecionada === integ.id && !ocupado && !isLider && (
                        <div className="vaga-selecionada-badge">✓ Selecionada</div>
                      )}
                      {isLider && (
                        <div className="vaga-bloqueada-badge">🔒</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="vaga-info">
                <span>📌 Selecione uma vaga disponível para continuar</span>
              </div>
            </div>
          )}

          {/* ETAPA 4: PERSONAGEM */}
          {etapa === 4 && grupoEncontrado && (
            <div className="etapa-personagem">
              <div className="etapa-icon">⚔️</div>
              <h2>Crie seu Personagem</h2>
              <p className="vaga-selecionada-info">
                🎯 Você está ocupando a vaga de {grupoEncontrado.integrantes.find(i => i.id === vagaSelecionada)?.isLider ? 'Líder' : `Membro ${vagaSelecionada}`}
              </p>
              <p className="jogador-logado">👤 Logado como: <strong>{nomeJogador}</strong></p>

              <div className="form-personagem">
                <div className="campo-personagem">
                  <label>📜 Nome do Personagem</label>
                  <input
                    type="text"
                    placeholder="Nome do seu herói"
                    value={personagemNome}
                    onChange={(e) => setPersonagemNome(e.target.value)}
                    className="input-personagem"
                  />
                </div>

                <div className="campo-personagem">
                  <label>🎯 Escolha sua Classe</label>
                  <div className="classes-grid">
                    {classesDisponiveis.map((classe) => {
                      const isSelected = classeSelecionada === classe.nome;
                      return (
                        <div
                          key={classe.nome}
                          className={`classe-card ${isSelected ? 'selecionada' : ''}`}
                          onClick={() => setClasseSelecionada(classe.nome)}
                          style={{
                            borderColor: isSelected ? classe.cor : 'rgba(168, 85, 247, 0.2)',
                            background: isSelected ? `${classe.cor}15` : 'transparent'
                          }}
                        >
                          <span className="classe-emoji" style={{ color: classe.cor }}>
                            {classe.emoji}
                          </span>
                          <span className="classe-nome">{classe.nome}</span>
                          <span className="classe-descricao">{classe.descricao}</span>
                          <div className="classe-atributos">
                            <span>⚔️ {classe.forca}</span>
                            <span>🏃 {classe.agilidade}</span>
                            <span>🔮 {classe.magia}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  className="btn-criar-personagem"
                  onClick={criarPersonagem}
                  disabled={!personagemNome.trim() || !classeSelecionada}
                >
                  🎮 Entrar na Aventura
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="entry-footer">
          <button className="btn-voltar" onClick={voltarEtapa}>
            {etapa === 1 ? '← Voltar' : '← Voltar'}
          </button>
          <div className="entry-status">
            {etapa === 1 && 'Digite o token'}
            {etapa === 2 && 'Faça login'}
            {etapa === 3 && 'Escolha sua vaga'}
            {etapa === 4 && 'Crie seu personagem'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaEntradaJogador;
