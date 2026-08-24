// src/paginas/PaginaFichaRpg.jsx

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';
import { personagemInicial } from '../dados/personagemInicial';
import { BarraModoDispositivo } from '../componentes/ficha-rpg/BarraModoDispositivo';
import { VisualizacaoDesktop } from '../componentes/ficha-rpg/VisualizacaoDesktop';
import { VisualizacaoMobile } from '../componentes/ficha-rpg/VisualizacaoMobile';
import { ModalQr } from '../componentes/ficha-rpg/ModalQr';
import { obterArtefatoArPorTerritorio } from '../dados/artefatosAr';
import { 
  carregarPersonagem, 
  salvarPersonagem, 
  sincronizarPersonagem, 
  carregarClasseEscolhida 
} from '../servicos/personagemServico';
import './PaginaFichaRpg.css';

// TERRITORIOS DEFINIDOS AQUI - FORA DO COMPONENTE
const TERRITORIOS = {
  'floresta_sombria': {
    nome: 'Floresta Sombria',
    icone: '🌲',
    poderes: [
      { id: 1, nome: 'Flecha Envenenada', tipo: 'Ataque', recarga: '6s', custo: 20, descricao: 'Dispara uma flecha que causa dano ao longo do tempo.' },
      { id: 2, nome: 'Manto das Trevas', tipo: 'Defesa', recarga: '10s', custo: 15, descricao: 'Envolve o usuário em sombras, aumentando a esquiva.' },
      { id: 3, nome: 'Chuva de Espinhos', tipo: 'Ataque em Área', recarga: '12s', custo: 30, descricao: 'Espinhos surgem do chão acertando todos os inimigos.' },
    ],
    missoes: [
      { id: 1, nome: 'Caça ao Lobo', descricao: 'Derrote 3 lobos na clareira.', recompensa: '100 XP' },
      { id: 2, nome: 'Coleta de Ervas', descricao: 'Encontre 5 ervas raras.', recompensa: 'Poção de Cura' },
    ],
    inventario: [
      { id: 1, nome: 'Poção de Cura', quantidade: 2 },
      { id: 2, nome: 'Adaga de Ferro', quantidade: 1 },
    ]
  },
  'deserto_ardente': {
    nome: 'Deserto Ardente',
    icone: '🏜️',
    poderes: [
      { id: 4, nome: 'Rajada de Fogo', tipo: 'Ataque em Área', recarga: '15s', custo: 35, descricao: 'Invoca uma onda de calor que queima inimigos próximos.' },
      { id: 5, nome: 'Miragem Enganosa', tipo: 'Fuga', recarga: '20s', custo: 10, descricao: 'Cria uma ilusão que engana os inimigos e permite recuar.' },
    ],
    missoes: [
      { id: 3, nome: 'Proteger a Caravana', descricao: 'Escorte a caravana até o oásis.', recompensa: '200 XP' },
      { id: 4, nome: 'Caça ao Escorpião Gigante', descricao: 'Derrote o escorpião que aterroriza os viajantes.', recompensa: 'Gema de Fogo' },
    ],
    inventario: [
      { id: 4, nome: 'Garrafa de Água', quantidade: 3 },
      { id: 5, nome: 'Arco Longo', quantidade: 1 },
    ]
  },
  'montanhas_geladas': {
    nome: 'Montanhas Geladas',
    icone: '❄️',
    poderes: [
      { id: 6, nome: 'Escudo de Gelo', tipo: 'Defesa', recarga: '8s', custo: 25, descricao: 'Cria uma barreira de gelo que reflete dano.' },
      { id: 7, nome: 'Fúria do Inverno', tipo: 'Ataque', recarga: '10s', custo: 30, descricao: 'Uma tempestade de gelo atinge o alvo.' },
      { id: 8, nome: 'Passo Nevado', tipo: 'Deslocamento', recarga: '5s', custo: 12, descricao: 'Desliza rapidamente sobre o gelo para se reposicionar.' },
    ],
    missoes: [
      { id: 5, nome: 'Recuperar o Cristal', descricao: 'Pegue o cristal no topo da montanha.', recompensa: 'Gema mágica' },
    ],
    inventario: [
      { id: 7, nome: 'Pele de Urso', quantidade: 1 },
      { id: 8, nome: 'Fogueira Portátil', quantidade: 2 },
    ]
  }
};

export default function PaginaFichaRpg() {
  const navigate = useNavigate();
  const { equipe } = useAuth();

  const [personagem, setPersonagem] = useState(() => {
    return carregarPersonagem();
  });

  const [modoDispositivo, setModoDispositivo] = useState('auto');
  const [habilidadesUsadas, setHabilidadesUsadas] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('poderes');
  const [mostrarModalQr, setMostrarModalQr] = useState(false);
  const [sincronizandoBanco, setSincronizandoBanco] = useState(false);
  const [mensagemSincronizacao, setMensagemSincronizacao] = useState('');

  const [territorioId, setTerritorioId] = useState('floresta_sombria');
  const dadosTerritorio = TERRITORIOS[territorioId];
  const artefatoArAtual = useMemo(
    () => obterArtefatoArPorTerritorio(territorioId, dadosTerritorio?.missoes),
    [territorioId, dadosTerritorio]
  );

  // SALVA PERSONAGEM QUANDO MUDAR
  useEffect(() => {
    if (personagem) {
      salvarPersonagem(personagem);
    }
  }, [personagem]);

  // SINCRONIZA A CLASSE AO CARREGAR A PÁGINA
  useEffect(() => {
    const classeEscolhida = carregarClasseEscolhida();

    if (classeEscolhida && personagem && classeEscolhida !== personagem.classe) {
      const template = personagemInicial[classeEscolhida];
      if (template) {
        setPersonagem({
          ...template,
          nome: personagem.nome,
        });
      }
    }
  }, []);

  const poderesDaClasse = personagem?.habilidades || [];

  function executarPoder(poder) {
    if (!personagem) return;
    
    const custo = poder.custoMana ?? 0;
    const ehUsoUnico = poder.recarga === 'Uso único';

    if (ehUsoUnico && habilidadesUsadas.includes(poder.id)) {
      alert('Este poder já foi utilizado e não pode ser usado novamente.');
      return;
    }

    if (personagem.atributos.manaAtual < custo) {
      alert('Mana insuficiente para usar esse poder.');
      return;
    }

    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      atributos: {
        ...personagemAtual.atributos,
        manaAtual: Math.max(0, personagemAtual.atributos.manaAtual - custo),
      },
    }));

    if (ehUsoUnico) {
      setHabilidadesUsadas((atual) => [...atual, poder.id]);
    }

    alert(`Você usou ${poder.nome}!`);
  }

  const poderTotal = useMemo(() => {
    if (!personagem) return 0;
    
    const bonusItens = personagem.inventario
      .filter((item) => item.equipado)
      .reduce((acumulador, item) => acumulador + (item.raridade === 'lendario' ? 100 : item.raridade === 'epico' ? 70 : 40), 0);
    return Math.round(
      personagem.atributos.forca * 10 +
      personagem.atributos.defesa * 8 +
      personagem.atributos.vidaMaxima / 4 +
      personagem.atributos.manaMaxima / 4 +
      personagem.nivel * 80 +
      bonusItens
    );
  }, [personagem]);

  function atualizarNome(novoNome) {
    if (!personagem) return;
    setPersonagem((personagemAtual) => ({ ...personagemAtual, nome: novoNome }));
  }

  function atualizarClasse(novaClasse) {
    const template = personagemInicial[novaClasse];
    if (!template) return;

    setPersonagem((personagemAtual) => ({
      ...template,
      nome: personagemAtual.nome,
    }));
  }

  function ganharExperiencia() {
    if (!personagem) return;
    
    setPersonagem((personagemAtual) => {
      let experienciaAtual = personagemAtual.experienciaAtual + 500;
      let nivel = personagemAtual.nivel;
      let experienciaMaxima = personagemAtual.experienciaMaxima;

      if (experienciaAtual >= personagemAtual.experienciaMaxima) {
        experienciaAtual -= personagemAtual.experienciaMaxima;
        nivel += 1;
        experienciaMaxima = Math.round(personagemAtual.experienciaMaxima * 1.2);
      }

      return {
        ...personagemAtual,
        nivel,
        experienciaAtual,
        experienciaMaxima,
        atributos: {
          ...personagemAtual.atributos,
          vidaMaxima: personagemAtual.atributos.vidaMaxima + 25,
          vidaAtual: personagemAtual.atributos.vidaMaxima + 25,
          manaMaxima: personagemAtual.atributos.manaMaxima + 12,
          manaAtual: personagemAtual.atributos.manaMaxima + 12,
          forca: personagemAtual.atributos.forca + 1,
          defesa: personagemAtual.atributos.defesa + 1,
        },
      };
    });
  }

  function atualizarAtributo(chave, delta) {
    if (!personagem) return;
    
    setPersonagem((personagemAtual) => {
      const atributosAtualizados = {
        ...personagemAtual.atributos,
        [chave]: Math.max(10, personagemAtual.atributos[chave] + delta)
      };

      if (chave === 'vidaMaxima') {
        atributosAtualizados.vidaAtual = Math.min(
          personagemAtual.atributos.vidaAtual + delta,
          atributosAtualizados.vidaMaxima
        );
      }

      if (chave === 'manaMaxima') {
        atributosAtualizados.manaAtual = Math.min(
          personagemAtual.atributos.manaAtual + delta,
          atributosAtualizados.manaMaxima
        );
      }

      return { ...personagemAtual, atributos: atributosAtualizados };
    });
  }

  function alternarEquipamento(idItem) {
    if (!personagem) return;
    
    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      inventario: personagemAtual.inventario.map((item) =>
        item.id === idItem ? { ...item, equipado: !item.equipado } : item
      )
    }));
  }

  function concluirMissao(idMissao) {
    if (!personagem) return;
    
    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      ouro: personagemAtual.ouro + (personagemAtual.missoes.find((missao) => missao.id === idMissao)?.recompensaOuro || 0),
      missoes: personagemAtual.missoes.map((missao) =>
        missao.id === idMissao ? { ...missao, concluida: true } : missao
      ),
    }));
  }

  function coletarArtefatoAr(artefatoAr) {
    if (!artefatoAr?.item || !personagem) {
      return false;
    }

    let itemFoiAdicionado = true;

    setPersonagem((personagemAtual) => {
      const itemJaExiste = personagemAtual.inventario.some(
        (item) => item.origemArId === artefatoAr.item.chave
      );

      if (itemJaExiste) {
        itemFoiAdicionado = false;
        return personagemAtual;
      }

      const nomeMissaoVinculada =
        artefatoAr.missaoVinculada?.nome || artefatoAr.missaoVinculada?.titulo;

      return {
        ...personagemAtual,
        inventario: [
          ...personagemAtual.inventario,
          {
            id: Date.now(),
            nome: artefatoAr.item.nome,
            raridade: artefatoAr.item.raridade,
            descricao: artefatoAr.item.descricao,
            bonus: artefatoAr.item.bonus,
            icone: artefatoAr.item.icone,
            quantidade: artefatoAr.item.quantidade ?? 1,
            equipado: false,
            origemArId: artefatoAr.item.chave,
            territorioId,
            territorioNome: dadosTerritorio.nome,
            missaoId: artefatoAr.missaoVinculada?.id ?? null,
            missaoNome: nomeMissaoVinculada || null,
            modelo3d: artefatoAr.modelo?.caminho || null,
          },
        ],
      };
    });

    return itemFoiAdicionado;
  }

  async function sincronizarComBanco() {
    if (!personagem) return;
    
    setSincronizandoBanco(true);
    try {
      const resposta = await sincronizarPersonagem(personagem);
      setMensagemSincronizacao(resposta.mensagem);
    } catch {
      setMensagemSincronizacao('Não foi possível sincronizar agora. Os dados continuam salvos localmente.');
    } finally {
      setSincronizandoBanco(false);
    }
  }

  if (!personagem) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando personagem...</p>
      </div>
    );
  }

  return (
    <div className="pagina-ficha-rpg">
      <BarraModoDispositivo
        territorios={TERRITORIOS}
        territorioAtual={territorioId}
        aoMudarTerritorio={setTerritorioId}
      />

      {mensagemSincronizacao && <div className="pagina-ficha-rpg__mensagem">{mensagemSincronizacao}</div>}

      <div className="pagina-ficha-rpg__conteudo">
        <div className="territorio-cabecalho">
          <h1>{dadosTerritorio.icone} {dadosTerritorio.nome}</h1>
          <p>Explore as habilidades e missões disponíveis nesta região.</p>
        </div>

        {modoDispositivo === 'mobile' && (
          <VisualizacaoMobile
            personagem={personagem}
            dadosTerritorio={dadosTerritorio}
            artefatoAr={artefatoArAtual}
            poderes={poderesDaClasse}
            mpAtual={personagem?.atributos?.manaAtual || 0}
            chaveDeCeraUsada={habilidadesUsadas.length > 0}
            carregandoPoderes={false}
            aoUsarPoder={executarPoder}
            poderTotal={poderTotal}
            abaAtiva={abaAtiva}
            aoSelecionarAba={setAbaAtiva}
            aoAtualizarNome={atualizarNome}
            aoGanharExperiencia={ganharExperiencia}
            aoAtualizarAtributo={atualizarAtributo}
            aoConcluirMissao={concluirMissao}
            aoAlternarEquipamento={alternarEquipamento}
            aoAbrirModalQr={() => setMostrarModalQr(true)}
            aoResgatarQr={coletarArtefatoAr}
            aoColetarArtefatoAr={coletarArtefatoAr}
          />
        )}

        {modoDispositivo === 'desktop' && (
          <VisualizacaoDesktop
            personagem={personagem}
            dadosTerritorio={dadosTerritorio}
            artefatoAr={artefatoArAtual}
            poderes={poderesDaClasse}
            mpAtual={personagem?.atributos?.manaAtual || 0}
            chaveDeCeraUsada={habilidadesUsadas.length > 0}
            carregandoPoderes={false}
            aoUsarPoder={executarPoder}
            poderTotal={poderTotal}
            abaAtiva={abaAtiva}
            aoSelecionarAba={setAbaAtiva}
            aoAtualizarNome={atualizarNome}
            aoGanharExperiencia={ganharExperiencia}
            aoAtualizarAtributo={atualizarAtributo}
            aoConcluirMissao={concluirMissao}
            aoAlternarEquipamento={alternarEquipamento}
            aoAbrirModalQr={() => setMostrarModalQr(true)}
            aoResgatarQr={coletarArtefatoAr}
            aoColetarArtefatoAr={coletarArtefatoAr}
          />
        )}

        {modoDispositivo === 'auto' && (
          <>
            <div className="pagina-ficha-rpg__somente-mobile">
              <VisualizacaoMobile
                personagem={personagem}
                dadosTerritorio={dadosTerritorio}
                artefatoAr={artefatoArAtual}
                poderes={poderesDaClasse}
                mpAtual={personagem?.atributos?.manaAtual || 0}
                chaveDeCeraUsada={habilidadesUsadas.length > 0}
                carregandoPoderes={false}
                aoUsarPoder={executarPoder}
                poderTotal={poderTotal}
                abaAtiva={abaAtiva}
                aoSelecionarAba={setAbaAtiva}
                aoAtualizarNome={atualizarNome}
                aoGanharExperiencia={ganharExperiencia}
                aoAtualizarAtributo={atualizarAtributo}
                aoConcluirMissao={concluirMissao}
                aoAlternarEquipamento={alternarEquipamento}
                aoAbrirModalQr={() => setMostrarModalQr(true)}
                aoResgatarQr={coletarArtefatoAr}
                aoColetarArtefatoAr={coletarArtefatoAr}
              />
            </div>
            <div className="pagina-ficha-rpg__somente-desktop">
              <VisualizacaoDesktop
                personagem={personagem}
                dadosTerritorio={dadosTerritorio}
                artefatoAr={artefatoArAtual}
                poderes={poderesDaClasse}
                mpAtual={personagem?.atributos?.manaAtual || 0}
                chaveDeCeraUsada={habilidadesUsadas.length > 0}
                carregandoPoderes={false}
                aoUsarPoder={executarPoder}
                poderTotal={poderTotal}
                abaAtiva={abaAtiva}
                aoSelecionarAba={setAbaAtiva}
                aoAtualizarNome={atualizarNome}
                aoGanharExperiencia={ganharExperiencia}
                aoAtualizarAtributo={atualizarAtributo}
                aoConcluirMissao={concluirMissao}
                aoAlternarEquipamento={alternarEquipamento}
                aoAbrirModalQr={() => setMostrarModalQr(true)}
                aoResgatarQr={coletarArtefatoAr}
                aoColetarArtefatoAr={coletarArtefatoAr}
              />
            </div>
          </>
        )}
      </div>

      {mostrarModalQr && (
        <ModalQr
          personagem={personagem}
          poderTotal={poderTotal}
          aoFechar={() => setMostrarModalQr(false)}
        />
      )}
    </div>
  );
}