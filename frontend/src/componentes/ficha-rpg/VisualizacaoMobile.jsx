import { CabecalhoFicha } from './CabecalhoFicha';
import { NavegacaoInferior } from './NavegacaoInferior';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { LeitorQr } from './LeitorQr';
import './VisualizacaoMobile.css';

export function VisualizacaoMobile({
  personagem,
  dadosTerritorio,
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
      />

      <div className="visualizacao-mobile__rolagem">

        {abaAtiva === 'inventario' && (
          <VisualizacaoInventario
            inventario={personagem.inventario}
            aoAlternarEquipamento={aoAlternarEquipamento}
          />
        )}

        {abaAtiva === 'missoes' && (
          <SecaoMissoes
            missoes={dadosTerritorio.missoes}
            aoConcluirMissao={aoConcluirMissao}
          />
        )}

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