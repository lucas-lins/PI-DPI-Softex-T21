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

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = 20;

      // Header
      doc.setFillColor(0, 86, 179);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('LAUDO DE ANÁLISE DE ELETROENCEFALOGRAMA', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema MenteSã - Diagnóstico por IA', pageWidth / 2, 25, { align: 'center' });

      yPos = 50;

      // Patient Info Box
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 30, 'F');
      
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DO PACIENTE', margin + 5, yPos + 3);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome: ${selectedPatient.nome}`, margin + 5, yPos + 12);
      doc.text(`Idade: ${selectedPatient.idade} anos`, margin + 100, yPos + 12);
      doc.text(`Data do Laudo: ${new Date().toLocaleDateString('pt-BR')}`, margin + 5, yPos + 20);
      
      yPos += 40;

      // Diagnosis Section
      doc.setFillColor(0, 86, 179);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DIAGNÓSTICO SUGERIDO (IA)', margin + 5, yPos + 2);
      
      yPos += 15;
      doc.setTextColor(0, 86, 179);
      doc.setFontSize(14);
      doc.text(diagnosisResult.suggestion, margin, yPos);
      
      yPos += 10;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(11);
      doc.text(`Nível de Confiança: ${diagnosisResult.confidence}`, margin, yPos);

      yPos += 15;

      // Details Section
      doc.setFillColor(0, 86, 179);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALHES DA ANÁLISE', margin + 5, yPos + 2);
      
      yPos += 15;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const splitDetails = doc.splitTextToSize(diagnosisResult.details, pageWidth - (margin * 2));
      doc.text(splitDetails, margin, yPos);
      yPos += splitDetails.length * 5 + 10;

      // Recommendations Section
      doc.setFillColor(0, 86, 179);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMENDAÇÕES', margin + 5, yPos + 2);
      
      yPos += 15;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      diagnosisResult.recommendations.forEach((rec, idx) => {
        doc.text(`${idx + 1}. ${rec}`, margin + 5, yPos);
        yPos += 7;
      });

      yPos += 10;

      // Warning Box
      doc.setFillColor(255, 243, 205);
      doc.rect(margin, yPos - 3, pageWidth - (margin * 2), 20, 'F');
      doc.setDrawColor(255, 193, 7);
      doc.rect(margin, yPos - 3, pageWidth - (margin * 2), 20, 'S');
      
      doc.setTextColor(133, 100, 4);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('IMPORTANTE:', margin + 5, yPos + 5);
      doc.setFont('helvetica', 'normal');
      const warningText = 'Este diagnóstico foi gerado por Inteligência Artificial e deve ser validado por um profissional médico qualificado.';
      const splitWarning = doc.splitTextToSize(warningText, pageWidth - (margin * 2) - 10);
      doc.text(splitWarning, margin + 5, yPos + 11);

      // Signature Section - with more space above
      const signatureY = pageHeight - 35
      doc.setDrawColor(51, 51, 51);
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);
      
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Assinatura do médico', pageWidth / 2, signatureY + 6, { align: 'center' });

      // Footer
      const footerY = pageHeight - 15;
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, footerY);
      doc.text('Sistema MenteSã © 2026', pageWidth - margin, footerY, { align: 'right' });

      // Save PDF
      doc.save(`laudo_${selectedPatient.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
    });
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
                                          backgroundColor: "#333",
                                          color: "white", 
                                          appearance: "none", 
                                          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                          backgroundRepeat: "no-repeat",
                                          backgroundPosition: "right .7em top 50%",
                                          backgroundSize: ".65em auto"
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
