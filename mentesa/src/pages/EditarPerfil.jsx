import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { authService } from "../utils/auth";
import logoImage from "../assets/logo2.png";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    crm: "",
    especialidade: "",
    telefone: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      setFormData({
        nome: currentUser.nome || "",
        email: currentUser.email || "",
        crm: currentUser.crm || "",
        especialidade: currentUser.especialidade || "",
        telefone: currentUser.telefone || ""
      });
    }
  }, [navigate]);

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
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
    
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem("mentesa_users_db") || "[]");
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem("mentesa_users_db", JSON.stringify(users));
      localStorage.setItem("mentesa_current_user", JSON.stringify(users[userIndex]));
      
      setUser(users[userIndex]);
      setMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
      
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } else {
      setMessage({ text: "Erro ao atualizar perfil.", type: "error" });
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
          <h2>Editar Perfil</h2>
          <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          
          {message.text && (
            <div style={{ 
              padding: "1rem", 
              marginBottom: "1.5rem", 
              borderRadius: "8px", 
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
            }}>
              {message.text}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
              placeholder="Seu nome completo"
            />
            {errors.nome && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.nome}</span>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
              placeholder="seu@email.com"
            />
            {errors.email && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.email}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>CRM</label>
              <input
                type="text"
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
                placeholder="Ex: 12345/SP"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Especialidade</label>
              <input
                type="text"
                name="especialidade"
                value={formData.especialidade}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
                placeholder="Ex: Neurologia"
              />
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", color: "white", backgroundColor: "#333" }}
              placeholder="(00) 00000-0000"
            />
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
            Salvar Alterações
          </button>
        </form>
      </main>
    </div>
  );
}
