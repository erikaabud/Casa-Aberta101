// src/paginas/PaginaEquipe.jsx

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaEquipe.css';
import { useAuth } from '../contextos/AuthContext';
import { criarEquipe, entrarNaEquipe, listarClasses } from '../servicos/equipesApi';
import { 
  carregarPersonagem, 
  salvarPersonagem, 
  salvarClasseEscolhida,
  carregarClasseEscolhida // 👈 IMPORTAR ESTA FUNÇÃO
} from '../servicos/personagemServico';
import { personagemInicial } from '../dados/personagemInicial';

export default function PaginaEquipe() {
  const navegar = useNavigate();
  const { usuario, equipe, atualizarEquipe, recarregarMinhaEquipe } = useAuth();

  const [aba, setAba] = useState('criar');
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [codigoEquipe, setCodigoEquipe] = useState('');
  const [idClasse, setIdClasse] = useState('');
  const [classes, setClasses] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const podeJogar = Boolean(equipe?.id_equipe);

  const classeSelecionada = useMemo(
    () => classes.find((c) => String(c.id_classe) === String(idClasse)),
    [classes, idClasse],
  );

  // ✅ CARREGAR CLASSE SALVA ANTERIORMENTE
  useEffect(() => {
    const classeSalva = carregarClasseEscolhida();
    if (classeSalva) {
      const classeEncontrada = classes.find((c) => c.nome_classe === classeSalva);
      if (classeEncontrada) {
        setIdClasse(String(classeEncontrada.id_classe));
      }
    }
  }, [classes]);

  // Carrega lista de classes disponíveis
  useEffect(() => {
    listarClasses()
      .then((lista) => {
        const classesValidas = (lista || []).filter(
          (classe) => Object.prototype.hasOwnProperty.call(personagemInicial, classe.nome_classe)
        );
        setClasses(classesValidas);
      })
      .catch(() => {
        // Fallback local
        setClasses([
          { id_classe: 1, nome_classe: 'Guerreiro', habilidade: 'Golpe da Espada Selada', descricao_classe: 'Resiste a danos e protege a equipe.' },
          { id_classe: 2, nome_classe: 'Ladino', habilidade: 'Desarmar Armadilha', descricao_classe: 'Ágil e furtivo, especialista em armadilhas e ataques rápidos.' },
          { id_classe: 3, nome_classe: 'Mago', habilidade: 'Chuva Arcana', descricao_classe: 'Domina magia e feitiços.' },
          { id_classe: 4, nome_classe: 'Clérigo', habilidade: 'Cura Divina', descricao_classe: 'Suporte divino que cura e protege aliados.' },
        ]);
      });
  }, []);

  useEffect(() => {
    recarregarMinhaEquipe().catch(() => null);
  }, [recarregarMinhaEquipe]);

  function mostrarMensagem(texto, tipo = 'info') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3500);
  }

  // ✅ Salva a classe no personagem ANTES de chamar a API
  function salvarClasseNoPersonagem() {
    if (!classeSelecionada) return;

    const nomeClasse = classeSelecionada.nome_classe;
    const dadosClasse = personagemInicial[nomeClasse];

    if (dadosClasse) {
      const personagemAtualizado = {
        ...dadosClasse,
        classe: nomeClasse,
        classeConfirmada: false,
      };
      salvarPersonagem(personagemAtualizado);
      salvarClasseEscolhida(nomeClasse);
      
      console.log(`✅ Classe "${nomeClasse}" salva no personagem e no localStorage`);
    } else {
      console.warn(`Nenhum dado encontrado em personagemInicial para a classe "${nomeClasse}".`);
      const personagemAtual = carregarPersonagem();
      salvarPersonagem({ ...personagemAtual, classe: nomeClasse, classeConfirmada: false });
      salvarClasseEscolhida(nomeClasse);
    }
  }

  async function handleCriarEquipe(e) {
    e.preventDefault();
    if (!nomeEquipe.trim()) {
      mostrarMensagem('❌ Informe o nome da equipe.', 'error');
      return;
    }
    if (!idClasse) {
      mostrarMensagem('❌ Selecione sua classe.', 'error');
      return;
    }

    setCarregando(true);
    try {
      salvarClasseNoPersonagem();

      const resultado = await criarEquipe({ nomeEquipe, idClasse: Number(idClasse) });
      atualizarEquipe(resultado?.equipe || resultado);
      mostrarMensagem('✅ Equipe criada com sucesso!', 'success');
      setNomeEquipe('');
      setCodigoEquipe('');
    } catch (erro) {
      mostrarMensagem(erro?.message || 'Erro ao criar equipe.', 'error');
    } finally {
      setCarregando(false);
    }
  }

  async function handleEntrarEquipe(e) {
    e.preventDefault();
    const codigoLimpo = codigoEquipe.toUpperCase().trim();
    if (codigoLimpo.length !== 6) {
      mostrarMensagem('❌ O token precisa ter 6 caracteres.', 'error');
      return;
    }
    if (!idClasse) {
      mostrarMensagem('❌ Selecione sua classe.', 'error');
      return;
    }

    setCarregando(true);
    try {
      salvarClasseNoPersonagem();

      const resultado = await entrarNaEquipe({ codigoEquipe: codigoLimpo, idClasse: Number(idClasse) });
      atualizarEquipe(resultado?.equipe || resultado);
      mostrarMensagem('✅ Você entrou na equipe!', 'success');
      setCodigoEquipe('');
    } catch (erro) {
      mostrarMensagem(erro?.message || 'Erro ao entrar na equipe.', 'error');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="equipe-pagina">
      <header className="equipe-topo">
        <div>
          <h1>⚔️ Equipe</h1>
          <p>
            Logado como <strong>{usuario?.nome_usuario}</strong>
            {' '}
            {podeJogar ? (
              <span className="equipe-status ok">✔️ Você já está em uma equipe.</span>
            ) : (
              <span className="equipe-status alerta">⚠️ Você ainda não entrou em uma equipe.</span>
            )}
          </p>
        </div>

        <div className="equipe-topo-acoes">
          <button type="button" onClick={() => navegar('/')} className="btn-secundario">
            ← Voltar
          </button>
          <button 
            type="button" 
            className="btn-primario" 
            disabled={!podeJogar} 
            onClick={() => navegar('/jogar')}
          >
            ▶ Jogar
          </button>
        </div>
      </header>

      {mensagem && (
        <div className={`equipe-mensagem ${mensagem.tipo}`}>
          <span className="mensagem-icone">
            {mensagem.tipo === 'success' ? '✅' : mensagem.tipo === 'error' ? '❌' : 'ℹ️'}
          </span>
          {mensagem.texto}
        </div>
      )}

      {equipe?.id_equipe && (
        <section className="equipe-cartao equipe-cartao--atual">
          <h2>🛡️ Equipe atual</h2>
          <div className="equipe-cartao__linha">
            <span>Nome:</span> <strong>{equipe.nome_equipe}</strong>
          </div>
          <div className="equipe-cartao__linha">
            <span>Token:</span> <code className="equipe-token">{equipe.codigo}</code>
          </div>
          <div className="equipe-cartao__linha">
            <span>Status:</span> <strong>{equipe.status || 'Jogando'}</strong>
          </div>
          <div className="equipe-cartao__linha">
            <span>Classe escolhida:</span> 
            <strong style={{ color: '#FFD700' }}>
              {carregarClasseEscolhida() || 'Nenhuma'}
            </strong>
          </div>
        </section>
      )}

      <section className="equipe-abas">
        <button
          type="button"
          className={aba === 'criar' ? 'ativo' : ''}
          onClick={() => setAba('criar')}
        >
          ✨ Criar equipe
        </button>
        <button
          type="button"
          className={aba === 'entrar' ? 'ativo' : ''}
          onClick={() => setAba('entrar')}
        >
          🔑 Entrar com token
        </button>
      </section>

      <section className="equipe-formularios">
        <div className="equipe-cartao">
          <h2>🧙 Escolha sua classe</h2>
          <select 
            value={idClasse} 
            onChange={(e) => {
              const novoId = e.target.value;
              setIdClasse(novoId);
              // ✅ Salva a classe imediatamente quando selecionada
              const classe = classes.find((c) => String(c.id_classe) === String(novoId));
              if (classe) {
                salvarClasseEscolhida(classe.nome_classe);
                console.log(`✅ Classe "${classe.nome_classe}" selecionada e salva`);
              }
            }} 
            disabled={carregando}
          >
            <option value="">Selecione…</option>
            {classes.map((classe) => (
              <option key={classe.id_classe} value={classe.id_classe}>
                {classe.nome_classe}
              </option>
            ))}
          </select>
          {classeSelecionada && (
            <div className="equipe-classe-desc">
              <p>
                <span className="classe-habilidade">⚡ {classeSelecionada.habilidade}</span>
              </p>
              <p>{classeSelecionada.descricao_classe}</p>
              <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                ✅ Classe salva: <strong>{classeSelecionada.nome_classe}</strong>
              </p>
            </div>
          )}
        </div>

        {aba === 'criar' ? (
          <form className="equipe-cartao" onSubmit={handleCriarEquipe}>
            <h2>🏗️ Criar equipe</h2>
            <label>
              Nome da equipe
              <input
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                placeholder="Ex: Guardiões de Nex-Mortis"
                disabled={carregando}
              />
            </label>
            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Criando…' : 'Criar equipe'}
            </button>
          </form>
        ) : (
          <form className="equipe-cartao" onSubmit={handleEntrarEquipe}>
            <h2>🔐 Entrar com token</h2>
            <label>
              Token da equipe
              <input
                value={codigoEquipe}
                onChange={(e) => setCodigoEquipe(e.target.value.toUpperCase())}
                placeholder="Ex: A1B2C3"
                maxLength={6}
                disabled={carregando}
              />
            </label>
            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}