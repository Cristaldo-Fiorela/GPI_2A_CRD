const API_URL = 'http://localhost:3000/api/integrantes';

export const integrantesService = {
// Exporta un objeto llamado 'integrantesService' para que puedas importarlo en otros archivos
// Ejemplo: import { integrantesService } from './services/integrantesService.js'; en main.js

  // Obtener todos los integrantes
  getAll: async () => {
  // Define una función asíncrona llamada 'getAll'
  // 'async' permite usar 'await' dentro de la función para esperar respuestas de operaciones que toman tiempo (como peticiones HTTP) sin bloquear el resto del código
  
    try {
    // Inicia un bloque try-catch para manejar errores
    
      const response = await fetch(API_URL);
      // Hace una petición GET a la URL de la API
      // fetch puede recibir varios parametros, al tratarse de un GET no hace falta pero es necesario aclarar. Les dejo la documentacion https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#setting_the_method
      // 'await' espera a que la petición se complete antes de continuar
      // variable 'response' contiene la respuesta del servidor (headers, status, etc.)
      
      if (!response.ok) throw new Error('Error al obtener integrantes');
      // Verifica si la respuesta es exitosa (status 200-299)
      // Si no es exitosa (ej: 404, 500), lanza un error
      // 'response.ok' es true si el status está entre 200-299
      
      return await response.json();
      // Convierte la respuesta (que viene en formato JSON string) a un objeto JavaScript
      // 'await' espera a que se complete la conversión
      // Retorna los datos convertidos
      
    } catch (error) {
    // Captura cualquier error que ocurra en el bloque try
    
      console.error('Error:', error);
      // Muestra el error en la consola del navegador para debugging
      
      throw error;
      // Re-lanza el error para que quien llame a esta función pueda manejarlo
      // Ejemplo: el componente que usa getAll() puede mostrar un mensaje al usuario
    }
  },

  // get de integrantes por ID, delete, post. get de puestos. 
}