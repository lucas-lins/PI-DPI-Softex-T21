import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { validators } from "../utils/validators";
import { authService } from "../utils/auth";
import nameImage from "../assets/name2.png";

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  //Essa função pega o valor digitado pelo usuario e salva no estado
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    //Limpa o alerta de erro quando o usuario corrige
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  //Essa função valida o campo
  function validateField(name, value) {
    let error = null;

    switch (name) {
      case "nome":
        if (!validators.isValidName(value)) {
          error = "Nome deve ter entre 3 e 100 caracteres.";
        }
        break;
      case "crm":
        if (!validators.isValidCRM(value)) {
          error = "CRM inválido (deve conter apenas números e ter entre 4 e 10 dígitos).";
        }
        break;
      case "cpf":
        if (!validators.isValidCPF(value)) {
          error = "CPF inválido.";
        }
        break;
      case "email":
        if (!validators.isValidEmail(value)) {
          error = "E-mail inválido.";
        }
        break;
      case "senha":
        if (value.length < 6) {
          error = "A senha deve ter pelo menos 6 caracteres.";
        }
        break;
      case "confirmarSenha":
        if (value !== formData.senha) {
          error = "As senhas não coincidem!";
        }
        break;
      default:
        break;
    }

    return error;
  }

  //Essa função valida o campo quando o usuario sai dele
  function handleBlur(e) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    // Se tiver erro, mostra o alerta, se não, limpa
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Valida todos os campos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tenta salvar o usuario
    const result = authService.saveUser(formData);
    
    if (result.success) {
        alert(result.message);
        navigate("/login"); // Se salvou, redireciona para a pagina de login
    } else {
        alert(result.message); // Se não salvou, mostra o erro
        if (result.message.includes("e-mail")) {
            setErrors(prev => ({ ...prev, email: result.message }));
        }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
            <img src={nameImage} alt="MenteSã" className="login-logo-img" />
        </div>
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
              onBlur={handleBlur}
              className={errors.nome ? "input-error" : ""}
              required
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </label>

          <label>
            CRM
            <input
              type="number"
              name="crm"
              placeholder="00000"
              value={formData.crm}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.crm ? "input-error" : ""}
              required
            />
            {errors.crm && <span className="error-message">{errors.crm}</span>}
          </label>

          <label>
            CPF
            <input
              type="number"
              name="cpf"
              placeholder="Apenas números"
              value={formData.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.cpf ? "input-error" : ""}
              required
            />
             {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? "input-error" : ""}
              required
            />
             {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label>
            Senha
            <div className="password-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                name="senha"
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.senha ? "input-error" : ""}
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
             {errors.senha && <span className="error-message">{errors.senha}</span>}
          </label>

          <label>
            Confirmar Senha
            <div className="password-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                name="confirmarSenha"
                placeholder="••••••••"
                value={formData.confirmarSenha}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.confirmarSenha ? "input-error" : ""}
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
             {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
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
