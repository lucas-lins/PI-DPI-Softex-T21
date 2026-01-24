import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../utils/auth";
import "../styles/dashboard.css";
import logoImage from "../assets/logo2.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  if (!user) return null; // Avoid flashing content before redirect

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logoImage} alt="MenteSã" className="dashboard-logo-img" />
        <div className="user-info">
          <span>Olá, {user.nome}</span>
          <Link to="/perfil" style={{ textDecoration: 'none', color: '#0056b3', fontSize: '1.2rem', marginLeft: '0.5rem', marginRight: '0.5rem' }} title="Editar Perfil">
            ⚙️
          </Link>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>O que você deseja fazer hoje?</h2>
        
        <div className="menu-grid">
          <Link to="/pacientes" className="menu-card">
            <span className="card-icon">➕</span>
            <h3>Cadastrar Novo</h3>
            <p>Registre um novo paciente.</p>
          </Link>

          <Link to="/pacientes/lista" className="menu-card">
            <span className="card-icon">📋</span>
            <h3>Consultar Pacientes</h3>
            <p>Veja e edite seus pacientes cadastrados.</p>
          </Link>

          <Link to="/relatorios" className="menu-card">
            <span className="card-icon">📊</span>
            <h3>Relatórios</h3>
            <p>Estatísticas de idade e demência.</p>
          </Link>

          <Link to="/diagnostico" className="menu-card">
            <span className="card-icon">🩺</span>
            <h3>Diagnóstico</h3>
            <p>Registre e consulte diagnósticos médicos.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
