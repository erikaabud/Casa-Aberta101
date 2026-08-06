import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaCadastroUsuario.css';
import { useAuth } from '../contextos/AuthContext';

export default function PaginaCadastroUsuario() {
  const navegar = useNavigate();
  const { registrar } = useAuth();

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeUsuario.trim()) {
      mostrarNotificacao('❌ Digite seu nome!', 'error');
      return;
    }
    if (senhaUsuario.length < 3) {
      mostrarNotificacao('❌ A senha deve ter pelo menos 3 caracteres!', 'error');
      return;
    }
    if (senhaUsuario !== confirmarSenha) {
      mostrarNotificacao('❌ As senhas não coincidem!', 'error');
      return;
    }

    setCarregando(true);
    try {
      await registrar({ nomeUsuario, senhaUsuario });
      mostrarNotificacao('🎉 Conta criada com sucesso! Agora faça login.', 'success');
      setTimeout(() => navegar('/login'), 1200);
    } catch (erro) {
      mostrarNotificacao(erro?.message || 'Erro ao criar conta.', 'error');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="criar-container">
      <div className="criar-card">
        <div className="criar-header">
          <div className="criar-icone">⚔️</div>
          <h1>Criar Conta</h1>
          <p>Junte-se à aventura em Umbraeth</p>
        </div>

        {notificacao && (
          <div className={`criar-notificacao ${notificacao.tipo}`}>
            {notificacao.mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="criar-form">
          <div className="criar-campo">
            <label>👤 Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="criar-campo">
            <label>🔑 Senha</label>
            <input
              type="password"
              placeholder="Mínimo 3 caracteres"
              value={senhaUsuario}
              onChange={(e) => setSenhaUsuario(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="criar-campo">
            <label>✅ Confirmar Senha</label>
            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            className={`criar-botao ${carregando ? 'carregando' : ''}`}
            disabled={carregando}
          >
            {carregando ? (
              <>
                <span className="criar-spinner"></span>
                Criando conta...
              </>
            ) : (
              <>
                <span>⚔️</span>
                Criar minha lenda
              </>
            )}
          </button>
        </form>

        <div className="criar-login">
          <p>
            Já tem uma conta?{' '}
            <button
              className="criar-link-login"
              type="button"
              onClick={() => navegar('/login')}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

