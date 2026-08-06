import { CabecalhoFicha } from './CabecalhoFicha';
import { GradeAtributos } from './GradeAtributos';
import { NavegacaoInferior } from './NavegacaoInferior';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { VisualizacaoPoderes } from './VisualizacaoPoderes';
import { LeitorQr } from './LeitorQr';
import './VisualizacaoMobile.css';

export function VisualizacaoMobile({ personagem, poderTotal, abaAtiva, aoSelecionarAba, aoAtualizarNome, aoAtualizarClasse, aoGanharExperiencia, aoAtualizarAtributo, aoConcluirMissao, aoAlternarEquipamento, aoAbrirModalQr, aoResgatarQr }) {
  return (
    <section className="visualizacao-mobile">
      <CabecalhoFicha nome={personagem.nome} classePersonagem={personagem.classe} aoAtualizarNome={aoAtualizarNome} aoAtualizarClasse={aoAtualizarClasse} />
      <div className="visualizacao-mobile__rolagem">
        {abaAtiva === 'poderes' && (<><GradeAtributos atributos={personagem.atributos} aoAtualizarAtributo={aoAtualizarAtributo} /><VisualizacaoPoderes habilidades={personagem.habilidades} /></>)}
        {abaAtiva === 'inventario' && <VisualizacaoInventario inventario={personagem.inventario} aoAlternarEquipamento={aoAlternarEquipamento} />}
        {abaAtiva === 'missoes' && <SecaoMissoes missoes={personagem.missoes} aoConcluirMissao={aoConcluirMissao} />}
        {abaAtiva === 'qrcode' && <LeitorQr personagem={personagem} poderTotal={poderTotal} aoGanharExperiencia={aoGanharExperiencia} aoResgatarQr={aoResgatarQr} aoAbrirModalQr={aoAbrirModalQr} />}
      </div>
      <NavegacaoInferior abaAtiva={abaAtiva} aoSelecionarAba={aoSelecionarAba} />
    </section>
  );
}
