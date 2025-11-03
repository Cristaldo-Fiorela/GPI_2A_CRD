# Guía de Instalación del Entorno de Desarrollo

## Requisitos Previos

Antes de comenzar, asegúrate de tener Node.js instalado en tu sistema.

## 1. Instalación de MySQL

### Descargar MySQL
1. Accede al sitio oficial de MySQL: https://dev.mysql.com/downloads/mysql/
2. Descarga la versión correspondiente a tu sistema operativo
3. Ejecuta el instalador y sigue las instrucciones

**Importante:** Durante la instalación, anota la contraseña de root que configures, ya que la necesitarás más adelante.

## 2. Instalación de MySQL Workbench

### Descargar Workbench
1. Accede a: https://dev.mysql.com/downloads/workbench/
2. Descarga la versión correspondiente a tu sistema operativo
3. Ejecuta el instalador

### Tutorial de Instalación
Puedes seguir este video tutorial paso a paso que cubre la instalación completa:
- **Video guía:** https://www.youtube.com/watch?v=EmQZt6o6-78

## 3. Configuración de la Base de Datos

### ¿Quién debe ejecutar el script?

**Para trabajo en equipo local:**
- Si cada desarrollador trabaja con su propia base de datos local (cada uno tiene MySQL en su PC), **todos los miembros del equipo** (tanto frontend como backend) deben ejecutar el script para crear las tablas en su entorno local.
- Cada desarrollador tendrá su propia copia de los datos.

**Para trabajo con base de datos compartida:**
- Solo el equipo de backend ejecuta el script una vez en el servidor compartido.
- El equipo de frontend se conecta a esa instancia remota.

### Ejecutar el Script de Creación de Tablas

1. Abre MySQL Workbench
2. Conéctate a tu instancia local de MySQL (generalmente `localhost:3306`)
3. Navega a la carpeta del proyecto: `backend/database/`
4. Abre el archivo `schema.sql`
5. Ejecuta el script completo para crear las tablas necesarias

**Ubicación del script:** `backend/database/schema.sql`

## 4. Configuración del Backend

### Configurar Variables de Entorno

1. Navega a la carpeta `backend` del proyecto
2. Crea un archivo nuevo llamado `.env`
3. Copia el contenido del archivo `.env.example` que se encuentra en la misma carpeta
4. Completa las variables de entorno con tus credenciales locales:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_de_tu_db
DB_PORT=3306
```

**Nota:** Cada miembro del equipo debe configurar sus propias credenciales según su instalación local de MySQL.

### Instalar Dependencias y Ejecutar el Servidor

1. Abre una terminal
2. Navega a la carpeta backend:
   ```bash
   cd backend
   ```

3. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm run start
   ```

## 5. Verificación

Si todo está configurado correctamente, deberías ver un mensaje indicando que el servidor está corriendo.

Las APIs estarán disponibles en:
- `http://localhost:3000/api/integrantes`
- `http://localhost:3000/api/puestos`

Puedes probar estos endpoints desde tu navegador o usando herramientas como Postman o Thunder Client.

## Solución de Problemas Comunes

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Revisa que las credenciales en el archivo `.env` sean correctas
- Asegúrate de que el puerto 3306 esté disponible

### Error al ejecutar el script SQL
- Verifica que tengas permisos suficientes en MySQL
- Asegúrate de que no existan tablas con los mismos nombres

### El servidor no inicia
- Verifica que el puerto 3000 esté disponible
- Revisa que todas las dependencias se hayan instalado correctamente con `npm install`

---

## Notas Adicionales

- **Archivo `.env`**: Este archivo NO debe subirse al repositorio (debe estar en `.gitignore`)
- **Trabajo en equipo**: Cada desarrollador debe seguir estos pasos en su máquina local