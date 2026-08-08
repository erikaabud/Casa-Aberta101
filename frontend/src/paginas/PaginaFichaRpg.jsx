import { useEffect, useMemo, useState } from 'react';
import { personagemInicial } from '../dados/personagemInicial';
import { BarraModoDispositivo } from '../componentes/ficha-rpg/BarraModoDispositivo';
import { VisualizacaoDesktop } from '../componentes/ficha-rpg/VisualizacaoDesktop';
import { VisualizacaoMobile } from '../componentes/ficha-rpg/VisualizacaoMobile';
import { ModalQr } from '../componentes/ficha-rpg/ModalQr';
import { carregarPersonagem, salvarPersonagem, sincronizarPersonagem } from '../servicos/personagemServico';
import './PaginaFichaRpg.css';

// --- DADOS DOS 3 TERRITÓRIOS ---
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
  const [personagem, setPersonagem] = useState(() => carregarPersonagem() || personagemInicial);
  const [modoDispositivo, setModoDispositivo] = useState('auto');
  const [abaAtiva, setAbaAtiva] = useState('poderes');
  const [mostrarModalQr, setMostrarModalQr] = useState(false);
  const [sincronizandoBanco, setSincronizandoBanco] = useState(false);
  const [mensagemSincronizacao, setMensagemSincronizacao] = useState('');

  // --- NOVO: Estado do Território ---
  const [territorioId, setTerritorioId] = useState('floresta_sombria');
  const dadosTerritorio = TERRITORIOS[territorioId];

  useEffect(() => { salvarPersonagem(personagem); }, [personagem]);

  const poderTotal = useMemo(() => {
    const bonusItens = personagem.inventario.filter((item) => item.equipado).reduce((acumulador, item) => acumulador + (item.raridade === 'lendario' ? 100 : item.raridade === 'epico' ? 70 : 40), 0);
    return Math.round(personagem.atributos.forca * 10 + personagem.atributos.defesa * 8 + personagem.atributos.vidaMaxima / 4 + personagem.atributos.manaMaxima / 4 + personagem.nivel * 80 + bonusItens);
  }, [personagem]);

  function atualizarNome(novoNome) { setPersonagem((personagemAtual) => ({ ...personagemAtual, nome: novoNome })); }

  function atualizarClasse(novaClasse) {
    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      classe: novaClasse,
      atributos: {
        ...personagemAtual.atributos,
        forca: novaClasse === 'Guerreiro' ? personagemAtual.atributos.forca + 2 : personagemAtual.atributos.forca,
        defesa: novaClasse === 'Paladino' ? personagemAtual.atributos.defesa + 2 : personagemAtual.atributos.defesa,
        manaMaxima: ['Mago', 'Necromante'].includes(novaClasse) ? personagemAtual.atributos.manaMaxima + 40 : personagemAtual.atributos.manaMaxima,
      },
    }));
  }

  function ganharExperiencia() {
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
    setPersonagem((personagemAtual) => {
      const atributosAtualizados = { ...personagemAtual.atributos, [chave]: Math.max(10, personagemAtual.atributos[chave] + delta) };
      if (chave === 'vidaMaxima') atributosAtualizados.vidaAtual = Math.min(personagemAtual.atributos.vidaAtual + delta, atributosAtualizados.vidaMaxima);
      if (chave === 'manaMaxima') atributosAtualizados.manaAtual = Math.min(personagemAtual.atributos.manaAtual + delta, atributosAtualizados.manaMaxima);
      return { ...personagemAtual, atributos: atributosAtualizados };
    });
  }

  function alternarEquipamento(idItem) {
    setPersonagem((personagemAtual) => ({ ...personagemAtual, inventario: personagemAtual.inventario.map((item) => item.id === idItem ? { ...item, equipado: !item.equipado } : item) }));
  }

  function concluirMissao(idMissao) {
    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      ouro: personagemAtual.ouro + (personagemAtual.missoes.find((missao) => missao.id === idMissao)?.recompensaOuro || 0),
      missoes: personagemAtual.missoes.map((missao) => missao.id === idMissao ? { ...missao, concluida: true } : missao),
    }));
  }

  function resgatarQr() {
    setPersonagem((personagemAtual) => ({
      ...personagemAtual,
      ouro: personagemAtual.ouro + 25,
      inventario: [
        ...personagemAtual.inventario,
        { id: Date.now(), nome: 'Relíquia Resgatada', raridade: 'epico', descricao: 'Item obtido por um QR Code escaneado.', bonus: '+15 de ataque', icone: 'espada', equipado: false },
      ],
    }));
  }

  async function sincronizarComBanco() {
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

  return (
    <div className="pagina-ficha-rpg">
      <BarraModoDispositivo 
        territorios={TERRITORIOS} 
        territorioAtual={territorioId} 
        aoMudarTerritorio={setTerritorioId} 
      />

      {mensagemSincronizacao && <div className="pagina-ficha-rpg__mensagem">{mensagemSincronizacao}</div>}
      
      <div className="pagina-ficha-rpg__conteudo">
        
        {/* CABEÇALHO DO TERRITÓRIO */}
        <div className="territorio-cabecalho">
          <h1>{dadosTerritorio.icone} {dadosTerritorio.nome}</h1>
          <p>Explore as habilidades e missões disponíveis nesta região.</p>
        </div>

        {/* 
           ATENÇÃO: 
           Estou passando 'dadosTerritorio' para as Visualizações. 
           Você PRECISA ir no arquivo VisualizacaoDesktop.jsx e VisualizacaoMobile.jsx 
           e receber essa prop nas funções, senão nada muda na tela.
        */}
        {modoDispositivo === 'mobile' && (
          <VisualizacaoMobile 
            personagem={personagem} 
            dadosTerritorio={dadosTerritorio} // <-- NOVO
            poderTotal={poderTotal} 
            abaAtiva={abaAtiva} 
            aoSelecionarAba={setAbaAtiva} 
            aoAtualizarNome={atualizarNome} 
            aoAtualizarClasse={atualizarClasse} 
            aoGanharExperiencia={ganharExperiencia} 
            aoAtualizarAtributo={atualizarAtributo} 
            aoConcluirMissao={concluirMissao} 
            aoAlternarEquipamento={alternarEquipamento} 
            aoAbrirModalQr={() => setMostrarModalQr(true)} 
            aoResgatarQr={resgatarQr} 
          />
        )}
        
        {modoDispositivo === 'desktop' && (
          <VisualizacaoDesktop 
            personagem={personagem} 
            dadosTerritorio={dadosTerritorio} // <-- NOVO
            poderTotal={poderTotal} 
            abaAtiva={abaAtiva} 
            aoSelecionarAba={setAbaAtiva} 
            aoAtualizarNome={atualizarNome} 
            aoAtualizarClasse={atualizarClasse} 
            aoGanharExperiencia={ganharExperiencia} 
            aoAtualizarAtributo={atualizarAtributo} 
            aoConcluirMissao={concluirMissao} 
            aoAlternarEquipamento={alternarEquipamento} 
            aoAbrirModalQr={() => setMostrarModalQr(true)} 
            aoResgatarQr={resgatarQr} 
          />
        )}
        
        {modoDispositivo === 'auto' && (
          <>
            <div className="pagina-ficha-rpg__somente-mobile">
              <VisualizacaoMobile 
                personagem={personagem} 
                dadosTerritorio={dadosTerritorio} // <-- NOVO
                poderTotal={poderTotal} 
                abaAtiva={abaAtiva} 
                aoSelecionarAba={setAbaAtiva} 
                aoAtualizarNome={atualizarNome} 
                aoAtualizarClasse={atualizarClasse} 
                aoGanharExperiencia={ganharExperiencia} 
                aoAtualizarAtributo={atualizarAtributo} 
                aoConcluirMissao={concluirMissao} 
                aoAlternarEquipamento={alternarEquipamento} 
                aoAbrirModalQr={() => setMostrarModalQr(true)} 
                aoResgatarQr={resgatarQr} 
              />
            </div>
            <div className="pagina-ficha-rpg__somente-desktop">
              <VisualizacaoDesktop 
                personagem={personagem} 
                dadosTerritorio={dadosTerritorio} // <-- NOVO
                poderTotal={poderTotal} 
                abaAtiva={abaAtiva} 
                aoSelecionarAba={setAbaAtiva} 
                aoAtualizarNome={atualizarNome} 
                aoAtualizarClasse={atualizarClasse} 
                aoGanharExperiencia={ganharExperiencia} 
                aoAtualizarAtributo={atualizarAtributo} 
                aoConcluirMissao={concluirMissao} 
                aoAlternarEquipamento={alternarEquipamento} 
                aoAbrirModalQr={() => setMostrarModalQr(true)} 
                aoResgatarQr={resgatarQr} 
              />
            </div>
          </>
        )}
      </div>
      
      {mostrarModalQr && <ModalQr personagem={personagem} poderTotal={poderTotal} aoFechar={() => setMostrarModalQr(false)} />}
    </div>
  );
}