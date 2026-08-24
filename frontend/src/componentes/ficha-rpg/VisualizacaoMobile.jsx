import { CabecalhoFicha } from './CabecalhoFicha';
import { NavegacaoInferior } from './NavegacaoInferior';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import './VisualizacaoMobile.css';
import './VisualizacaoPoderes.css';

export function VisualizacaoMobile({
  personagem,
  equipe,
  membros,
  dadosTerritorio,
  missaoSelecionadaId,
  abaAtiva,
  aoSelecionarAba,
  aoSelecionarMissao,
  aoAbrirModalQr,
  inventario,
}) {
  return (
    <section className="visualizacao-mobile">
      <CabecalhoFicha
        nome={personagem.nome}
        classePersonagem={personagem.classe}
        equipe={equipe}
        membros={membros}
      />

      <div className="visualizacao-mobile__rolagem">
        {abaAtiva === 'inventario' && (
          <VisualizacaoInventario
            inventario={inventario}
          />
        )}

        {abaAtiva === 'missoes' && (
          <SecaoMissoes
            missoes={dadosTerritorio?.missoes || []}
            missaoSelecionadaId={missaoSelecionadaId}
            aoSelecionarMissao={aoSelecionarMissao}
          />
        )}

        {abaAtiva === 'qrcode' && (
          <section className="visualizacao-poderes">
            <h2>Leitor de marcador</h2>
            <p>
              Abra o modal para usar a câmera, ler o marcador `hiro`
              e coletar o próximo item da missão selecionada.
            </p>
            <button type="button" className="visualizacao-poderes__botao" onClick={aoAbrirModalQr}>
              Abrir leitor QR
            </button>
          </section>
        )}
      </div>

      <NavegacaoInferior
        abaAtiva={abaAtiva}
        aoSelecionarAba={aoSelecionarAba}
      />
    </section>
  );
}
