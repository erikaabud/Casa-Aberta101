import { useEffect, useMemo, useState } from 'react';
import { personagemInicial } from '../dados/personagemInicial';
import { BarraModoDispositivo } from '../componentes/ficha-rpg/BarraModoDispositivo';
import { VisualizacaoDesktop } from '../componentes/ficha-rpg/VisualizacaoDesktop';
import { VisualizacaoMobile } from '../componentes/ficha-rpg/VisualizacaoMobile';
import { ModalQr } from '../componentes/ficha-rpg/ModalQr';
import { carregarPersonagem, salvarPersonagem, sincronizarPersonagem } from '../servicos/personagemServico';
import './PaginaFichaRpg.css';

export default function PaginaFichaRpg() {
  const [personagem, setPersonagem] = useState(() => carregarPersonagem() || personagemInicial);
  const [modoDispositivo, setModoDispositivo] = useState('auto');
  const [abaAtiva, setAbaAtiva] = useState('poderes');
  const [mostrarModalQr, setMostrarModalQr] = useState(false);
  const [sincronizandoBanco, setSincronizandoBanco] = useState(false);
  const [mensagemSincronizacao, setMensagemSincronizacao] = useState('');

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
      <BarraModoDispositivo modoDispositivo={modoDispositivo} aoAlterarModo={setModoDispositivo} aoSincronizarBanco={sincronizarComBanco} sincronizandoBanco={sincronizandoBanco} />
      {mensagemSincronizacao && <div className="pagina-ficha-rpg__mensagem">{mensagemSincronizacao}</div>}
      <div className="pagina-ficha-rpg__conteudo">
        {modoDispositivo === 'mobile' && <VisualizacaoMobile personagem={personagem} poderTotal={poderTotal} abaAtiva={abaAtiva} aoSelecionarAba={setAbaAtiva} aoAtualizarNome={atualizarNome} aoAtualizarClasse={atualizarClasse} aoGanharExperiencia={ganharExperiencia} aoAtualizarAtributo={atualizarAtributo} aoConcluirMissao={concluirMissao} aoAlternarEquipamento={alternarEquipamento} aoAbrirModalQr={() => setMostrarModalQr(true)} aoResgatarQr={resgatarQr} />}
        {modoDispositivo === 'desktop' && <VisualizacaoDesktop personagem={personagem} poderTotal={poderTotal} abaAtiva={abaAtiva} aoSelecionarAba={setAbaAtiva} aoAtualizarNome={atualizarNome} aoAtualizarClasse={atualizarClasse} aoGanharExperiencia={ganharExperiencia} aoAtualizarAtributo={atualizarAtributo} aoConcluirMissao={concluirMissao} aoAlternarEquipamento={alternarEquipamento} aoAbrirModalQr={() => setMostrarModalQr(true)} aoResgatarQr={resgatarQr} />}
        {modoDispositivo === 'auto' && (
          <>
            <div className="pagina-ficha-rpg__somente-mobile"><VisualizacaoMobile personagem={personagem} poderTotal={poderTotal} abaAtiva={abaAtiva} aoSelecionarAba={setAbaAtiva} aoAtualizarNome={atualizarNome} aoAtualizarClasse={atualizarClasse} aoGanharExperiencia={ganharExperiencia} aoAtualizarAtributo={atualizarAtributo} aoConcluirMissao={concluirMissao} aoAlternarEquipamento={alternarEquipamento} aoAbrirModalQr={() => setMostrarModalQr(true)} aoResgatarQr={resgatarQr} /></div>
            <div className="pagina-ficha-rpg__somente-desktop"><VisualizacaoDesktop personagem={personagem} poderTotal={poderTotal} abaAtiva={abaAtiva} aoSelecionarAba={setAbaAtiva} aoAtualizarNome={atualizarNome} aoAtualizarClasse={atualizarClasse} aoGanharExperiencia={ganharExperiencia} aoAtualizarAtributo={atualizarAtributo} aoConcluirMissao={concluirMissao} aoAlternarEquipamento={alternarEquipamento} aoAbrirModalQr={() => setMostrarModalQr(true)} aoResgatarQr={resgatarQr} /></div>
          </>
        )}
      </div>
      {mostrarModalQr && <ModalQr personagem={personagem} poderTotal={poderTotal} aoFechar={() => setMostrarModalQr(false)} />}
    </div>
  );
}
