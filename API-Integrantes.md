# API de Integrantes - Documentación

## Descripción General

Esta API permite gestionar los integrantes del equipo y sus puestos asociados. Incluye operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar).

**Base URL:** `/api/integrantes`

---

## Endpoints

### 1. Obtener todos los integrantes

Retorna una lista de todos los integrantes con sus puestos asociados.

**Endpoint:** `GET /api/integrantes`

**Respuesta exitosa (200):**
```json
[
  {
    "nombre": "Fiorela",
    "apellido": "Cristaldo",
    "descripcion": "Desarrolladora full stack apasionada por React y Node.js",
    "foto_url": "https://i.pravatar.cc/150?img=1",
    "fecha_registro": "2024-10-15T10:30:00.000Z",
    "Puesto": "Frontend Developer"
  },
  {
    "nombre": "Lucas",
    "apellido": "Gómez",
    "descripcion": "Backend developer especializado en APIs",
    "foto_url": "https://i.pravatar.cc/150?img=2",
    "fecha_registro": "2024-10-15T10:30:00.000Z",
    "Puesto": "Backend Developer,Project Manager"
  }
]
```

**Respuesta sin resultados (404):**
```json
"No se encontraron integrantes."
```

**Respuesta de error (500):**
```json
{
  "error": "Error interno del servidor al consultar la base de datos."
}
```

---

### 2. Obtener un integrante por ID

Retorna la información de un integrante específico.

**Endpoint:** `GET /api/integrantes/:id`

**Parámetros de URL:**
- `id` (number, requerido): ID del integrante

**Ejemplo:** `GET /api/integrantes/1`

**Respuesta exitosa (200):**
```json
[
  {
    "nombre": "Fiorela",
    "apellido": "Cristaldo",
    "descripcion": "Desarrolladora full stack apasionada por React y Node.js",
    "foto_url": "https://i.pravatar.cc/150?img=1",
    "fecha_registro": "2024-10-15T10:30:00.000Z",
    "Puesto": "Frontend Developer"
  }
]
```

**Respuesta sin resultados (404):**
```json
"No se encontraron integrantes."
```

**Respuesta de error (500):**
```json
{
  "error": "Error interno del servidor al consultar la base de datos."
}
```

---

### 3. Crear un nuevo integrante

Crea un nuevo integrante en la base de datos.

**Endpoint:** `POST /api/integrantes`

**Body (JSON):**
```json
{
  "nombre": "María",
  "apellido": "Pérez",
  "descripcion": "Desarrolladora frontend con experiencia en Vue.js",
  "foto_url": "https://i.pravatar.cc/150?img=5"
}
```

**Campos:**
- `nombre` (string, **requerido**): Nombre del integrante
- `apellido` (string, **requerido**): Apellido del integrante
- `descripcion` (string, opcional): Descripción o biografía del integrante
- `foto_url` (string, opcional): URL de la foto de perfil

**Respuesta exitosa (201):**
```json
{
  "message": "Integrante creado correctamente",
  "id": 4
}
```

**Respuesta de error - Datos incompletos (400):**
```json
{
  "error": "Nombre y apellido son obligatorios"
}
```

**Respuesta de error (500):**
```json
{
  "error": "Error al insertar integrante"
}
```

---

### 4. Actualizar un integrante

Actualiza la información de un integrante existente y sus puestos asociados.

**Endpoint:** `PUT /api/integrantes/:id`

**Parámetros de URL:**
- `id` (number, requerido): ID del integrante a actualizar

**Body (JSON):**
```json
{
  "nombre": "María",
  "apellido": "Pérez",
  "descripcion": "Desarrolladora full stack con experiencia en Vue.js y Node.js",
  "foto_url": "https://i.pravatar.cc/150?img=5",
  "puestos": [1, 2]
}
```

**Campos:**
- `nombre` (string, requerido): Nombre actualizado del integrante
- `apellido` (string, requerido): Apellido actualizado del integrante
- `descripcion` (string, opcional): Descripción actualizada
- `foto_url` (string, opcional): URL de la foto actualizada
- `puestos` (array de numbers, opcional): IDs de los puestos a asignar

**Nota importante:** Los puestos previos se eliminan y se reemplazan por los nuevos. Si no se envía el campo `puestos` o está vacío, el integrante quedará sin puestos asociados.

**IDs de Puestos disponibles:**
- 1: Frontend Developer
- 2: Backend Developer
- 3: Diseñador UX/UI
- 4: Tester QA
- 5: Project Manager

**Respuesta exitosa (200):**
```json
{
  "message": "Integrante actualizado correctamente"
}
```

**Respuesta exitosa sin puestos (200):**
```json
{
  "message": "Integrante actualizado sin puestos asociados"
}
```

**Respuesta de error (500):**
```json
{
  "error": "Error al actualizar integrante"
}
```

---

### 5. Eliminar un integrante

Elimina un integrante de la base de datos. Los puestos asociados se eliminan automáticamente (CASCADE).

**Endpoint:** `DELETE /api/integrantes/:id`

**Parámetros de URL:**
- `id` (number, requerido): ID del integrante a eliminar

**Ejemplo:** `DELETE /api/integrantes/3`

**Respuesta exitosa (200):**
```json
{
  "message": "Integrante eliminado correctamente"
}
```

**Respuesta - Integrante no encontrado (404):**
```json
{
  "message": "Integrante no encontrado"
}
```

**Respuesta de error (500):**
```json
{
  "error": "Error al eliminar integrante"
}
```

---

## Notas adicionales

- El campo `Puesto` en las respuestas GET puede contener múltiples puestos separados por comas si el integrante tiene más de un puesto asignado.
- La `fecha_registro` se genera automáticamente al crear un integrante y no puede ser modificada.
- Al eliminar un integrante, todos sus puestos asociados en la tabla `Integrante_Puesto` se eliminan automáticamente.
- Todos los endpoints que modifican datos (POST, PUT, DELETE) devuelven un mensaje descriptivo del resultado de la operación.