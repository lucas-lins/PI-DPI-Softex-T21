export const validators = {
  isValidName: (name) => {
    if (!name) return false;
    return name.trim().length >= 3 && name.trim().length <= 100;
  },

  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidCRM: (crm) => {
    if (!crm) return false;
    const re = /^[0-9]{4,10}$/;
    return re.test(String(crm));
  },

  isValidCPF: (cpf) => {
    if (!cpf) return false;
    
    const cleanCPF = cpf.replace(/[^\d]+/g, '');
    
    if (cleanCPF.length !== 11) return false;
    
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  }
};
