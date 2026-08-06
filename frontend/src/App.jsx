import { Navigate, Route, Routes } from 'react-router-dom';
import PaginaInicial from './paginas/PaginaInicial';
import PaginaCadastroUsuario from './paginas/PaginaCadastroUsuario';
import Desenvolvedores from './paginas/Desenvolvedores';
import PaginaSobre from './paginas/PaginaSobre';
import PaginaEquipe from './paginas/PaginaEquipe';
import PaginaFichaRpg from './paginas/PaginaFichaRpg';
import PaginaLogin from './paginas/PaginaLogin';
import { RotaProtegida } from './componentes/RotaProtegida';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route path="/cadastro" element={<PaginaCadastroUsuario />} />
      <Route path="/desenvolvedores" element={<Desenvolvedores />} />
      <Route path="/sobre" element={<PaginaSobre />} />
      <Route path="/login" element={<PaginaLogin />} />
      <Route
        path="/equipe"
        element={
          <RotaProtegida>
            <PaginaEquipe />
          </RotaProtegida>
        }
      />
      <Route
        path="/ficha-rpg"
        element={
          <RotaProtegida exigeEquipe>
            <PaginaFichaRpg />
          </RotaProtegida>
        }
      />
      <Route path="/jogar" element={<Navigate to="/ficha-rpg" replace />} />

      <Route path="/desenvolvedores" element={<Navigate to="/desenvolvedores" replace />} />
      <Route path="/about" element={<Navigate to="/sobre" replace />} />
      <Route path="/team" element={<Navigate to="/equipe" replace />} />
      <Route path="/rpg" element={<Navigate to="/ficha-rpg" replace />} />
    </Routes>
  );
}
