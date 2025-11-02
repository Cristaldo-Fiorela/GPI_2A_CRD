import { integrantesService } from './services/integrantesService.js';

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
const nuevoCorreo = document.getElementById("nuevo-correo");
const nuevoRol    = document.getElementById("nuevo-rol");

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

// cargarIntegrantes();
document.addEventListener('DOMContentLoaded', cargarIntegrantes);