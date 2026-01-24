import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 
import { authService } from "../utils/auth";
import { patientService } from "../utils/patientService";
import logoImage from "../assets/logo2.png"; 

export default function ListaPacientes() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      setPatients(patientService.getPatients());
    }
  }, [navigate]);

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logoImage} alt="MenteSã" className="dashboard-logo-img" />
        <div className="user-info">
          <span>{user.nome}</span>
          <Link to="/perfil" style={{ textDecoration: 'none', color: '#0056b3', fontSize: '1.2rem', marginLeft: '0.5rem', marginRight: '0.5rem' }} title="Editar Perfil">
            ⚙️
          </Link>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2>Meus Pacientes</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        {patients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Nenhum paciente cadastrado ainda.</p>
                <Link to="/pacientes" style={{ color: "#0056b3", fontWeight: "600", textDecoration: "none" }}>Cadastrar Novo Paciente</Link>
            </div>
        ) : (
            <div className="menu-grid">
                {patients.map(patient => (
                    <div key={patient.id} className="menu-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                             <span className="card-icon" style={{ fontSize: "2rem", margin: 0 }}>👤</span>
                             <Link to={`/pacientes/editar/${patient.id}`} className="btn-logout" style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem", textDecoration: "none" }}>Editar</Link>
                        </div>
                       
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>{patient.nome}</h3>
                        <p style={{ margin: "0 0 0.25rem 0" }}><strong>Idade:</strong> {patient.idade} anos</p>
                        <p style={{ margin: "0 0 1rem 0" }}><strong>Estágio:</strong> {patient.estagio}</p>

                        {/* Display Attachments */}
                        {(patient.exames && patient.exames.length > 0) || (patient.exame && patient.arquivo) ? (
                            <div style={{ marginTop: "1rem", width: "100%", borderTop: "1px solid #eee", paddingTop: "0.5rem" }}>
                                <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "#555" }}>Anexos:</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {/* Handle new array format */}
                                    {patient.exames && patient.exames.map((file, idx) => (
                                        file.content ? (
                                            <a key={idx} href={file.content} download={file.name} 
                                               style={{ 
                                                   display: "flex", 
                                                   alignItems: "center", 
                                                   gap: "8px", 
                                                   textDecoration: "none", 
                                                   color: "#0056b3",
                                                   fontSize: "0.9rem",
                                                   background: "#f8f9fa",
                                                   padding: "6px 10px",
                                                   borderRadius: "6px",
                                                   border: "1px solid #e9ecef"
                                               }}
                                            >
                                                <span>📄</span>
                                                <span style={{ textDecoration: "underline" }}>Baixar {file.name}</span>
                                            </a>
                                        ) : null
                                    ))}
                                    
                                    {/* Handle legacy format (fallback) */}
                                    {(!patient.exames || patient.exames.length === 0) && patient.exame && patient.arquivo && (
                                         <a href={patient.arquivo} download={patient.exame} 
                                            style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                gap: "8px", 
                                                textDecoration: "none", 
                                                color: "#0056b3",
                                                fontSize: "0.9rem",
                                                background: "#f8f9fa",
                                                padding: "6px 10px",
                                                borderRadius: "6px",
                                                border: "1px solid #e9ecef"
                                            }}
                                        >
                                            <span>📄</span>
                                            <span style={{ textDecoration: "underline" }}>Baixar {patient.exame}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
