import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Por enquanto só simula o login
    console.log("Login enviado:", { email, senha });

    // Exemplo de validação simples
    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    alert("Login OK (simulado).");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Entrar</h1>
        <p>Acesse a plataforma para acompanhar os registros.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <button type="submit">Entrar</button>
        </form>

        <small className="login-footer">
          Esqueceu a senha? Fale com o administrador.
          <br />
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </small>
      </div>
    </div>
  );
}
