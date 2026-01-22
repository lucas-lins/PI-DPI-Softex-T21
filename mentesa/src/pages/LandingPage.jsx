import { Link } from 'react-router-dom';
import '../styles/landing.css'; 
import nameImage from '../assets/name2.png';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={nameImage} alt="MenteSã - Sistema de Apoio ao Diagnóstico de Demência" className="landing-logo-img" />
        <p className="landing-description">
          O MenteSã é um sistema inteligente de apoio ao diagnóstico e acompanhamento de demências. 
          Conectamos cuidadores e profissionais de saúde para oferecer um registro clínico detalhado, 
          histórico de evolução e materiais de capacitação, promovendo um cuidado mais humanizado e eficiente.
        </p>
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
        <p>&copy; 2026 MenteSã - Softex T21 Mardonio - Acessibilidade e Cuidado.</p>
      </footer>
    </div>
  );
}
