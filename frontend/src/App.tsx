import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAuth } from './contextos/Autenticacao';
import PaginaLogin from './paginas/Login';
import PaginaPainel from './paginas/Painel';
import RotaProtegida from './componentes/RotaProtegida';
import FormularioUsuario from './paginas/usuarios/FormularioUsuario';
import ListaMotoristas from './paginas/cadastros/ListaMotoristas';
import ListaVeiculos from './paginas/cadastros/ListaVeiculos';
import ListaPostos from './paginas/cadastros/ListaPostos';

export default function App() {
  return (
    <ProvedorAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route
            path="/painel"
            element={
              <RotaProtegida>
                <PaginaPainel />
              </RotaProtegida>
            }
          />

          <Route
            path="/usuarios/novo"
            element={
              <RotaProtegida perfisPermitidos={['gestor']}>
                <FormularioUsuario />
              </RotaProtegida>
            }
          />
          <Route
            path="/usuarios/editar/:id"
            element={
              <RotaProtegida perfisPermitidos={['gestor']}>
                <FormularioUsuario />
              </RotaProtegida>
            }
          />
          <Route
            path="/cadastros/motoristas"
            element={
              <RotaProtegida perfisPermitidos={['gestor']}>
                <ListaMotoristas />
              </RotaProtegida>
            }
          />
          <Route
            path="/cadastros/veiculos"
            element={
              <RotaProtegida perfisPermitidos={['gestor']}>
                <ListaVeiculos />
              </RotaProtegida>
            }
          />
          <Route
            path="/cadastros/postos"
            element={
              <RotaProtegida perfisPermitidos={['gestor']}>
                <ListaPostos />
              </RotaProtegida>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ProvedorAuth>
  );
}
