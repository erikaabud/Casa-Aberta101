import { CabecalhoFicha } from './CabecalhoFicha';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import './VisualizacaoDesktop.css';
import './VisualizacaoPoderes.css';

const abas = [
  { id: 'missoes', rotulo: 'Missões' },
  { id: 'inventario', rotulo: 'Inventário' },
  { id: 'qrcode', rotulo: 'QR Code' },
];

export function VisualizacaoDesktop({
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
    <section className="visualizacao-desktop">
      <aside className="visualizacao-desktop__lateral">
        <CabecalhoFicha
          nome={personagem.nome}
          classePersonagem={personagem.classe}
          equipe={equipe}
          membros={membros}
        />
      </aside>

      <main className="visualizacao-desktop__conteudo">
        <div className="visualizacao-desktop__abas">
          {abas.map((aba) => (
            <button 
              type="button" 
              key={aba.id} 
              className={abaAtiva === aba.id ? 'ativo' : ''} 
              onClick={() => aoSelecionarAba(aba.id)}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        <div className="visualizacao-desktop__corpo">
          {abaAtiva === 'missoes' && (
            <SecaoMissoes
              missoes={dadosTerritorio?.missoes || []}
              missaoSelecionadaId={missaoSelecionadaId}
              aoSelecionarMissao={aoSelecionarMissao}
            />
          )}

          {abaAtiva === 'inventario' && (
            <VisualizacaoInventario
              inventario={inventario}
            />
          )}

          {abaAtiva === 'qrcode' && (
            <section className="visualizacao-poderes">
              <h2>Leitor do marcador</h2>
              <p>
                O leitor foi movido para um modal dedicado. Abra o modal,
                mostre o marcador `hiro` e colete o item atual da missão.
              </p>
              <button type="button" className="visualizacao-poderes__botao" onClick={aoAbrirModalQr}>
                Abrir leitor QR
              </button>
            </section>
          )}
        </div>
      </main>
    </section>
  );
}
