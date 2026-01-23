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
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>O que você deseja fazer hoje?</h2>
        
        <div className="menu-grid">
          <Link to="/pacientes" className="menu-card">
            <span className="card-icon">👴</span>
            <h3>Cadastro de Pacientes</h3>
            <p>Registre pacientes e seus históricos clínicos.</p>
          </Link>

          <Link to="/diario" className="menu-card">
            <span className="card-icon">📝</span>
            <h3>Diário de Cuidados</h3>
            <p>Registre sinais, sintomas e observações diárias.</p>
          </Link>

          <Link to="/relatorios" className="menu-card">
            <span className="card-icon">📊</span>
            <h3>Relatórios</h3>
            <p>Acompanhe a evolução e gere relatórios.</p>
          </Link>

          <Link to="/capacitacao" className="menu-card">
            <span className="card-icon">🎓</span>
            <h3>Capacitação</h3>
            <p>Materiais educativos e guias para cuidadores.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
