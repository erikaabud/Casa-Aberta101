import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contextos/AuthContext';
import { BarraModoDispositivo } from '../componentes/ficha-rpg/BarraModoDispositivo';
import { VisualizacaoDesktop } from '../componentes/ficha-rpg/VisualizacaoDesktop';
import { VisualizacaoMobile } from '../componentes/ficha-rpg/VisualizacaoMobile';
import { ModalQr } from '../componentes/ficha-rpg/ModalQr';
import { coletarItemHiro, obterMinhaFicha } from '../servicos/jogoApi';
import './PaginaFichaRpg.css';

const ICONES_REGIAO = {
  floresta_sombria: '🌲',
  deserto_ardente: '🏜️',
  montanhas_geladas: '❄️',
};

export default function PaginaFichaRpg() {
  const { equipe } = useAuth();
  const [ficha, setFicha] = useState(null);
  const [modoDispositivo, setModoDispositivo] = useState('auto');
  const [abaAtiva, setAbaAtiva] = useState('missoes');
  const [mostrarModalQr, setMostrarModalQr] = useState(false);
  const [mensagemSistema, setMensagemSistema] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [territorioId, setTerritorioId] = useState('');
  const [missaoSelecionadaId, setMissaoSelecionadaId] = useState(null);

  async function carregarFicha() {
    setCarregando(true);
    try {
      const resposta = await obterMinhaFicha();
      setFicha(resposta);
      setMensagemSistema('');

      const primeiraRegiao = resposta?.regioes?.[0];
      setTerritorioId((atual) => atual || primeiraRegiao?.slug || '');
    } catch (erro) {
      setMensagemSistema(erro?.message || 'Não foi possível carregar a ficha do jogo.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFicha();
  }, []);

  const territorios = useMemo(() => {
    return (ficha?.regioes || []).reduce((acumulador, regiao) => {
      acumulador[regiao.slug] = {
        nome: regiao.nome_regiao,
        icone: ICONES_REGIAO[regiao.slug] || '🗺️',
      };
      return acumulador;
    }, {});
  }, [ficha]);

  const dadosTerritorio = useMemo(
    () => ficha?.regioes?.find((regiao) => regiao.slug === territorioId) || ficha?.regioes?.[0] || null,
    [ficha, territorioId],
  );

  useEffect(() => {
    if (!dadosTerritorio?.missoes?.length) {
      setMissaoSelecionadaId(null);
      return;
    }

    setMissaoSelecionadaId((atual) => {
      const existe = dadosTerritorio.missoes.some((missao) => missao.id_missao === atual);
      if (existe) return atual;
      return dadosTerritorio.missoes.find((missao) => !missao.concluida)?.id_missao || dadosTerritorio.missoes[0]?.id_missao || null;
    });
  }, [dadosTerritorio]);

  const missaoSelecionada = useMemo(
    () => dadosTerritorio?.missoes?.find((missao) => missao.id_missao === missaoSelecionadaId) || null,
    [dadosTerritorio, missaoSelecionadaId],
  );

  const itemSelecionado = useMemo(
    () => missaoSelecionada?.itens?.find((item) => !item.coletado_por_usuario) || null,
    [missaoSelecionada],
  );

  async function lidarColeta(item) {
    const resposta = await coletarItemHiro(item.id_item);
    await carregarFicha();
    setMensagemSistema(resposta?.mensagem || 'Item coletado com sucesso.');
    return resposta;
  }

  if (carregando || !ficha?.personagem) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando ficha do jogo...</p>
      </div>
    );
  }

  return (
    <div className="pagina-ficha-rpg">
      <BarraModoDispositivo
        territorios={territorios}
        territorioAtual={territorioId || Object.keys(territorios)[0]}
        aoMudarTerritorio={setTerritorioId}
      />

      {mensagemSistema && <div className="pagina-ficha-rpg__mensagem">{mensagemSistema}</div>}

      <div className="pagina-ficha-rpg__conteudo">
        <div className="territorio-cabecalho">
          <h1>{territorios[dadosTerritorio?.slug]?.icone || '🗺️'} {dadosTerritorio?.nome_regiao || 'Região'}</h1>
          <p>{dadosTerritorio?.descricao_regiao || 'Selecione uma região para ver as missões e os itens coletáveis.'}</p>
        </div>

        {modoDispositivo === 'mobile' && (
          <VisualizacaoMobile
            personagem={ficha.personagem}
            equipe={ficha.equipe || equipe}
            membros={ficha.membros || []}
            dadosTerritorio={dadosTerritorio}
            missaoSelecionadaId={missaoSelecionadaId}
            abaAtiva={abaAtiva}
            aoSelecionarAba={setAbaAtiva}
            aoAbrirModalQr={() => setMostrarModalQr(true)}
            aoSelecionarMissao={setMissaoSelecionadaId}
            inventario={ficha.inventario || []}
          />
        )}

        {modoDispositivo === 'desktop' && (
          <VisualizacaoDesktop
            personagem={ficha.personagem}
            equipe={ficha.equipe || equipe}
            membros={ficha.membros || []}
            dadosTerritorio={dadosTerritorio}
            missaoSelecionadaId={missaoSelecionadaId}
            abaAtiva={abaAtiva}
            aoSelecionarAba={setAbaAtiva}
            aoAbrirModalQr={() => setMostrarModalQr(true)}
            aoSelecionarMissao={setMissaoSelecionadaId}
            inventario={ficha.inventario || []}
          />
        )}

        {modoDispositivo === 'auto' && (
          <>
            <div className="pagina-ficha-rpg__somente-mobile">
              <VisualizacaoMobile
                personagem={ficha.personagem}
                equipe={ficha.equipe || equipe}
                membros={ficha.membros || []}
                dadosTerritorio={dadosTerritorio}
                missaoSelecionadaId={missaoSelecionadaId}
                abaAtiva={abaAtiva}
                aoSelecionarAba={setAbaAtiva}
                aoAbrirModalQr={() => setMostrarModalQr(true)}
                aoSelecionarMissao={setMissaoSelecionadaId}
                inventario={ficha.inventario || []}
              />
            </div>
            <div className="pagina-ficha-rpg__somente-desktop">
              <VisualizacaoDesktop
                personagem={ficha.personagem}
                equipe={ficha.equipe || equipe}
                membros={ficha.membros || []}
                dadosTerritorio={dadosTerritorio}
                missaoSelecionadaId={missaoSelecionadaId}
                abaAtiva={abaAtiva}
                aoSelecionarAba={setAbaAtiva}
                aoAbrirModalQr={() => setMostrarModalQr(true)}
                aoSelecionarMissao={setMissaoSelecionadaId}
                inventario={ficha.inventario || []}
              />
            </div>
          </>
        )}
      </div>

      {mostrarModalQr && (
        <ModalQr
          regiao={dadosTerritorio}
          missao={missaoSelecionada}
          item={itemSelecionado}
          aoColetar={lidarColeta}
          aoFechar={() => setMostrarModalQr(false)}
        />
      )}
    </div>
  );
}
