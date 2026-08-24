import { CabecalhoFicha } from './CabecalhoFicha';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { LeitorQr } from './LeitorQr';
import './VisualizacaoDesktop.css';

const abas = [
  { id: 'poderes', rotulo: 'Poderes' },
  { id: 'inventario', rotulo: 'Inventário' },
  { id: 'missoes', rotulo: 'Missões' },
  { id: 'qrcode', rotulo: 'QR Code' },
];

export function VisualizacaoDesktop({
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
    <section className="visualizacao-desktop">
      <aside className="visualizacao-desktop__lateral">
        <CabecalhoFicha nome={personagem.nome} classePersonagem={personagem.classe} aoAtualizarNome={aoAtualizarNome} aoAtualizarClasse={aoAtualizarClasse} />
      <main className="visualizacao-desktop__conteudo">
        <div className="visualizacao-desktop__abas">
          {abas.map((aba) => (
            <button type="button" key={aba.id} className={abaAtiva === aba.id ? 'ativo' : ''} onClick={() => aoSelecionarAba(aba.id)}>{aba.rotulo}</button>
          ))}
        </div>

        <div className="visualizacao-desktop__corpo">
          {/* --- TROCA DE DADOS PARA O TERRITÓRIO --- */}

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
      </main>
      </aside>
    </section>
  );
}
