const API_URL = 'http://localhost:3000/api/puestos';

export const puestosService = {
  getAllPuestos: async () => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) throw new Error('Error al obtener puestos');
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      
      throw error;
    }
  },
};