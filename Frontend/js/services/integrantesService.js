// services/integrantesService.js
// URL base de tu backend (ajustá si hace falta)
const BASE_URL = "http://localhost:3000/api";

/** Helper HTTP genérico */
async function http(method, url, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
    // credentials: "include", // activalo si usás sesiones/cookies
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${url}`, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) msg += ` - ${err.message}`;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

/** Util: separa primer palabra como nombre y resto como apellido */
function dividirNombre(nombreCompleto = "") {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 0) return { nombre: "", apellido: "" };
  if (partes.length === 1) return { nombre: partes[0], apellido: "" };
  return { nombre: partes.shift(), apellido: partes.join(" ") };
}

/**
 * Mapeos:
 *  API  → UI: { nombre, apellido, descripcion, foto_url, Puesto, id }
 *  UI   → API: { nombre, apellido?, descripcion, foto_url, Puesto }
 */
export const integrantesService = {
  // GET /api/integrantes
  async getAll() {
    return http("GET", "/integrantes");
  },

  // POST /api/integrantes
  // uiData: { nombreCompleto, correoTexto, rol, fotoUrl }
  async create(uiData) {
    const { nombre, apellido } = dividirNombre(uiData.nombreCompleto);
    const payload = {
      nombre,
      apellido,                              // opcional
      descripcion: uiData.correoTexto || "", // tu API usa 'descripcion'
      foto_url: uiData.fotoUrl || "",        // opcional
      Puesto: uiData.rol || "",              // 'rol' en UI ↔ 'Puesto' en API
      fecha_registro: new Date().toISOString()
    };
    return http("POST", "/integrantes", payload);
  },

  // PATCH /api/integrantes/:id  (cambiá a PUT si tu backend no soporta PATCH)
  async update(id, uiData) {
    const { nombre, apellido } = dividirNombre(uiData.nombreCompleto);
    const payload = {
      nombre,
      apellido,                              // opcional
      descripcion: uiData.correoTexto || "",
      foto_url: uiData.fotoUrl || "",
      Puesto: uiData.rol || ""
      // normalmente no se actualiza fecha_registro
    };
    // Si tu backend no tiene PATCH, cambia esta línea a "PUT"
    return http("PATCH", `/integrantes/${id}`, payload);
  },

  // DELETE /api/integrantes/:id
  async remove(id) {
    return http("DELETE", `/integrantes/${id}`);
  }
};
