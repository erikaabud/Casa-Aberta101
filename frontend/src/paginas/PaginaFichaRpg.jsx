import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';
import { BarraModoDispositivo } from '../componentes/ficha-rpg/BarraModoDispositivo';
import { VisualizacaoDesktop } from '../componentes/ficha-rpg/VisualizacaoDesktop';
import { VisualizacaoMobile } from '../componentes/ficha-rpg/VisualizacaoMobile';
import { ModalQr } from '../componentes/ficha-rpg/ModalQr';
import { TelaVitoria } from '../componentes/ficha-rpg/TelaVitoria';
import { coletarItemHiro, obterMinhaFicha } from '../servicos/jogoApi';
import { precacheModelos3d } from '../servicos/precarregarModelos3d';
import './PaginaFichaRpg.css';

const ICONES_REGIAO = {
  floresta_sombria: '🌲',
  deserto_ardente: '🏜️',
  montanhas_geladas: '❄️',
  casa_aberta: '🏠',
};

export default function PaginaFichaRpg() {
  const navegar = useNavigate();
  const { equipe, sair } = useAuth();
  const [ficha, setFicha] = useState(null);
  const [modoDispositivo, setModoDispositivo] = useState('auto');
  const [abaAtiva, setAbaAtiva] = useState('missoes');
  const [mostrarModalQr, setMostrarModalQr] = useState(false);
  const [mensagemSistema, setMensagemSistema] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [territorioId, setTerritorioId] = useState('');
  const [missaoSelecionadaId, setMissaoSelecionadaId] = useState(null);
  const [mostrarVitoria, setMostrarVitoria] = useState(true);

  async function carregarFicha({ exibirCarregando = true, limparMensagem = true } = {}) {
    if (exibirCarregando) {
      setCarregando(true);
    }

    try {
      const resposta = await obterMinhaFicha();
      setFicha(resposta);
      if (limparMensagem) {
        setMensagemSistema('');
      }

      const primeiraRegiao = resposta?.regioes?.[0];
      setTerritorioId((atual) => atual || primeiraRegiao?.slug || '');
    } catch (erro) {
      if (erro?.status === 401) {
        // Token ausente/expirado: limpa a sessão e volta para o login
        sair();
        navegar('/login', { replace: true });
        return;
      }
      setMensagemSistema(erro?.message || 'Não foi possível carregar a ficha do jogo.');
    } finally {
      if (exibirCarregando) {
        setCarregando(false);
      }
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
    // Pré-carrega modelos 3D em background para acelerar quando abrir o modal da câmera.
    // Não altera layout nem regras de negócio: apenas aquece cache do navegador.
    const urls = [];
    const missoes = dadosTerritorio?.missoes || [];
    missoes.forEach((missao) => {
      (missao?.itens || []).forEach((item) => {
        const caminho = item?.caminho_modelo_3d || item?.caminho_imagem || '';
        if (caminho) urls.push(caminho);
      });
    });
    precacheModelos3d(urls);
  }, [dadosTerritorio?.id_regiao]);

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
    () =>
      missaoSelecionada?.itens?.find((item) => {
        const necessario = Number(item.quantidade_necessaria || 1);
        const atual = Number(item.quantidade_usuario || 0);
        return atual < necessario;
      }) || null,
    [missaoSelecionada],
  );

  // Contador geral: soma as missões de TODAS as regiões (não só a região atual).
  const progressoGeral = useMemo(() => {
    const regioes = ficha?.regioes || [];
    let totalMissoes = 0;
    let missoesConcluidas = 0;

    regioes.forEach((regiao) => {
      (regiao.missoes || []).forEach((missao) => {
        totalMissoes += 1;
        if (missao.concluida) missoesConcluidas += 1;
      });
    });

    return {
      totalRegioes: regioes.length,
      totalMissoes,
      missoesConcluidas,
      jogoConcluido: totalMissoes > 0 && missoesConcluidas === totalMissoes,
    };
  }, [ficha]);

  // Dispara a tela de vitória só no momento em que o jogo passa a estar 100% concluído,
  // e não toda vez que a ficha recarrega (evita reabrir a tela sem parar).
  useEffect(() => {
    if (progressoGeral.jogoConcluido) {
      setMostrarVitoria(true);
    }
  }, [progressoGeral.jogoConcluido]);
  

  async function lidarColeta(item) {
    setMostrarModalQr(false);
    setMensagemSistema('Item coletado. Atualizando a ficha...');

    try {
      const resposta = await coletarItemHiro(item.id_item);
      await carregarFicha({ exibirCarregando: false, limparMensagem: false });
      setMensagemSistema(resposta?.mensagem || 'Item coletado com sucesso.');
      return resposta;
    } catch (erro) {
      setMensagemSistema(erro?.message || 'Não foi possível coletar o item agora.');
      throw erro;
    }
  }

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando ficha do jogo...</p>
      </div>
    );
  }

  if (!ficha?.personagem) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#fff2bc', marginBottom: '0.75rem' }}>Não foi possível carregar a ficha</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
            {mensagemSistema || 'O backend retornou um erro ao montar a ficha. Verifique o console do backend para ver o motivo.'}
          </p>
          <button
            type="button"
            onClick={carregarFicha}
            style={{
              border: '1px solid #d4af37',
              background: 'linear-gradient(135deg, #d4af37, #8a6711)',
              color: '#070b12',
              borderRadius: '0.8rem',
              padding: '0.9rem 1rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Tentar novamente
          </button>
        </div>
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

      {mostrarVitoria && (
        <TelaVitoria
          totalMissoes={progressoGeral.totalMissoes}
          nomeEquipe={ficha?.equipe?.nome_equipe}
          aoFechar={() => setMostrarVitoria(false)}
        />
      )}
    </div>
  );
}