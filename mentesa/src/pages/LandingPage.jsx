import { Link } from 'react-router-dom';
import '../styles/landing.css'; 

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>MenteSã</h1>
        <p>Sistema de Apoio ao Diagnóstico de Demência</p>
      </header>
      
      <main className="landing-main">
        <div className="landing-actions">
          <Link to="/login" className="btn-large btn-primary" aria-label="Entrar na plataforma">
            Entrar
          </Link>
          <Link to="/cadastro" className="btn-large btn-secondary" aria-label="Cadastrar novo usuário">
            Cadastrar
          </Link>
        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2026 PI-DPI-Softex-T21. Acessibilidade e Cuidado.</p>
      </footer>
    </div>
  );
}
