# 🇳🇴 Backend - App de Aprendizaje de Noruego

Este es el backend para el proyecto final del Bootcamp Full-Stack en **Neoland**. Consiste en una API RESTful construida con Node.js y Express, utilizando MongoDB como base de datos y JWT para la autenticación segura.

## Tecnologías utilizadas
* **Node.js & Express**: Servidor y enrutamiento.
* **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
* **JWT (JSON Web Tokens)**: Autenticación y protección de rutas.
* **Bcryptjs**: Encriptación de contraseñas.
* **Arquitectura**: Patrón MVC (Modelos, Vistas/Rutas, Controladores).

## Endpoints Principales
* `POST /api/auth/register` - Registro de nuevos usuarios.
* `POST /api/auth/login` - Inicio de sesión y generación de token.
* `POST /api/vocab/` - (Protegido) Añadir nueva palabra.
* `GET /api/vocab/` - (Protegido) Obtener vocabulario del usuario.
* `PUT /api/vocab/:id` - (Protegido) Actualizar una palabra.
* `DELETE /api/vocab/:id` - (Protegido) Borrar una palabra.

## Autor
**Sergio "Rusi"** - Desarrollador Full-Stack