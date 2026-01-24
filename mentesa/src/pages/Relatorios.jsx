import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 
import { authService } from "../utils/auth";
import { patientService } from "../utils/patientService";
import logoImage from "../assets/logo2.png"; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

export default function Relatorios() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      setPatients(patientService.getPatients());
    }
  }, [navigate]);

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  // --- DATA PROCESSING FOR CHARTS ---

  // 1. Age Distribution (Histogram-like)
  const ageData = useMemo(() => {
    const bins = {
        "0-59": 0,
        "60-69": 0,
        "70-79": 0,
        "80-89": 0,
        "90+": 0
    };

    patients.forEach(p => {
        const age = parseInt(p.idade) || 0;
        if (age < 60) bins["0-59"]++;
        else if (age < 70) bins["60-69"]++;
        else if (age < 80) bins["70-79"]++;
        else if (age < 90) bins["80-89"]++;
        else bins["90+"]++;
    });

    return Object.keys(bins).map(key => ({ name: key, quantidade: bins[key] }));
  }, [patients]);

  // 2. Dementia Stages (Pie Chart)
  const stageData = useMemo(() => {
    const counts = {};
    patients.forEach(p => {
        const stage = p.estagio || "Indefinido";
        counts[stage] = (counts[stage] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [patients]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 3. Age vs Stage (Scatter Plot)
  const correlationData = useMemo(() => {
    // Map stage to numeric value for Y-axis
    const stageMap = {
        "Indefinido": 0,
        "Inicial": 1,
        "Moderado": 2,
        "Avançado": 3
    };

    return patients.map(p => ({
        age: parseInt(p.idade) || 0,
        stage: stageMap[p.estagio || "Indefinido"],
        stageName: p.estagio || "Indefinido",
        nome: p.nome
    }));
  }, [patients]);


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
            <h2>Relatórios e Análises</h2>
            <Link to="/dashboard" className="btn-logout" style={{textDecoration: 'none'}}>Voltar</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            
            {/* Row 1: Age & Stages */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
                
                {/* Chart 1: Age Distribution */}
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#333", textAlign: "center" }}>Distribuição por Idade</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidade" name="Pacientes" fill="#0056b3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Stages */}
                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#333", textAlign: "center" }}>Nível de Demência</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: Correlation */}
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "1rem", color: "#333", textAlign: "center" }}>Relação Idade x Nível de Demência</h3>
                 <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="age" name="Idade" unit=" anos" domain={['dataMin - 5', 'dataMax + 5']} />
                            <YAxis 
                                type="number" 
                                dataKey="stage" 
                                name="Estágio" 
                                ticks={[0, 1, 2, 3]}
                                tickFormatter={(value) => ["Indefinido", "Inicial", "Moderado", "Avançado"][value] || ""}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div style={{ background: "white", padding: "10px", border: "1px solid #ccc" }}>
                                            <p>{`Paciente: ${data.nome}`}</p>
                                            <p>{`Idade: ${data.age}`}</p>
                                            <p>{`Estágio: ${data.stageName}`}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}/>
                            <Scatter name="Pacientes" data={correlationData} fill="#ff7300" shape="circle" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
