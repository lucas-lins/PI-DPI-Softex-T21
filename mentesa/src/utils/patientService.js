const DB_KEY_PATIENTS = "mentesa_patients_db";

export const patientService = {
  // Get all patients
  getPatients: () => {
    const patientsJSON = localStorage.getItem(DB_KEY_PATIENTS);
    return patientsJSON ? JSON.parse(patientsJSON) : [];
  },

  // Save a new patient
  savePatient: (patientData) => {
    const patients = patientService.getPatients();
    
    // Check if patient already exists (simple check by name for now, or ID if we generated one)
    // For this MVP, we'll assume a combination of name and birthdate/age should be unique enough, 
    // or just allow multiples for now but warn. Let's simple check by exact name to avoid double click duplicates.
    const existingPatient = patients.find(p => p.nome === patientData.nome);
    if (existingPatient) {
      return { success: false, message: "Já existe um paciente cadastrado com este nome." };
    }

    // Add ID and timestamp
    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString()
    };

    patients.push(newPatient);
    localStorage.setItem(DB_KEY_PATIENTS, JSON.stringify(patients));
    
    return { success: true, message: "Paciente cadastrado com sucesso!" };
  }
};
