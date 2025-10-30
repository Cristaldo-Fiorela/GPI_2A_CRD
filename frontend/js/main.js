import { integrantesService } from './services/integrantesService.js';

async function cargarIntegrantes() {
  try {
    const integrantes = await integrantesService.getAll();
    console.log(integrantes);
    // Renderizar en el DOM
  } catch (error) {
    console.error('Error al cargar integrantes:', error);
  }
}

// cargarIntegrantes();
document.addEventListener('DOMContentLoaded', cargarIntegrantes);