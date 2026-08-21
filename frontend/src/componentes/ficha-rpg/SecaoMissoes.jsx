import { useState, useEffect, useRef } from 'react';
import './SecaoMissoes.css';

// Dados das missões no formato do HTML
const MISSIONS_DATA = [
  {
    id: 1,
    title: "Recuperar as Joias do Selo",
    classTag: "⚔️ Trabalho Geral",
    description: `Encontrar os <span className="highlight">2 Cryptex</span> e o <span className="highlight">baú</span> para obter as 3 joias. O baú é protegido pelo <span className="class-highlight warrior">Esqueleto Espectral</span>.`,
    items: [
      { id: 'cryptex1', label: 'Cryptex 1', icon: '🔮', max: 1 },
      { id: 'cryptex2', label: 'Cryptex 2', icon: '🔮', max: 1 },
      { id: 'bau', label: 'Baú do Esqueleto', icon: '⚔️', max: 1 },
      { id: 'joias', label: 'Joias do Selo', icon: '💎', max: 3 }
    ],
    classType: "general"
  },

  {
    id: 2,
    title: "Encontrar a Espada Selada",
    classTag: "⚔️ Trabalho do Guerreiro",
    description: `Localizar a espada que servirá de <span className="highlight">chave</span> para abrir a <span className="highlight">Câmara Selada</span>.`,
    items: [
      {
        id: 'masmorra',
        label: 'Explorar masmorra',
        icon: '🗡️',
        max: 1
      },
      {
        id: 'local_espada',
        label: 'Encontrar local da espada',
        icon: '🔍',
        max: 1
      },
      {
        id: 'guardioes',
        label: 'Superar guardiões',
        icon: '⚔️',
        max: 1
      },
      {
        id: 'espada',
        label: 'Espada Selada',
        icon: '🗝️',
        max: 1
      }
    ],
    classType: "warrior"
  },

  {
    id: 3,
    title: "Resolver os Desafios",
    classTag: "🎯 Trabalho em Equipe",
    description: `Abrir os Cryptex: um exige que o <span className="class-highlight rogue">Ladino</span> acerte <span className="highlight">10 pontos</span> no alvo e o outro o <span className="class-highlight mage">Mago</span> resolverá um <span className="highlight">desafio de alquimia</span>. O baú exige enfrentar um inimigo protetor.`,
    items: [
      {
        id: 'alvo',
        label: 'Ladino: pontos no alvo',
        icon: '🎯',
        max: 10
      },
      {
        id: 'alquimia',
        label: 'Mago: desafio de alquimia',
        icon: '🧪',
        max: 1
      },
      {
        id: 'protetor',
        label: 'Guerreiro: enfrentar protetor',
        icon: '⚔️',
        max: 1
      }
    ],
    classType: "general"
  },

  {
    id: 4,
    title: "Recuperar a Bomba Alquímica",
    classTag: "🧪 Trabalho do Mago",
    description: `Desafio de alquimia alternativo para o <span className="class-highlight mage">Mago</span>, caso queira, opção a mais para atingir o <span className="highlight">chefe final</span>.`,
    items: [
      {
        id: 'cor_vermelha',
        label: 'Combinar cores: Vermelha',
        icon: '🧪',
        max: 1
      },
      {
        id: 'cor_cinza',
        label: 'Combinar cores: Cinza',
        icon: '🧪',
        max: 1
      },
      {
        id: 'cor_verde',
        label: 'Combinar cores: Verde',
        icon: '🧪',
        max: 1
      },
      {
        id: 'bomba',
        label: 'Criar Bomba Alquímica',
        icon: '💣',
        max: 1
      }
    ],
    classType: "mage"
  }
];

export function SecaoMissoes({
  missoes,
  aoConcluirMissao
}) {
  const [missaoSelecionada, setMissaoSelecionada] =
    useState(null);

  const [currentMissionIndex, setCurrentMissionIndex] =
    useState(0);

  const [collectedItems, setCollectedItems] =
    useState({});

  const [gameCompleted, setGameCompleted] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState('');

  const [showToast, setShowToast] =
    useState(false);

  const toastTimeoutRef = useRef(null);
  const missionCardRef = useRef(null);

  // Inicializar collectedItems
  useEffect(() => {
    const initItems = {};

    MISSIONS_DATA.forEach(mission => {
      mission.items.forEach(item => {
        initItems[item.id] = 0;
      });
    });

    setCollectedItems(initItems);
  }, []);

  // Funções auxiliares
  const findItem = (itemId) => {
    for (const mission of MISSIONS_DATA) {
      for (const item of mission.items) {
        if (item.id === itemId) {
          return item;
        }
      }
    }

    return null;
  };

  const getMissionItems = (missionIdx) => {
    return MISSIONS_DATA[missionIdx].items;
  };

  const isMissionComplete = (missionIdx) => {
    const items = getMissionItems(missionIdx);

    return items.every(
      item =>
        (collectedItems[item.id] || 0) >= item.max
    );
  };

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);

    clearTimeout(toastTimeoutRef.current);

    toastTimeoutRef.current = setTimeout(
      () => setShowToast(false),
      2000
    );
  };

  const collectItem = (itemId, missionIdx) => {
    if (gameCompleted) return;

    const mission = MISSIONS_DATA[missionIdx];

    if (!mission) return;

    const item = mission.items.find(
      it => it.id === itemId
    );

    if (!item) return;

    if (
      (collectedItems[itemId] || 0) >= item.max
    ) {
      showToastMessage(
        `⚠️ "${item.label}" já está completo!`
      );

      return;
    }

    const newCollected = {
      ...collectedItems,
      [itemId]:
        (collectedItems[itemId] || 0) + 1
    };

    setCollectedItems(newCollected);

    const current = newCollected[itemId];

    showToastMessage(
      `✦ ${item.icon} ${item.label}: ${current}/${item.max}`
    );

    // Verificar se missão foi completada
    const updatedItems =
      getMissionItems(missionIdx);

    const allComplete =
      updatedItems.every(
        it =>
          (newCollected[it.id] || 0) >= it.max
      );

    if (allComplete) {
      if (
        missionIdx ===
        MISSIONS_DATA.length - 1
      ) {
        setGameCompleted(true);

        showToastMessage(
          '🏆 Jornada completa!'
        );

        aoConcluirMissao(
          MISSIONS_DATA[missionIdx].id
        );
      } else {
        setCurrentMissionIndex(
          missionIdx + 1
        );

        showToastMessage(
          `✦ Missão ${MISSIONS_DATA[missionIdx].id} concluída!`
        );

        aoConcluirMissao(
          MISSIONS_DATA[missionIdx].id
        );

        if (missionCardRef.current) {
          missionCardRef.current.classList.add(
            'mission-complete'
          );

          setTimeout(() => {
            if (missionCardRef.current) {
              missionCardRef.current.classList.remove(
                'mission-complete'
              );
            }
          }, 500);
        }
      }
    }
  };

  const resetGame = () => {
    setCurrentMissionIndex(0);
    setGameCompleted(false);

    const initItems = {};

    MISSIONS_DATA.forEach(mission => {
      mission.items.forEach(item => {
        initItems[item.id] = 0;
      });
    });

    setCollectedItems(initItems);

    showToastMessage(
      '🔄 Jornada reiniciada.'
    );
  };

  // Efeito para animação de entrada
  useEffect(() => {
    if (missionCardRef.current) {
      missionCardRef.current.style.opacity = '0';

      missionCardRef.current.style.transform =
        'translateY(20px)';

      setTimeout(() => {
        if (missionCardRef.current) {
          missionCardRef.current.style.transition =
            'all 0.6s ease';

          missionCardRef.current.style.opacity =
            '1';

          missionCardRef.current.style.transform =
            'translateY(0)';
        }
      }, 100);
    }
  }, []);

  // Renderização
  const renderMission = () => {
    if (gameCompleted) {
      return (
        <div
          className="mission-card"
          style={{
            borderColor: '#f0d060',
            boxShadow:
              '0 0 60px rgba(212, 168, 67, 0.3), inset 0 0 60px rgba(212, 168, 67, 0.1)'
          }}
        >
          <div className="mission-indicator">
            {MISSIONS_DATA.map((_, idx) => (
              <div
                key={idx}
                className="dot completed"
              />
            ))}
          </div>

          <div className="mission-number">
            MISSÃO ★
          </div>

          <div className="mission-title">
            🌟 Jornada Concluída!

            <div className="class-tag">
              ⚔️ 4 Almas, 1 Destino ⚔️
            </div>
          </div>

          <div className="mission-description">
            <span
              style={{
                color: '#f0d060',
                fontSize: '1.2rem'
              }}
            >
              ✦ Todos os desafios foram
              superados! ✦
            </span>

            <br />
            <br />

            A{' '}
            <span className="highlight">
              Sala do Chefe
            </span>{' '}
            está aberta. Que a escuridão
            vos guie.
          </div>

          <div className="mission-details">
            {MISSIONS_DATA.map(
              (mission, idx) => (
                <div
                  key={idx}
                  className="sub-task done"
                >
                  <span className="icon">
                    ✨
                  </span>

                  <span className="label">
                    Missão {mission.id}:{' '}
                    {mission.title} ✓
                  </span>

                  <span className="counter">
                    ✅
                  </span>
                </div>
              )
            )}
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: '100%'
                }}
              />
            </div>

            <div className="progress-text">
              <span className="current">
                100%
              </span>

              <span>
                {MISSIONS_DATA.length} missões
              </span>
            </div>
          </div>

          <div className="button-container">
            <button
              className="btn"
              onClick={resetGame}
            >
              🔄 Resetar
            </button>
          </div>
        </div>
      );
    }

    const mission =
      MISSIONS_DATA[currentMissionIndex];

    const items =
      getMissionItems(currentMissionIndex);

    const completedMissions =
      currentMissionIndex;

    const totalMissions =
      MISSIONS_DATA.length;

    const totalItems =
      items.length;

    const completedItems =
      items.filter(
        item =>
          (collectedItems[item.id] || 0) >=
          item.max
      ).length;

    const missionProgress =
      totalItems > 0
        ? completedItems / totalItems
        : 0;

    const overallProgress =
      (
        (completedMissions +
          missionProgress) /
        totalMissions
      ) * 100;

    return (
      <div
        className="mission-card"
        ref={missionCardRef}
      >
        <div className="mission-indicator">
          {MISSIONS_DATA.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${
                idx === currentMissionIndex
                  ? 'active'
                  : ''
              } ${
                idx < currentMissionIndex
                  ? 'completed'
                  : ''
              }`}
            />
          ))}
        </div>

        <div className="mission-number">
          MISSÃO{' '}
          <span>{mission.id}</span> DE{' '}
          {MISSIONS_DATA.length}
        </div>

        <div className="mission-title">
          {mission.title}

          <div className="class-tag">
            {mission.classTag}
          </div>
        </div>

        <div
          className="mission-description"
          dangerouslySetInnerHTML={{
            __html: mission.description
          }}
        />

        <div className="mission-details">
          {items.map(item => {
            const current =
              collectedItems[item.id] || 0;

            const max = item.max;

            const done = current >= max;

            const progressText =
              `${current}/${max}`;

            return (
              <div
                key={item.id}
                className={`sub-task ${
                  done ? 'done' : ''
                }`}
              >
                <span className="icon">
                  {item.icon}
                </span>

                <span className="label">
                  {item.label}
                </span>

                <span className="counter">
                  {progressText}
                </span>

                <span
                  className={`qr-btn ${
                    done ? 'collected' : ''
                  }`}
                  onClick={() =>
                    collectItem(
                      item.id,
                      currentMissionIndex
                    )
                  }
                >
                  📲 QR
                </span>
              </div>
            );
          })}
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width:
                  Math.min(
                    overallProgress,
                    100
                  ) + '%'
              }}
            />
          </div>

          <div className="progress-text">
            <span className="current">
              {Math.round(
                Math.min(
                  overallProgress,
                  100
                )
              )}%
            </span>

            <span>
              {MISSIONS_DATA.length} missões
            </span>
          </div>
        </div>

        <div className="button-container">
          <button
            className="btn"
            onClick={resetGame}
          >
            🔄 Resetar
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="secao-missoes">
      <h2>Missões Ativas</h2>

      <div className="secao-missoes__lista">
        {missoes
          .filter(
            missao => !missao.concluida
          )
          .map(missao => (
            <article
              key={missao.id}
              className="secao-missoes__card"
              onClick={() =>
                setMissaoSelecionada(missao)
              }
            >
              <div className="secao-missoes__esquerda">
                <div>
                  <h3>
                    {missao.titulo}
                  </h3>

                  <p>
                    {missao.subtitulo}
                  </p>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Área da missão estilo Dark Fantasy */}
      <div className="dark-fantasy-mission">
        <div className="dark-fantasy-container">
          <div className="title">
            Jornada Sombria

            <small>
              ✦ 4 Almas, 1 Destino ✦
            </small>
          </div>

          {renderMission()}
        </div>
      </div>

      {missaoSelecionada && (
        <div
          className="secao-missoes__modal-fundo"
          onClick={() =>
            setMissaoSelecionada(null)
          }
        >
          <div
            className="secao-missoes__modal"
            onClick={evento =>
              evento.stopPropagation()
            }
          >
            <button
              type="button"
              className="secao-missoes__fechar"
              onClick={() =>
                setMissaoSelecionada(null)
              }
            >
              ✕
            </button>

            <h3>
              {missaoSelecionada.titulo}
            </h3>

            <small>
              {missaoSelecionada.local} •
              Dificuldade{' '}
              {missaoSelecionada.dificuldade}
            </small>

            <p>
              {missaoSelecionada.descricao}
            </p>

            <div className="secao-missoes__recompensas">
              <span>
                +
                {
                  missaoSelecionada.recompensaExperiencia
                }{' '}
                EXP
              </span>

              <span>
                +
                {
                  missaoSelecionada.recompensaOuro
                }{' '}
                ouro
              </span>
            </div>

            <button
              type="button"
              className="secao-missoes__concluir"
              onClick={() => {
                aoConcluirMissao(
                  missaoSelecionada.id
                );

                setMissaoSelecionada(null);
              }}
            >
              Concluir missão
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`toast ${
          showToast ? 'show' : ''
        }`}
      >
        {toastMessage}
      </div>
    </section>
  );
}