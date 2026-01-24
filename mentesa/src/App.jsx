import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './pages/LandingPage';
import Login from './pages/login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import CadastroPacientes from './pages/CadastroPacientes';
import Diagnostico from './pages/Diagnostico';
import ListaPacientes from './pages/ListaPacientes';
import Relatorios from './pages/Relatorios';
import EditarPerfil from './pages/EditarPerfil';
import './App.css';

function App() {
  return (
    <ThemeProvider>
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
          <Route path="/perfil" element={<EditarPerfil />} />
        </Routes>
        <ThemeToggle />
      </Router>
    </ThemeProvider>
  );
}

export default App;

