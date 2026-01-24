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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [uploadMode, setUploadMode] = useState("new"); // "new" or "existing"
  const [selectedExistingFile, setSelectedExistingFile] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      const allPatients = patientService.getPatients();
      setPatients(allPatients);
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find(p => p.id === selectedPatientId);
      setSelectedPatient(patient);
      setDiagnosisResult(null);
      setSelectedExistingFile("");
      setNewFile(null);
    } else {
      setSelectedPatient(null);
    }
  }, [selectedPatientId, patients]);

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Arquivo muito grande! Máximo 5MB.");
        return;
      }
      setNewFile(file);
    }
  }

  function generateMockDiagnosis() {
    // Mock da ia
    const diagnoses = [
      {
        suggestion: "Demência de Alzheimer - Estágio Inicial",
        confidence: "85%",
        details: "Padrões de ondas cerebrais indicam redução da atividade no lobo temporal e parietal, consistente com Alzheimer em estágio inicial. Recomenda-se acompanhamento neurológico.",
        recommendations: [
          "Consulta com neurologista especializado",
          "Testes cognitivos complementares (MEEM, MoCA)",
          "Ressonância magnética cerebral",
          "Início de terapia cognitiva"
        ]
      },
      {
        suggestion: "Demência Vascular - Estágio Moderado",
        confidence: "78%",
        details: "EEG apresenta irregularidades focais sugestivas de comprometimento vascular. Observa-se lentificação difusa da atividade cerebral.",
        recommendations: [
          "Avaliação cardiológica",
          "Controle rigoroso de pressão arterial",
          "Doppler de carótidas",
          "Ajuste de medicação anticoagulante"
        ]
      },
      {
        suggestion: "Comprometimento Cognitivo Leve (CCL)",
        confidence: "72%",
        details: "Alterações sutis no padrão EEG, sem sinais claros de demência avançada. Sugere-se monitoramento contínuo.",
        recommendations: [
          "Reavaliação em 6 meses",
          "Estimulação cognitiva",
          "Atividade física regular",
          "Controle de fatores de risco cardiovascular"
        ]
      }
    ];

    return diagnoses[Math.floor(Math.random() * diagnoses.length)];
  }

  async function handleAnalyze() {
    if (!selectedPatientId) {
      alert("Selecione um paciente.");
      return;
    }

    if (uploadMode === "new" && !newFile) {
      alert("Selecione um arquivo de eletroencefalograma.");
      return;
    }

    if (uploadMode === "existing" && !selectedExistingFile) {
      alert("Selecione um exame já anexado.");
      return;
    }

    setIsProcessing(true);
    setDiagnosisResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const mockResult = generateMockDiagnosis();
      setDiagnosisResult(mockResult);
      setIsProcessing(false);
    }, 2000);
  }

  function generatePDFReport() {
    if (!diagnosisResult || !selectedPatient) return;

    // Generate a simple text-based PDF content
    const reportContent = `
LAUDO DE ANÁLISE DE ELETROENCEFALOGRAMA
========================================

Paciente: ${selectedPatient.nome}
Idade: ${selectedPatient.idade} anos
Data do Laudo: ${new Date().toLocaleDateString('pt-BR')}

DIAGNÓSTICO SUGERIDO (IA):
${diagnosisResult.suggestion}

Nível de Confiança: ${diagnosisResult.confidence}

DETALHES DA ANÁLISE:
${diagnosisResult.details}

RECOMENDAÇÕES:
${diagnosisResult.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

---
Este laudo foi gerado automaticamente por sistema de Inteligência Artificial
e deve ser validado por profissional médico qualificado.

Sistema MenteSã - ${new Date().toLocaleString('pt-BR')}
    `.trim();

    // Create a blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laudo_${selectedPatient.nome.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <Link to="/perfil" style={{ textDecoration: 'none', color: '#0056b3', fontSize: '1.2rem', marginLeft: '0.5rem', marginRight: '0.5rem' }} title="Editar Perfil">
            ⚙️
          </Link>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2>Diagnóstico por IA</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            
            {/* Input Section */}
            <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#333" }}>Análise de Eletroencefalograma</h3>
                
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
                              backgroundColor: "#333",
                              color: "white", 
                              appearance: "none", 
                              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right .7em top 50%",
                              backgroundSize: ".65em auto"
                          }}
                    >
                        <option value="">-- Selecione --</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>{patient.nome}</option>
                        ))}
                    </select>
                </div>

                {selectedPatient && (
                    <>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Origem do Arquivo</label>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                    <input 
                                        type="radio" 
                                        name="uploadMode" 
                                        value="new"
                                        checked={uploadMode === "new"}
                                        onChange={() => setUploadMode("new")}
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                    Enviar novo arquivo
                                </label>
                                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                    <input 
                                        type="radio" 
                                        name="uploadMode" 
                                        value="existing"
                                        checked={uploadMode === "existing"}
                                        onChange={() => setUploadMode("existing")}
                                        style={{ marginRight: "0.5rem" }}
                                        disabled={!selectedPatient.exames || selectedPatient.exames.length === 0}
                                    />
                                    Usar arquivo já anexado
                                </label>
                            </div>
                        </div>

                        {uploadMode === "new" ? (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Arquivo EEG</label>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept=".edf,.txt,.csv,.pdf"
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#f8f9fa" }}
                                />
                                {newFile && (
                                    <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
                                        Arquivo selecionado: {newFile.name}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Selecione o Exame</label>
                                {selectedPatient.exames && selectedPatient.exames.length > 0 ? (
                                    <select
                                        value={selectedExistingFile}
                                        onChange={(e) => setSelectedExistingFile(e.target.value)}
                                        style={{ 
                                            width: "100%", 
                                            padding: "12px", 
                                            borderRadius: "8px", 
                                            border: "1px solid #ddd",
                                            backgroundColor: "white"
                                        }}
                                    >
                                        <option value="">-- Selecione um arquivo --</option>
                                        {selectedPatient.exames.map((file, idx) => (
                                            <option key={idx} value={idx}>{file.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p style={{ color: "#999", fontStyle: "italic" }}>Nenhum arquivo anexado para este paciente.</p>
                                )}
                            </div>
                        )}

                        <button 
                            onClick={handleAnalyze}
                            disabled={isProcessing || (uploadMode === "new" && !newFile) || (uploadMode === "existing" && !selectedExistingFile)}
                            style={{ 
                                padding: "12px 24px", 
                                backgroundColor: isProcessing ? "#ccc" : "#0056b3", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "8px", 
                                fontSize: "1rem", 
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                fontWeight: "600",
                                width: "100%"
                            }}
                        >
                            {isProcessing ? "🔄 Processando com IA..." : "🤖 Analisar com IA"}
                        </button>
                    </>
                )}
            </div>

            {/* Results Section */}
            {diagnosisResult && (
                <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ margin: 0, color: "#333" }}>Resultado da Análise</h3>
                        <button 
                            onClick={generatePDFReport}
                            style={{ 
                                padding: "8px 16px", 
                                backgroundColor: "#28a745", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "6px", 
                                fontSize: "0.9rem", 
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            📄 Baixar Laudo PDF
                        </button>
                    </div>

                    <div style={{ padding: "1.5rem", backgroundColor: "#e7f3ff", borderRadius: "8px", marginBottom: "1.5rem", border: "2px solid #0056b3" }}>
                        <h4 style={{ marginTop: 0, color: "#0056b3" }}>Diagnóstico Sugerido</h4>
                        <p style={{ fontSize: "1.1rem", fontWeight: "600", margin: "0.5rem 0", color: "#333" }}>
                            {diagnosisResult.suggestion}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
                            Confiança: <strong>{diagnosisResult.confidence}</strong>
                        </p>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ color: "#333" }}>Detalhes da Análise</h4>
                        <p style={{ lineHeight: "1.6", color: "#555" }}>
                            {diagnosisResult.details}
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: "#333" }}>Recomendações</h4>
                        <ul style={{ lineHeight: "1.8", color: "#555" }}>
                            {diagnosisResult.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#fff3cd", borderRadius: "6px", border: "1px solid #ffc107" }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#856404" }}>
                            ⚠️ <strong>Importante:</strong> Este diagnóstico foi gerado por Inteligência Artificial e deve ser validado por um profissional médico qualificado.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
