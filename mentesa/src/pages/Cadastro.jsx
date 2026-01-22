import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css"; // Reuse login styles for consistency

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Cadastro:", formData);
    alert("Cadastro realizado com sucesso! (Simulado)");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Criar Conta</h1>
        <p>Cadastre-se para acessar o sistema.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Nome Completo
            <input
              type="text"
              name="nome"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            CRM
            <input
              type="number"
              name="crm"
              placeholder="crm"
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            CPF
            <input
              type="number"
              name="cpf"
              placeholder="Seu cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="senha"
              placeholder="••••••••"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Confirmar Senha
            <input
              type="password"
              name="confirmarSenha"
              placeholder="••••••••"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Cadastrar</button>
        </form>

        <div className="login-footer">
          <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
}
