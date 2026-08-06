import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cadastrarUsuario, loginUsuario, logoutUsuario } from '../servicos/authServico';
import { buscarMinhaEquipe } from '../servicos/equipesApi';

const AuthContext = createContext(null);

const CHAVE_TOKEN = 'umbraeth_token';
const CHAVE_USUARIO = 'umbraeth_usuario';
const CHAVE_EQUIPE = 'umbraeth_equipe_atual';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CHAVE_TOKEN) || '');
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem(CHAVE_USUARIO);
    return salvo ? JSON.parse(salvo) : null;
  });
  const [equipe, setEquipe] = useState(() => {
    const salvo = localStorage.getItem(CHAVE_EQUIPE);
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregandoSessao, setCarregandoSessao] = useState(false);

  const estaLogado = Boolean(token && usuario);
  const estaEmEquipe = Boolean(equipe?.id_equipe);

  useEffect(() => {
    if (token) localStorage.setItem(CHAVE_TOKEN, token);
    else localStorage.removeItem(CHAVE_TOKEN);
  }, [token]);

  useEffect(() => {
    if (usuario) localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    else localStorage.removeItem(CHAVE_USUARIO);
  }, [usuario]);

  useEffect(() => {
    if (equipe) localStorage.setItem(CHAVE_EQUIPE, JSON.stringify(equipe));
    else localStorage.removeItem(CHAVE_EQUIPE);
  }, [equipe]);

  const registrar = useCallback(async ({ nomeUsuario, senhaUsuario }) => {
    const resultado = await cadastrarUsuario({ nomeUsuario, senhaUsuario });
    return resultado;
  }, []);

  const entrar = useCallback(async ({ nomeUsuario, senhaUsuario }) => {
    const resultado = await loginUsuario({ nomeUsuario, senhaUsuario });
    setToken(resultado.token);
    setUsuario(resultado.usuario);
    // equipe será carregada depois (se existir)
    setEquipe(null);
    return resultado;
  }, []);

  const sair = useCallback(() => {
    logoutUsuario();
    setToken('');
    setUsuario(null);
    setEquipe(null);
  }, []);

  const atualizarEquipe = useCallback((novaEquipe) => {
    setEquipe(novaEquipe);
  }, []);

  const recarregarMinhaEquipe = useCallback(async () => {
    if (!token) return null;
    setCarregandoSessao(true);
    try {
      const minhaEquipe = await buscarMinhaEquipe();
      setEquipe(minhaEquipe);
      return minhaEquipe;
    } finally {
      setCarregandoSessao(false);
    }
  }, [token]);

  const valor = useMemo(
    () => ({
      token,
      usuario,
      equipe,
      estaLogado,
      estaEmEquipe,
      carregandoSessao,
      registrar,
      entrar,
      sair,
      atualizarEquipe,
      recarregarMinhaEquipe,
    }),
    [token, usuario, equipe, estaLogado, estaEmEquipe, carregandoSessao, registrar, entrar, sair, atualizarEquipe, recarregarMinhaEquipe],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }
  return contexto;
}

