import { integrantesService } from './services/integrantesService.js';
import { puestosService } from './services/puestosService.js';

/* ======= Referencias de DOM ======= */
const cuerpoTabla = document.getElementById("cuerpo-tabla");

// Modales
const modalNuevo    = document.getElementById("modal-nuevo");
const modalEditar   = document.getElementById("modal-editar");
const modalEliminar = document.getElementById("modal-eliminar");

// Formularios
const formNuevo  = document.getElementById("form-nuevo");
const formEditar = document.getElementById("form-editar");

// Inputs EDITAR
const editarNombre = document.getElementById("editar-nombre");
const editarApellido = document.getElementById("editar-apellido");
const editarRol    = document.getElementById("editar-rol");
const editarDescripcion = document.getElementById("editar-descripcion");
const editarIMG = document.getElementById("editar-img");

// Inputs NUEVO
const nuevoNombre = document.getElementById("nuevo-nombre");
const nuevoApellido   = document.getElementById("nuevo-apellido");
const nuevoCorreo = document.getElementById("nuevo-correo");
const nuevoRol    = document.getElementById("nuevo-rol");
const nuevoDescripcion = document.getElementById("nuevo-descripcion");
const nuevoIMG = document.getElementById("nuevo-img");

// ERRORES
const errorMsg = document.getElementById('error-msg');

// Botones
const abrirModalNuevoBtn  = document.getElementById("abrir-modal-nuevo");
const confirmarEliminarBtn = document.getElementById("confirmar-eliminar");

// Texto en modal eliminar
const nombreAEliminar = document.getElementById("nombre-a-eliminar");

/* ======= Utils de modales ======= */
const abrir  = (id) => document.getElementById(id).classList.add("abierto");
const cerrar = (id) => document.getElementById(id).classList.remove("abierto");

document.querySelectorAll("[data-cerrar]").forEach((b) => {
  b.addEventListener("click", () => b.closest(".modal").classList.remove("abierto"));
});
document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("abierto"); });
});


function apiToUiNombre(i) {
  return `${i.nombre ?? ""} ${i.apellido ?? ""}`.trim();
}

function uiFilaHTML(i) {
  const id    = i.id;
  const foto  = i.foto_url || "https://i.ibb.co/jrZ8D2d/profile.png";
  const nombre = apiToUiNombre(i) || "Sin nombre";
  const rol   = i.puesto || "Sin rol";
  const corr  = i.descripcion || "—";

  const disabled = id ? "" : "disabled title='Sin id: no editable'";

  return `
    <td><img src="${foto}" alt="Foto" class="avatar"></td>
    <td class="celda-nombre">${nombre}</td>
    <td class="celda-rol">${rol}</td>
    <td class="celda-correo">${corr}</td>
    <td class="acciones">
      <button class="btn btn-editar" data-accion="editar" data-id="${id ?? ""}" ${disabled}>Editar</button>
      <button class="btn btn-eliminar" data-accion="eliminar" data-id="${id ?? ""}" ${disabled}>Eliminar</button>
    </td>
  `;
}

function renderizarIntegrantes(integrantes) {
  cuerpoTabla.innerHTML = "";
  integrantes.forEach((i) => {
    const tr = document.createElement("tr");
    if (i.id != null) tr.dataset.id = i.id;
    tr.innerHTML = uiFilaHTML(i);
    cuerpoTabla.appendChild(tr);
  });
}

/* ======= Carga inicial ======= */
async function cargarIntegrantes() {
  try {
    const integrantes = await integrantesService.getAll();
    renderizarIntegrantes(integrantes);
  } catch (err) {
    console.error("Error al cargar integrantes:", err);
  }
}

/* ======= CARGAR PUESTOS ======= */
async function cargarPuestos(selectElement) {
  try {
    const puestos = await puestosService.getAllPuestos();
    
    // limpieza de opciones menos la primera que es de default
    selectElement.innerHTML = '<option value="" disabled selected>Seleccionar rol</option>';

    // mapeo de puestos y creacion de cada opcion
    puestos.forEach(puesto => {
      // elemento HTML
      const opcion = document.createElement('option');

      // datos a llenar el elemento
      opcion.value = puesto.id;
      opcion.textContent = puesto.nombre;

      // insersion de datos en elemento creado
      selectElement.appendChild(opcion);
    })

  } catch (error) {
    console.error("Error al cargar puestos:", err);
    // Mostrar mensaje de error en el select
    selectElement.innerHTML = '<option value="">Error al cargar roles</option>';
  }
}

/* ======= ABRIR MODAL NUEVO ======= */
abrirModalNuevoBtn.addEventListener("click", async () => {
    abrir("modal-nuevo");
    // Cargar puestos cuando se abre el modal

    // Limpiar mensaje de error al abrir
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';

    await cargarPuestos(nuevoRol);
  });

/* ======= NUEVO INTEGRANTE ======= */
formNuevo.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // limpiar mensaje de error
  errorMsg.textContent = '';
  errorMsg.style.display = 'none';

  // datos de inputs
  const nuevoIntegrante = {
    nombre: nuevoNombre.value.trim(),
    apellido: nuevoApellido.value.trim(),
    correo: nuevoCorreo.value.trim(),
    puesto_id: nuevoRol.value.trim(),
    foto_url: nuevoIMG.value.trim() || '',
    descripcion: nuevoDescripcion.value.trim() || '',
  }

  try {
    const resultado =  await integrantesService.createIntegrante(nuevoIntegrante);
    console.log('Integrante creado con exito: ', resultado);

    // limpia el form
    formNuevo.reset();
    cerrar("modal-nuevo");

    // recargar tabla de integrantes
    await cargarIntegrantes();
  } catch (error) {
    console.error('Error al crear integrante', error);    
    errorMsg.textContent = error.message || 'Error al crear el integrante';
    errorMsg.style.display = 'block';
  }
});

/* ======= Estado para editar / eliminar ======= */

/* ======= EDITAR INTEGRANTE ======= */

// Var para guardar el ID del integrante que estamos editando
let integranteEditandoId = null;

// Delegación de eventos para los botones de editar
cuerpoTabla.addEventListener('click', async (e) => {
  const btnEditar = e.target.closest('[data-accion="editar"]');
  
  if (btnEditar) {
    const idElem = btnEditar.dataset.id;
    if (!idElem) return;
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
    
    try {
      // Obtener datos del integrante
      const integrante = await integrantesService.getOneIntegrante(idElem);
      console.log('Integrante obtenido:', integrante);
      
      // Guardar el ID que estamos editando
      integranteEditandoId = integrante.id;
      
      // Cargar puestos en el select PRIMERO
      await cargarPuestos(editarRol);
      
      // Llenar el formulario con los datos actuales
      editarNombre.value = integrante.nombre || '';
      editarApellido.value = integrante.apellido || '';
      editarDescripcion.value = integrante.descripcion || '';
      editarIMG.value = integrante.foto_url || '';

      // Seleccionar el puesto actual
      if (integrante.puestos && integrante.puestos.length > 0) {
        editarRol.value = integrante.puestos[0];
      }
      
      // Abrir modal
      abrir("modal-editar");
      
    } catch (error) {
      console.error('Error al cargar integrante:', error);
      errorMsg.textContent = error.message || 'Error al cargar los datos del integrante';
      errorMsg.style.display = 'block';
    }
  }
});

// Submit del formulario de editar
formEditar.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.textContent = '';
  errorMsg.style.display = 'none';
  
  if (!integranteEditandoId) {
    alert('Error: No hay integrante seleccionado');
    return;
  }

  const integranteActualizado = {
    id: integranteEditandoId,
    nombre: editarNombre.value.trim(),
    apellido: editarApellido.value.trim(),
    descripcion: editarDescripcion.value.trim(),
    foto_url: editarIMG.value.trim(),
    puestos: editarRol.value ? [parseInt(editarRol.value)] : []
  };
  
  try {
    await integrantesService.editarIntegrante(integranteActualizado);
    
    // Limpiar y cerrar
    formEditar.reset();
    integranteEditandoId = null;
    cerrar("modal-editar");
    
    // Recargar tabla
    await cargarIntegrantes();
    
  } catch (error) {
    console.error('Error al actualizar integrante:', error);
    errorMsg.textContent = error.message || 'Error al actualizar el integrante';
    errorMsg.style.display = 'block';
  }
});
// Var para guardar el ID del integrante que vamos a eliminar
let integranteEliminandoId = null;
cuerpoTabla.addEventListener('click', async (e) => {
  const btnEliminar = e.target.closest('[data-accion="eliminar"]');
  if (!btnEliminar) return;

  const id = btnEliminar.dataset.id;
  if (!id) return;

  // guardamos el id a eliminar
  integranteEliminandoId = id;

  // mostramos el nombre en el modal (tomado de la fila)
  const fila = btnEliminar.closest('tr');
  const nombre = fila?.querySelector('.celda-nombre')?.textContent?.trim() || 'este integrante';
  nombreAEliminar.textContent = nombre;

  // abrir modal
  abrir('modal-eliminar');
});
confirmarEliminarBtn.addEventListener('click', async () => {
  if (!integranteEliminandoId) return;

  try {
    await integrantesService.eliminarIntegrante(integranteEliminandoId);

    // limpiar estado y cerrar
    integranteEliminandoId = null;
    cerrar('modal-eliminar');

    // recargar tabla
    await cargarIntegrantes();
  } catch (error) {
    console.error('Error al eliminar integrante:', error);
    alert(error?.message || 'No se pudo eliminar el integrante');
  }
});

// Si se cierra el modal por "Cancelar" o clic afuera, limpiamos el estado
document.querySelectorAll('#modal-eliminar [data-cerrar], #modal-eliminar').forEach((el) => {
  el.addEventListener('click', (e) => {
    // si es el overlay o el botón cancelar
    if (e.target === el || e.target.hasAttribute('data-cerrar')) {
      integranteEliminandoId = null;
    }
  });
});

// cargarIntegrantes();
document.addEventListener('DOMContentLoaded', cargarIntegrantes);