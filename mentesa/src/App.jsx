import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import CadastroPacientes from './pages/CadastroPacientes';
import Diagnostico from './pages/Diagnostico';
import ListaPacientes from './pages/ListaPacientes';
import Relatorios from './pages/Relatorios';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<CadastroPacientes />} />
        <Route path="/pacientes/lista" element={<ListaPacientes />} />
        <Route path="/pacientes/editar/:id" element={<CadastroPacientes />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
      </Routes>
    </Router>
  );
}

export default App;
