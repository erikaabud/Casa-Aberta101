import { CabecalhoFicha } from './CabecalhoFicha';
import { NavegacaoInferior } from './NavegacaoInferior';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { LeitorQr } from './LeitorQr';
import './VisualizacaoMobile.css';

export function VisualizacaoMobile({
  personagem,
  dadosTerritorio, // <--- ADICIONADO
  artefatoAr,
  abaAtiva,
  aoSelecionarAba,
  aoAtualizarNome,
  aoAtualizarClasse,
  aoConcluirMissao,
  aoAlternarEquipamento,
  aoColetarArtefatoAr
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

        {/* --- INVENTÁRIO (TROCADO PARA dadosTerritorio.inventario) --- */}
        {abaAtiva === 'inventario' && (
          <VisualizacaoInventario
            inventario={personagem.inventario}
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
            dadosTerritorio={dadosTerritorio}
            artefatoAr={artefatoAr}
            aoColetarArtefatoAr={aoColetarArtefatoAr}
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
