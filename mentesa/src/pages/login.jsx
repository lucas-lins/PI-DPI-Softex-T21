import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { authService } from "../utils/auth";
import nameImage from "../assets/name2.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    const result = authService.login(email, senha);

    if (result.success) {
        alert("Login realizado com sucesso! Bem-vindo(a) " + result.user.nome);
        navigate("/dashboard"); // Se logar manda pro dashboard
    } else {
        alert(result.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
            <img src={nameImage} alt="MenteSã" className="login-logo-img" />
        </div>
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
            <div className="password-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                />
                <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                </button>
            </div>
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
