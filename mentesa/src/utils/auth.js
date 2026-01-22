const DB_KEY = "mentesa_users_db";
const CURRENT_USER_KEY = "mentesa_current_user";

export const authService = {
  // Get all users from localStorage
  getUsers: () => {
    const usersJSON = localStorage.getItem(DB_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
  },

  // Save a new user
  saveUser: (userData) => {
    const users = authService.getUsers();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }

    // Add new user
    users.push(userData);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    
    return { success: true, message: "Usuário cadastrado com sucesso!" };
  },

  // Login user
  login: (email, password) => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.senha === password);

    if (user) {
      // Save current session (simple version)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        nome: user.nome,
        email: user.email,
        crm: user.crm,
        cpf: user.cpf
      }));
      return { success: true, user: user };
    }

    return { success: false, message: "E-mail ou senha inválidos." };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current logged user
  getCurrentUser: () => {
    const userJSON = localStorage.getItem(CURRENT_USER_KEY);
    return userJSON ? JSON.parse(userJSON) : null;
  }
};
