import { CabecalhoFicha } from './CabecalhoFicha';
import { GradeAtributos } from './GradeAtributos';
import { SecaoMissoes } from './SecaoMissoes';
import { VisualizacaoInventario } from './VisualizacaoInventario';
import { VisualizacaoPoderes } from './VisualizacaoPoderes';
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
  dadosTerritorio, // <--- ADICIONADO AQUI
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
    <section className="visualizacao-desktop">
      <aside className="visualizacao-desktop__lateral">
        <CabecalhoFicha nome={personagem.nome} classePersonagem={personagem.classe} aoAtualizarNome={aoAtualizarNome} aoAtualizarClasse={aoAtualizarClasse} />
        <GradeAtributos atributos={personagem.atributos} aoAtualizarAtributo={aoAtualizarAtributo} />
      </aside>
      
      <main className="visualizacao-desktop__conteudo">
        <div className="visualizacao-desktop__abas">
          {abas.map((aba) => (
            <button type="button" key={aba.id} className={abaAtiva === aba.id ? 'ativo' : ''} onClick={() => aoSelecionarAba(aba.id)}>{aba.rotulo}</button>
          ))}
        </div>
        
        <div className="visualizacao-desktop__corpo">
          {/* --- TROCA DE DADOS PARA O TERRITÓRIO --- */}
          
          {abaAtiva === 'poderes' && (
            <VisualizacaoPoderes habilidades={dadosTerritorio.poderes} />
          )}
          
          {abaAtiva === 'inventario' && (
            <VisualizacaoInventario 
              inventario={dadosTerritorio.inventario} 
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
              personagem={personagem} 
              poderTotal={poderTotal} 
              aoGanharExperiencia={aoGanharExperiencia} 
              aoResgatarQr={aoResgatarQr} 
              aoAbrirModalQr={aoAbrirModalQr} 
            />
          )}
        </div>
      </main>
    </section>
  );
}