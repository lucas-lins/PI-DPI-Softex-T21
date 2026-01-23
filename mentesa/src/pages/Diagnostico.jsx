import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 
import { authService } from "../utils/auth";
import { patientService } from "../utils/patientService";
import logoImage from "../assets/logo2.png"; 

export default function Diagnostico() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      // Load patients
      const allPatients = patientService.getPatients();
      setPatients(allPatients);
    }
  }, [navigate]);

  // When patient selection changes, load their existing diagnosis if any
  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find(p => p.id === selectedPatientId);
      if (patient) {
        setDiagnosis(patient.diagnostico || "");
      }
    } else {
      setDiagnosis("");
    }
  }, [selectedPatientId, patients]);

  function handleSave(e) {
    e.preventDefault();
    if (!selectedPatientId) {
      setMessage({ text: "Selecione um paciente.", type: "error" });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (patient) {
        const updatedPatient = { ...patient, diagnostico: diagnosis };
        const result = patientService.updatePatient(updatedPatient);
        
        if (result.success) {
            setMessage({ text: "Diagnóstico salvo com sucesso!", type: "success" });
            
            // Update local state to reflect changes
            setPatients(prev => prev.map(p => p.id === selectedPatientId ? updatedPatient : p));
        } else {
             setMessage({ text: result.message, type: "error" });
        }
    }
  }

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
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2>Diagnóstico Médico</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <div style={{ maxWidth: "800px", background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            
            {message.text && (
                <div style={{ 
                    padding: "1rem", 
                    marginBottom: "1rem", 
                    borderRadius: "8px", 
                    backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                    color: message.type === "success" ? "#155724" : "#721c24",
                    border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Selecione o Paciente</label>
                    <select 
                        value={selectedPatientId} 
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        style={{ 
                            width: "100%", 
                            padding: "12px", 
                            borderRadius: "8px", 
                            border: "1px solid #ddd",
                            backgroundColor: "white"
                        }}
                    >
                        <option value="">-- Selecione --</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>{patient.nome}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Diagnóstico / Laudo Médico</label>
                    <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Descreva o diagnóstico, CID, observações médicas..."
                        rows="6"
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={!selectedPatientId}
                    style={{ 
                        padding: "12px 24px", 
                        backgroundColor: selectedPatientId ? "#0056b3" : "#ccc", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        fontSize: "1rem", 
                        cursor: selectedPatientId ? "pointer" : "not-allowed",
                        fontWeight: "600"
                    }}
                >
                    Salvar Diagnóstico
                </button>
            </form>
        </div>
      </main>
    </div>
  );
}
