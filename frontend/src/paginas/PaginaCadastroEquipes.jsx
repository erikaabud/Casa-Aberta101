import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PaginaEntradaJogador from "./PaginaEntradaJogador";
import { carregarEquipes, persistirEquipes, gerarTokenEquipe } from "../servicos/equipesServico";
import "./PaginaCadastroEquipes.css";

function PaginaCadastroEquipes({ onEquipeCriada, equipeCriada, usuarioLogado }) {
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState(() => carregarEquipes());

  const [notificacao, setNotificacao] = useState(null);
  const [estatisticas, setEstatisticas] = useState({ total: 0, classes: {} });
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [tokenCopiado, setTokenCopiado] = useState(null);
  const [mostrarEntradaJogador, setMostrarEntradaJogador] = useState(false);
  const canvasRef = useRef(null);

  const classesDisponiveis = [
    { nome: "Guerreiro Sombrio", emoji: "⚔️", cor: "#ef4444" },
    { nome: "Mago das Sombras", emoji: "🔮", cor: "#8b5cf6" },
    { nome: "Caçador de Espectros", emoji: "🏹", cor: "#22d3ee" },
    { nome: "Assassino Etéreo", emoji: "🗡️", cor: "#ec4899" },
  ];

  // Gerar token único
  const gerarToken = () => gerarTokenEquipe();

  // Sistema de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
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
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Efeito de digitação
  const [textoDigitado, setTextoDigitado] = useState("");
  const fullText = "⚔️ FORJE SUA LENDA ⚔️";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTextoDigitado(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Função para lidar com a entrada do jogador
  const handlePlayerEntry = (novosGrupos) => {
    setGrupos(novosGrupos);
    setMostrarEntradaJogador(false);
    mostrarNotificacao("🎉 Bem-vindo à equipe!", "success");
    
    persistirEquipes(novosGrupos);
  };

  const adicionarGrupo = () => {
    const novoGrupo = {
      id: grupos.length + 1,
      nomeGrupo: `Equipe ${String.fromCharCode(65 + grupos.length)}`,
      token: "",
      tokenGerado: false,
      integrantes: [
        { id: 1, nome: "", classe: "", isLider: true, level: 1, experiencia: 0, jogador: "", podeEditar: true },
        { id: 2, nome: "", classe: "", isLider: false, level: 1, experiencia: 0, jogador: "", podeEditar: false },
        { id: 3, nome: "", classe: "", isLider: false, level: 1, experiencia: 0, jogador: "", podeEditar: false },
        { id: 4, nome: "", classe: "", isLider: false, level: 1, experiencia: 0, jogador: "", podeEditar: false },
      ],
    };
    setGrupos([...grupos, novoGrupo]);
    mostrarNotificacao("✨ Nova equipe criada!", "success");
  };

  const removerGrupo = (groupId) => {
    if (grupos.length > 1) {
      setGrupos(grupos.filter((g) => g.id !== groupId));
      mostrarNotificacao("🗑️ Equipe removida", "warning");
    }
  };

  const mostrarNotificacao = (mensagem, tipo = "info") => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const atualizarIntegrante = (groupId, integranteId, campo, valor) => {
    setGrupos(
      grupos.map((grupo) => {
        if (grupo.id === groupId) {
          return {
            ...grupo,
            integrantes: grupo.integrantes.map((integ) => {
              if (integ.id === integranteId) {
                return { ...integ, [campo]: valor };
              }
              return integ;
            }),
          };
        }
        return grupo;
      })
    );
  };

  const atualizarNomeGrupo = (groupId, valor) => {
    setGrupos(
      grupos.map((grupo) => {
        if (grupo.id === groupId) {
          return { ...grupo, nomeGrupo: valor };
        }
        return grupo;
      })
    );
  };

  const definirLider = (groupId, integranteId) => {
    setGrupos(
      grupos.map((grupo) => {
        if (grupo.id === groupId) {
          return {
            ...grupo,
            integrantes: grupo.integrantes.map((integ) => ({
              ...integ,
              isLider: integ.id === integranteId,
              podeEditar: integ.id === integranteId ? true : integ.podeEditar,
            })),
          };
        }
        return grupo;
      })
    );
    mostrarNotificacao("⭐ Líder atualizado!", "success");
  };

  const gerarTokenParaGrupo = (groupId) => {
    const token = gerarToken();
    setGrupos(
      grupos.map((grupo) => {
        if (grupo.id === groupId) {
          return { ...grupo, token, tokenGerado: true };
        }
        return grupo;
      })
    );
    mostrarNotificacao("🔑 Token gerado com sucesso!", "success");
  };

  const copiarToken = (groupId) => {
    const grupo = grupos.find(g => g.id === groupId);
    if (grupo && grupo.token) {
      navigator.clipboard.writeText(grupo.token).then(() => {
        setTokenCopiado(groupId);
        mostrarNotificacao("📋 Token copiado!", "success");
        setTimeout(() => setTokenCopiado(null), 2000);
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = grupo.token;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setTokenCopiado(groupId);
        mostrarNotificacao("📋 Token copiado!", "success");
        setTimeout(() => setTokenCopiado(null), 2000);
      });
    }
  };

  const podeEditarCard = (integ) => {
    if (integ.isLider) {
      return true;
    }
    
    if (!usuarioLogado) return false;
    
    if (integ.jogador) {
      return integ.jogador === usuarioLogado.email || integ.jogador === usuarioLogado.nome;
    }
    
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const erros = [];

    grupos.forEach((grupo, idx) => {
      if (!grupo.nomeGrupo.trim()) {
        erros.push(`Equipe ${idx + 1}: Nome do grupo é obrigatório`);
      }
      if (!grupo.tokenGerado) {
        erros.push(`Equipe ${idx + 1}: Token não gerado`);
      }
      grupo.integrantes.forEach((integ, i) => {
        if (!integ.nome.trim()) {
          erros.push(`Equipe ${idx + 1}, Integrante ${i + 1}: Nome é obrigatório`);
        }
        if (!integ.classe) {
          erros.push(`Equipe ${idx + 1}, Integrante ${i + 1}: Selecione uma classe`);
        }
      });
    });

    if (erros.length > 0) {
      mostrarNotificacao(`❌ ${erros[0]}`, "error");
      return;
    }

    const stats = { total: grupos.length, classes: {} };
    grupos.forEach(grupo => {
      grupo.integrantes.forEach(integ => {
        if (integ.classe) {
          stats.classes[integ.classe] = (stats.classes[integ.classe] || 0) + 1;
        }
      });
    });
    setEstatisticas(stats);

    mostrarNotificacao("🎉 Equipe registrada com sucesso!", "success");

    persistirEquipes(grupos);

    if (onEquipeCriada) {
      onEquipeCriada(grupos);
    }

    setTimeout(() => {
      navigate('/login');
    }, 1500);

    console.log("Dados completos:", grupos);
  };

  const iniciarJogo = () => {
    const todosCompletos = grupos.every(grupo =>
      grupo.nomeGrupo.trim() &&
      grupo.tokenGerado &&
      grupo.integrantes.every(integ => integ.nome.trim() && integ.classe)
    );

    if (!todosCompletos) {
      mostrarNotificacao("❌ Complete o cadastro de todas as equipes!", "error");
      return;
    }

    setJogoIniciado(true);
    mostrarNotificacao("🎮 O jogo começou!", "success");
    console.log("🎮 Jogo iniciado com as equipes:", grupos);
  };

  const getClasseInfo = (nomeClasse) => {
    return classesDisponiveis.find(c => c.nome === nomeClasse);
  };

  const todosProntos = grupos.every(grupo =>
    grupo.nomeGrupo.trim() &&
    grupo.tokenGerado &&
    grupo.integrantes.every(integ => integ.nome.trim() && integ.classe)
  );

  const totalJogadores = grupos.reduce((acc, g) =>
    acc + g.integrantes.filter(i => i.jogador).length, 0
  );

  return (
    <div className="painel-container">
      {mostrarEntradaJogador ? (
        <PaginaEntradaJogador
          onEntrar={handlePlayerEntry}
          grupos={grupos}
          onVoltar={() => setMostrarEntradaJogador(false)}
          usuarioLogado={usuarioLogado}
        />
      ) : (
        <>
          <canvas ref={canvasRef} className="particles-canvas" />

          {notificacao && (
            <div className={`notificacao ${notificacao.tipo}`}>
              {notificacao.mensagem}
            </div>
          )}

          <div className="header-heroico">
            <h1 className="titulo-principal">{textoDigitado}</h1>
            <p className="subtitulo-heroico">AS CRÔNICAS DE UMBRAETH</p>
            <div className="linha-divisoria"></div>
          </div>

          {/* Botão Entrar com Token */}
          <div className="entrada-container">
            <button
              className="btn-entrada-token btn-heroico"
              onClick={() => setMostrarEntradaJogador(true)}
            >
              <span className="btn-icon">🔑</span>
              <span className="btn-text">Entrar com Token</span>
            </button>
          </div>

          <div className="estatisticas-globais">
            <div className="stat-card">
              <span className="stat-icone">🏰</span>
              <span className="stat-numero">{grupos.length}</span>
              <span className="stat-label">Equipes</span>
            </div>
            <div className="stat-card">
              <span className="stat-icone">👥</span>
              <span className="stat-numero">{grupos.length *4}</span>
              <span className="stat-label">Heróis</span>
            </div>
            <div className="stat-card">
              <span className="stat-icone">🔑</span>
              <span className="stat-numero">{grupos.filter(g => g.tokenGerado).length}</span>
              <span className="stat-label">Tokens</span>
            </div>
            {totalJogadores > 0 && (
              <div className="stat-card">
                <span className="stat-icone">👤</span>
                <span className="stat-numero">{totalJogadores}</span>
                <span className="stat-label">Jogadores</span>
              </div>
            )}
            {Object.keys(estatisticas.classes).length > 0 && (
              <div className="stat-card classes-popup">
                <span className="stat-icone">🎯</span>
                <div className="classes-mini">
                  {Object.entries(estatisticas.classes).slice(0, 3).map(([classe, count]) => (
                    <span key={classe} className="classe-tag">
                      {getClasseInfo(classe)?.emoji} {count}
                    </span>
                  ))}
                  {Object.keys(estatisticas.classes).length > 3 && (
                    <span className="classe-tag">+{Object.keys(estatisticas.classes).length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grupos-container">
              {grupos.map((grupo) => (
                <div key={grupo.id} className="card-grupo">
                  <div className="card-glow"></div>

                  <div className="grupo-header">
                    <div className="grupo-titulo-wrapper">
                      <span className="grupo-icone">🏹</span>
                      <input
                        type="text"
                        placeholder="⚡ Nome da sua equipe"
                        value={grupo.nomeGrupo}
                        onChange={(e) => atualizarNomeGrupo(grupo.id, e.target.value)}
                        className="campo-nome-grupo"
                      />
                    </div>
                    <div className="grupo-acoes">
                      <button
                        type="button"
                        className="btn-remover-grupo btn-glass"
                        onClick={() => removerGrupo(grupo.id)}
                        disabled={grupos.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Sistema de Token */}
                  <div className="token-container">
                    <div className="token-info">
                      <span className="token-icon">🔑</span>
                      <span className="token-label">Token da Equipe:</span>
                      {grupo.tokenGerado ? (
                        <div className="token-display">
                          <code className="token-code">{grupo.token}</code>
                          <button
                            type="button"
                            className="btn-copiar-token"
                            onClick={() => copiarToken(grupo.id)}
                          >
                            {tokenCopiado === grupo.id ? '✅' : '📋'}
                          </button>
                          <span className="token-status token-gerado">✓ Gerado</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-gerar-token"
                          onClick={() => gerarTokenParaGrupo(grupo.id)}
                        >
                          🔐 Gerar Token
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="integrantes-grid">
                    {grupo.integrantes.map((integ) => {
                      const classeInfo = getClasseInfo(integ.classe);
                      const vagaOcupada = !!integ.jogador;
                      const isLider = integ.isLider;
                      const podeEditar = podeEditarCard(integ);
                      const ehProprietario = integ.jogador === usuarioLogado?.email || integ.jogador === usuarioLogado?.nome;

                      return (
                        <div
                          key={integ.id}
                          className={`membro-card ${isLider ? "lider" : ""} ${vagaOcupada ? "ocupada" : "vazia"} ${podeEditar ? "editavel" : "bloqueado"}`}
                        >
                          <div className="membro-card-glow" />

                          <div className="membro-header">
                            <div className="membro-titulo">
                              {isLider ? (
                                <span className="icone-lider">👑</span>
                              ) : (
                                <span className="icone-membro">🛡️</span>
                              )}
                              <h3>
                                {isLider ? "Líder" : `Membro ${integ.id}`}
                              </h3>
                              {isLider && (
                                <span className="badge-lider">LÍDER</span>
                              )}
                              {integ.jogador && (
                                <span className="badge-jogador">
                                  {ehProprietario ? '👤 Você' : `👤 ${integ.jogador}`}
                                </span>
                              )}
                              {vagaOcupada && !ehProprietario && !isLider && (
                                <span className="badge-bloqueado">🔒 BLOQUEADO</span>
                              )}
                              {!vagaOcupada && !isLider && (
                                <span className="badge-disponivel">📌 Disponível</span>
                              )}
                            </div>
                            {!isLider && !integ.jogador && (
                              <button
                                type="button"
                                className="btn-definir-lider"
                                onClick={() => definirLider(grupo.id, integ.id)}
                              >
                                ⭐ Liderar
                              </button>
                            )}
                          </div>

                          <div className="campo-wrapper">
                            <input
                              type="text"
                              placeholder={isLider ? "👑 Nome do Líder" : "📜 Nome do herói"}
                              value={integ.nome}
                              onChange={(e) =>
                                atualizarIntegrante(
                                  grupo.id,
                                  integ.id,
                                  "nome",
                                  e.target.value
                                )
                              }
                              className={`campo-input ${podeEditar ? '' : 'bloqueado'}`}
                              disabled={!podeEditar}
                            />
                            {!podeEditar && vagaOcupada && (
                              <span className="campo-aviso">🔒 Editado por {integ.jogador}</span>
                            )}
                            {!vagaOcupada && !isLider && (
                              <span className="campo-aviso-disponivel">🔓 Aguardando jogador</span>
                            )}
                          </div>

                          <div className="campo-wrapper">
                            <select
                              value={integ.classe}
                              onChange={(e) =>
                                atualizarIntegrante(
                                  grupo.id,
                                  integ.id,
                                  "classe",
                                  e.target.value
                                )
                              }
                              className={`campo-select ${podeEditar ? '' : 'bloqueado'}`}
                              style={classeInfo ? { borderColor: classeInfo.cor } : {}}
                              disabled={!podeEditar}
                            >
                              <option value="">🎯 Escolha sua classe</option>
                              {classesDisponiveis.map((classe) => (
                                <option key={classe.nome} value={classe.nome}>
                                  {classe.emoji} {classe.nome}
                                </option>
                              ))}
                            </select>
                          </div>

                          {integ.classe && classeInfo && (
                            <div className="classe-badge" style={{ background: `${classeInfo.cor}20`, borderColor: classeInfo.cor }}>
                              {classeInfo.emoji} {classeInfo.nome}
                            </div>
                          )}

                          <div className="level-indicator">
                            <span className="level-icon">⚡</span>
                            <span className="level-text">Nível {integ.level}</span>
                            <div className="exp-bar">
                              <div className="exp-fill" style={{ width: `${(integ.experiencia / 100) * 100}%` }} />
                            </div>
                          </div>

                          {integ.jogador && (
                            <div className={`jogador-tag ${ehProprietario ? 'proprietario' : ''}`}>
                              {ehProprietario ? '🎮 Você está aqui' : `🎮 ${integ.jogador}`}
                            </div>
                          )}
                          {!integ.jogador && !isLider && (
                            <div className="vaga-disponivel-tag">
                              🔓 Vaga disponível
                            </div>
                          )}
                          {isLider && !integ.jogador && (
                            <div className="lider-aguardando-tag">
                              👑 Aguardando líder...
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="botoes-acoes">
              <button
                type="button"
                className="btn-adicionar-grupo btn-heroico"
                onClick={adicionarGrupo}
              >
                <span className="btn-icon">✦</span>
                <span className="btn-text">Criar Nova Equipe</span>
              </button>
              <button type="submit" className="btn-cadastrar btn-heroico btn-principal">
                <span className="btn-icon">⚔️</span>
                <span className="btn-text">Registrar Heróis</span>
              </button>
              <button
                type="button"
                className={`btn-iniciar-jogo btn-heroico ${todosProntos ? 'btn-pronto' : 'btn-bloqueado'}`}
                onClick={iniciarJogo}
                disabled={!todosProntos}
              >
                <span className="btn-icon">🎮</span>
                <span className="btn-text">Iniciar Jogo</span>
                {todosProntos && <span className="btn-ready">✓</span>}
              </button>
            </div>
          </form>

          {jogoIniciado && (
            <div className="modal-jogo-iniciado" onClick={() => setJogoIniciado(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">🎮</div>
                <h2>O Jogo Começou!</h2>
                <p>Preparem-se para a aventura em As Crônicas de Umbraeth!</p>
                <div className="modal-equipes">
                  {grupos.map(grupo => (
                    <div key={grupo.id} className="modal-equipe">
                      <strong>{grupo.nomeGrupo}</strong>
                      <span className="modal-token">Token: {grupo.token}</span>
                      <span className="modal-membros">
                        {grupo.integrantes.filter(i => i.jogador).length}/{grupo.integrantes.length} jogadores
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn-fechar-modal"
                  onClick={() => setJogoIniciado(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          <footer className="footer-legend">
            <div className="legend-items">
              <span>👑 Líder</span>
              <span>🛡️ Membro</span>
              <span>⚡ Nível</span>
              <span>🎯 Classe</span>
              <span>🔑 Token</span>
              <span>👤 Jogador</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default PaginaCadastroEquipes;
