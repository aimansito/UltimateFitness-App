# Ultimate Fitness App

## Descripción General
Plataforma integral de gestión deportiva diseñada para conectar entrenadores y clientes. Permite la administración eficiente de planes nutricionales, rutinas de entrenamiento personalizadas y seguimiento del progreso físico, todo centralizado en una aplicación web moderna y escalable.

---

## 1. Credenciales de Acceso (Datos de Prueba)
Utilice las siguientes credenciales para verificar las funcionalidades de cada rol:

| Rol | Email | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@email.com` | `admin123` | Acceso total al panel de control. |
| **Entrenador** | `carlos.entrenador@example.com` | `password123` | Gestión de clientes, dietas y rutinas. |
| **Usuario (Free)** | `sara@example.com` | `password123` | Acceso básico y visualización de planes. |
| **Usuario (Premium)**| `ana@example.com` | `password123` | Acceso a funciones exclusivas y chat. |

---

## 2. Requisitos del Sistema
*   **Docker Desktop**: (Con Docker Compose).
*   **Git**: Para clonar el repositorio.
*   **Node.js (v18+)**: Opcional, solo para ejecución local sin Docker.

## 3. Instalación y Configuración

### Paso 3.1. Clonado
```bash
git clone https://github.com/aimansito/UltimateFitness-App
cd UltimateFitness-App
```

### Paso 3.2. Configuración Backend
1.  `cd backend`
2.  `cp .env .env.local`
3.  Editar `.env.local` con DB y JWT keys.

### Paso 3.3. Configuración Frontend
1.  `cd ../frontend`
2.  Crear archivo `.env`: `VITE_API_URL=http://localhost:8000/api`

---

## 4. Despliegue y Ejecución
El proyecto está **completamente dockerizado**.

### Comando de Arranque
Desde la raíz del proyecto:
```bash
docker-compose up -d --build
```
*Este comando levanta Backend, Frontend, Base de Datos y Servidor Web.*

### Puertos de Acceso
*   **Web App**: [http://localhost:3000](http://localhost:3000)
*   **API**: [http://localhost:8000/api](http://localhost:8000/api)
*   **BD (PhpMyAdmin)**: [http://localhost:8080](http://localhost:8080)

---

## 5. Despliegue en Producción (Demo)
El proyecto se encuentra desplegado y funcional en la siguiente URL:

 **[VER PÁGINA AQUÍ](http://ultimatefitnessuf.com)** *(Ejemplo)*

---

## 6. Documentación Detallada
*   **[Manual de Usuario](./manual_usuario.md)**
*   **[Manual de Entrenador](./manual_entrenador.md)**
*   **[Manual de Administrador](./manual_administrador.md)**

---

## Stack Tecnológico
*   **Frontend**: React, Vite, TailwindCSS.
*   **Backend**: Symfony 6, API Platform.
*   **BD**: MySQL 8.
*   **Infraestructura**: Docker.
