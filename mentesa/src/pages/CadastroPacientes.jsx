import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // Use dashboard styles
import { authService } from "../utils/auth";
import { patientService } from "../utils/patientService";
import logoImage from "../assets/logo2.png"; 

export default function CadastroPacientes() {
  const navigate = useNavigate();
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
    rotina: ""
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";
    if (!formData.idade || formData.idade <= 0) newErrors.idade = "Idade inválida.";
    if (!formData.rotina.trim()) newErrors.rotina = "Rotina de cuidados é obrigatória.";
    
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = patientService.savePatient(formData);

    if (result.success) {
      alert("Paciente cadastrado com sucesso!");
      navigate("/dashboard");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2>Cadastro de Paciente</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "800px", background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Nome do Paciente</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
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
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
                placeholder="Ex: 75"
                />
                 {errors.idade && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.idade}</span>}
            </div>

            <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Estágio da Demência</label>
                <select 
                    name="estagio" 
                    value={formData.estagio} 
                    onChange={handleChange}
                    style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #ddd",
                        backgroundColor: "white",
                        appearance: "none", /* Remove default arrow to standardise */
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right .7em top 50%",
                        backgroundSize: ".65em auto"
                    }}
                >
                    <option value="Inicial">Inicial</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Avançado">Avançado</option>
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
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Rotina de Cuidados (Obrigatório)</label>
            <textarea
              name="rotina"
              value={formData.rotina}
              onChange={handleChange}
              placeholder="Descreva a rotina diária, horários de remédios, etc..."
              rows="4"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }}
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
