import { Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

export function RotaProtegida({ children, exigeEquipe = false }) {
  const { estaLogado, estaEmEquipe } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  if (exigeEquipe && !estaEmEquipe) {
    return <Navigate to="/equipe" replace />;
  }

  return children;
}

