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
const editarCorreo = document.getElementById("editar-correo");
const editarRol    = document.getElementById("editar-rol");

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
  const rol   = i.Puesto || "Sin rol";
  const corr  = i.descripcion || "—";

  // ⚠️ No usamos disabled (si no, no dispara click). Solo marcamos si no hay id.
  const sinIdAttr = id ? "" : "data-sinid='1' title='Este registro no tiene ID desde la API'";

  return `
    <td><img src="${foto}" alt="Foto" class="avatar"></td>
    <td class="celda-nombre">${nombre}</td>
    <td class="celda-rol">${rol}</td>
    <td class="celda-correo">${corr}</td>
    <td class="acciones">
      <button class="btn btn-editar" data-accion="editar" data-id="${id ?? ""}" ${sinIdAttr}>Editar</button>
      <button class="btn btn-eliminar" data-accion="eliminar" data-id="${id ?? ""}" ${sinIdAttr}>Eliminar</button>
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
    console.error("Error al cargar puestos:", error); // <-- corrige err → error
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

// cargarIntegrantes();
document.addEventListener('DOMContentLoaded', cargarIntegrantes);

/* ======= Estado para editar / eliminar ======= */
let idSeleccionado = null;
let datosSeleccionados = null;

/* ======= Delegación de clicks en la tabla (Editar / Eliminar) ======= */
cuerpoTabla.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const accion = btn.dataset.accion;
  const id = btn.dataset.id ? Number(btn.dataset.id) : null;
  if (!accion) return;

  // Tomo referencias visibles de la fila (para mostrar algo aunque no haya id)
  const fila = btn.closest("tr");
  const nombreTexto = fila?.querySelector(".celda-nombre")?.textContent?.trim() || "";
  const descripcionTexto = fila?.querySelector(".celda-correo")?.textContent?.trim() || "—";
  const [nombreSel = "", ...restoApellido] = nombreTexto.split(" ");
  const apellidoSel = restoApellido.join(" ").trim();

  if (accion === "editar") {
    // Abrimos SIEMPRE el modal (aunque no haya id)
    abrir("modal-editar");

    // Limpiamos mensajes y cargamos roles en el select del modal Editar
    const errorEditar = document.getElementById("error-msg-editar");
    if (errorEditar) { errorEditar.textContent = ""; errorEditar.style.display = "none"; }

    await cargarPuestos(editarRol);

    if (!id) {
      // Sin id: prellenamos con lo visible y avisamos que no se podrá guardar
      if (editarNombre) editarNombre.value = nombreSel;
      const editarApellido = document.getElementById("editar-apellido");
      if (editarApellido) editarApellido.value = apellidoSel;
      if (editarCorreo) editarCorreo.value = ""; // no lo tenemos en la tabla
      const editarDescripcion = document.getElementById("editar-descripcion");
      if (editarDescripcion) editarDescripcion.value = descripcionTexto;

      if (errorEditar) {
        errorEditar.textContent = "Este integrante no tiene ID desde la API. Podés editar los campos, pero no se puede guardar.";
        errorEditar.style.display = "block";
      }
      idSeleccionado = null;
      return;
    }

    // Con id: precargamos con la API
    try {
      idSeleccionado = id;
      const data = await integrantesService.getById(idSeleccionado);
      const integrante = Array.isArray(data) ? data[0] : data;

      const editarApellido = document.getElementById("editar-apellido");
      const editarDescripcion = document.getElementById("editar-descripcion");

      if (editarNombre) editarNombre.value = (integrante?.nombre ?? "").trim();
      if (editarApellido) editarApellido.value = (integrante?.apellido ?? "").trim();
      if (editarCorreo) editarCorreo.value = (integrante?.correo ?? "").trim();
      if (editarDescripcion) editarDescripcion.value = (integrante?.descripcion ?? "").trim();

      // Intento setear rol por id si viene
      const pid = integrante?.puesto_id ?? integrante?.id_puesto ?? null;
      if (editarRol && pid != null) editarRol.value = String(pid);
    } catch (err) {
      console.error("No se pudo precargar el integrante:", err);
    }
  }

  if (accion === "eliminar") {
    // Abrimos SIEMPRE el modal
    abrir("modal-eliminar");

    // Texto del modal
    if (nombreAEliminar) nombreAEliminar.textContent = nombreTexto || (id ? `ID ${id}` : "Sin ID");

    // Guardamos contexto para confirmar
    idSeleccionado = id; // puede ser null
    datosSeleccionados = { nombre: nombreSel, apellido: apellidoSel };

    // En tu service, si no hay id usa nombre+apellido en el body del DELETE.
    // Por eso habilitamos el botón siempre.
    if (confirmarEliminarBtn) confirmarEliminarBtn.disabled = false;
  }
});

/* ======= Guardar cambios (EDITAR) ======= */
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const errorEditar = document.getElementById("error-msg-editar");
  if (errorEditar) { errorEditar.textContent = ""; errorEditar.style.display = "none"; }

  if (!idSeleccionado) {
    if (errorEditar) {
      errorEditar.textContent = "No se puede guardar porque este integrante no tiene ID expuesto por la API.";
      errorEditar.style.display = "block";
    }
    return;
  }

  // Tomo valores del modal Editar
  const editarApellido = document.getElementById("editar-apellido");
  const editarDescripcion = document.getElementById("editar-descripcion");

  const cambios = {
    nombre: (editarNombre?.value || "").trim(),
    apellido: (editarApellido?.value || "").trim(),
    correo: (editarCorreo?.value || "").trim(),         // si tu API lo ignora, no pasa nada
    descripcion: (editarDescripcion?.value || "").trim(),
    puesto_id: (editarRol?.value || "").trim(),
  };

  try {
    await integrantesService.updateIntegrante(idSeleccionado, cambios);
    cerrar("modal-editar");
    await cargarIntegrantes();
  } catch (error) {
    console.error("Error al actualizar integrante", error);
    if (errorEditar) {
      errorEditar.textContent = error.message || "Error al actualizar el integrante";
      errorEditar.style.display = "block";
    }
  }
});

/* ======= Confirmar (ELIMINAR) ======= */
confirmarEliminarBtn.addEventListener("click", async () => {
  try {
    await integrantesService.deleteIntegrante(idSeleccionado, datosSeleccionados);
    cerrar("modal-eliminar");
    await cargarIntegrantes();
  } catch (error) {
    console.error("Error al eliminar", error);
    alert(error.message || "No se pudo eliminar");
  }
});
