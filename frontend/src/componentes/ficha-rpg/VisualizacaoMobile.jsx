import { CabecalhoFicha } from './CabecalhoFicha';
import { GradeAtributos } from './GradeAtributos';
import { NavegacaoInferior } from './NavegacaoInferior';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { VisualizacaoPoderes } from './VisualizacaoPoderes';
import { LeitorQr } from './LeitorQr';
import './VisualizacaoMobile.css';

export function VisualizacaoMobile({ 
  personagem, 
  dadosTerritorio, // <--- ADICIONADO
  poderTotal, 
  abaAtiva, 
  aoSelecionarAba, 
  aoAtualizarNome, 
  aoAtualizarClasse, 
  aoGanharExperiencia, 
  aoAtualizarAtributo, 
  aoConcluirMissao, 
  aoAlternarEquipamento, 
  aoAbrirModalQr, 
  aoResgatarQr 
}) {
  return (
    <section className="visualizacao-mobile">
      <CabecalhoFicha 
        nome={personagem.nome} 
        classePersonagem={personagem.classe} 
        aoAtualizarNome={aoAtualizarNome} 
        aoAtualizarClasse={aoAtualizarClasse} 
      />
      
      <div className="visualizacao-mobile__rolagem">
        {/* --- PODERES (TROCADO PARA dadosTerritorio.poderes) --- */}
        {abaAtiva === 'poderes' && (
          <>
            <GradeAtributos 
              atributos={personagem.atributos} 
              aoAtualizarAtributo={aoAtualizarAtributo} 
            />
            <VisualizacaoPoderes habilidades={dadosTerritorio.poderes} />
          </>
        )}
        
        {/* --- INVENTÁRIO (TROCADO PARA dadosTerritorio.inventario) --- */}
        {abaAtiva === 'inventario' && (
          <VisualizacaoInventario 
            inventario={dadosTerritorio.inventario} 
            aoAlternarEquipamento={aoAlternarEquipamento} 
          />
        )}
        
        {/* --- MISSÕES (TROCADO PARA dadosTerritorio.missoes) --- */}
        {abaAtiva === 'missoes' && (
          <SecaoMissoes 
            missoes={dadosTerritorio.missoes} 
            aoConcluirMissao={aoConcluirMissao} 
          />
        )}
        
        {/* --- QR CODE (Mantido igual, pois é ação, não dado) --- */}
        {abaAtiva === 'qrcode' && (
          <LeitorQr 
            personagem={personagem} 
            poderTotal={poderTotal} 
            aoGanharExperiencia={aoGanharExperiencia} 
            aoResgatarQr={aoResgatarQr} 
            aoAbrirModalQr={aoAbrirModalQr} 
          />
        )}
      </div>
      
      <NavegacaoInferior 
        abaAtiva={abaAtiva} 
        aoSelecionarAba={aoSelecionarAba} 
      />
    </section>
  );
}