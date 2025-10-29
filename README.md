# 🛠️ Grupo 3 - Equipo de Administración

> **Proyecto Académico** - Este repositorio es parte de un proyecto colaborativo desarrollado junto con nuestros compañeros de clase, dividido en 3 equipos de trabajo que se integran para crear una aplicación web completa.

## 📋 Descripción del Proyecto

Este módulo corresponde al **Panel de Administración** de la aplicación web de empresa de software InnovaTech. Somos responsables de desarrollar la interfaz privada que permite gestionar los integrantes del equipo y visualizar los mensajes de contacto recibidos.

### Contexto del Proyecto

Este es uno de los **tres módulos** que componen el proyecto completo:

- **Grupo 1**: Sistema de Login y Autenticación
- **Grupo 2**: Página Principal y Vista Pública
- **Grupo 3**: Panel de Administración (este repositorio)

Cada equipo trabaja de forma independiente en su repositorio, pero todos los módulos se integran para formar una aplicación web funcional y completa.

## 🎯 Responsabilidades Principales

### 1. Interfaz de Administración Privada
- Desarrollo de una interfaz accesible únicamente para usuarios con rol **"Administrador"**

### 2. CRUD Completo de Integrantes
Gestión completa de los miembros del equipo que se muestran en la vista principal:

- **Crear**: Agregar nuevos integrantes al equipo
- **Leer**: Listar todos los integrantes registrados
- **Actualizar**: Modificar información de integrantes existentes
- **Eliminar**: Remover integrantes del sistema

### 3. Gestión de Mensajes de Contacto
- Visualización de mensajes recibidos desde el formulario público
- Sistema de lectura exclusivo para administradores

### 4. Diseño de Base de Datos
Diseño e implementación de la estructura de base de datos MySQL compartida:

**Tablas:**
- `usuarios` - Sistema de autenticación (compartida con Grupo 1)
- `integrantes` - Datos del equipo (alimenta la vista del Grupo 2)
- `mensajes` - Formularios de contacto (recibidos del Grupo 2)

## 👥 Equipo de Desarrollo

### 🎖️ Líder Técnico
- [@Cristaldo-Fiorela](https://github.com/Cristaldo-Fiorela)

### 💻 Desarrolladoras Backend
- [@daianayb](https://github.com/daianayb)
- [@Moratech](https://github.com/Moratech)

### 🎨 Desarrolladores Frontend
- [@NuriaGraef](https://github.com/NuriaGraef)
- [@Santilev](https://github.com/Santilev)

## 🔧 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MySQL

### Arquitectura
- REST API (Cliente-Servidor)
- Autenticación basada en roles
- Base de datos relacional

## 📄 Licencia

Este proyecto es parte de un trabajo académico desarrollado en colaboración con nuestros compañeros de clase.

---

**Última actualización:** Octubre 2025  
**Proyecto Académico** - Desarrollado con fines educativos