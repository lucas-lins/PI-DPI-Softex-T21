import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/dashboard.css"; // Use dashboard styles
import { authService } from "../utils/auth";
import { patientService } from "../utils/patientService";
import logoImage from "../assets/logo2.png"; 

export default function CadastroPacientes() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const [user, setUser] = useState(null);
  
  // Protect Route & Get User
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    historico: "",
    estagio: "Inicial", // Default value
    rotina: "",
    exames: [] // Array of { name, content }
  });

  // Load patient data if editing
  useEffect(() => {
    if (id) {
        const patients = patientService.getPatients();
        const patientToEdit = patients.find(p => p.id === id);
        if (patientToEdit) {
            // Migration: If legacy fields exist, move to array
            if ((patientToEdit.exame || patientToEdit.arquivo) && (!patientToEdit.exames || patientToEdit.exames.length === 0)) {
                patientToEdit.exames = [];
                if (patientToEdit.exame) {
                     patientToEdit.exames.push({
                        name: patientToEdit.exame,
                        content: patientToEdit.arquivo
                     });
                }
                // Clean up legacy
                delete patientToEdit.exame;
                delete patientToEdit.arquivo;
            }
            // Ensure exames is initialized
            if (!patientToEdit.exames) patientToEdit.exames = [];
            
            setFormData(patientToEdit);
        } else {
            alert("Paciente não encontrado!");
            navigate("/dashboard");
        }
    }
  }, [id, navigate]);

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, files } = e.target;
    
    if (name === "exame") {
        const file = files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Arquivo muito grande! Máximo 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ 
                    ...prev, 
                    exames: [...(prev.exames || []), { name: file.name, content: reader.result }]
                }));
            };
            reader.readAsDataURL(file);
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function handleRemoveFile(index) {
     setFormData(prev => {
        const newExames = [...prev.exames];
        newExames.splice(index, 1);
        return { ...prev, exames: newExames };
     });
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";
    if (!formData.idade || formData.idade <= 0) newErrors.idade = "Idade inválida.";
    
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let result;
    if (id) {
        // Update existing
        result = patientService.updatePatient(formData);
    } else {
        // Create new
        result = patientService.savePatient(formData);
    }

    if (result.success) {
      alert(id ? "Dados atualizados com sucesso!" : "Paciente cadastrado com sucesso!");
      navigate(id ? "/pacientes/lista" : "/dashboard");
    } else {
      alert(result.message);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", maxWidth: "800px", margin: "0 auto 2rem auto" }}>
            <h2>Cadastro de Paciente</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Nome do Paciente</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
              placeholder="Nome completo"
            />
            {errors.nome && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.nome}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "1rem" }}>
            <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Idade</label>
                <input
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
                placeholder="Ex: 75"
                />
                 {errors.idade && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.idade}</span>}
            </div>

            <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Suspeita Inicial</label>
                <select 
                    name="estagio" 
                    value={formData.estagio} 
                    onChange={handleChange}
                    style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #ddd",
                        backgroundColor: "#333",
                        color: "white", 
                        appearance: "none", /* Remove default arrow to standardise */
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right .7em top 50%",
                        backgroundSize: ".65em auto"
                    }}
                >
                    <option value="Inicial">Inicial</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Indefinido">Ainda não definido</option>
                </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Histórico Clínico</label>
            <textarea
              name="historico"
              value={formData.historico}
              onChange={handleChange}
              placeholder="Doenças pré-existentes, alergias, medicações..."
              rows="3"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit", color: "white", backgroundColor: "#333" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Anexar Exames (Opcional)</label>
            <input
              type="file"
              name="exame"
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#333", color: "white" }}
            />
            {formData.exames && formData.exames.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>Arquivos Anexados:</p>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {formData.exames.map((file, index) => (
                            <li key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8f9fa", padding: "8px", borderRadius: "4px", marginBottom: "0.5rem", border: "1px solid #ddd" }}>
                                <span style={{ fontSize: "0.85rem", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                                    {file.name}
                                </span>
                                <div>
                                    {file.content && (
                                        <a 
                                            href={file.content} 
                                            download={file.name}
                                            style={{ 
                                                textDecoration: "none", 
                                                fontSize: "1.2rem",
                                                marginRight: "10px",
                                                cursor: "pointer"
                                            }}
                                            title="Baixar"
                                        >
                                            ⬇️
                                        </a>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveFile(index)}
                                        style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}
                                        title="Remover"
                                    >
                                        ❌
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Rotina de Cuidados</label>
            <textarea
              name="rotina"
              value={formData.rotina}
              onChange={handleChange}
              placeholder="Descreva a rotina diária, horários de remédios, etc..."
              rows="4"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit", color: "white", backgroundColor: "#333" }}
            />
            {errors.rotina && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.rotina}</span>}
          </div>

          <button 
            type="submit" 
            style={{ 
                padding: "12px 24px", 
                backgroundColor: "#0056b3", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontSize: "1rem", 
                cursor: "pointer",
                fontWeight: "600"
            }}
          >
            Salvar Cadastro
          </button>
        </form>
      </main>
    </div>
  );
}
