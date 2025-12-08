# manual_instalacion.md - Guía de Instalación Ultimate Fitness

## 1. Requisitos Previos
Para desplegar la aplicación correctamente, asegúrate de tener instalado:
*   **Docker Desktop** (incluye Docker Compose).
*   **Git** (para clonar el repositorio).
*   **Node.js 18+** (Opcional, solo si deseas ejecutar el frontend fuera de Docker).

## 2. Clonado del Repositorio
Abre tu terminal y ejecuta:

```bash
git clone https://github.com/aimansito/UltimateFitness-App
cd UltimateFitness-App
```

## 3. Configuración de Variables de Entorno (.env)

### Backend
1.  Navega a la carpeta `backend/`.
2.  Copia el archivo de ejemplo:
    ```bash
    cp .env .env.local
    ```
3.  Edita `.env.local` con tus credenciales:
    *   `DATABASE_URL`: Cadena de conexión a MySQL (ej. `mysql://user:pass@mysql:3306/db`).
    *   `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`, `JWT_PASSPHRASE`: Claves para la autenticación JWT.

### Frontend
1.  Navega a la carpeta `frontend/`.
2.  Crea un archivo `.env` (o `.env.local`) y define la URL de la API:
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```
    *(Usa `https://tu-dominio.com/api` en producción)*.

## 4. Lanzar con Docker
Desde la raíz del proyecto (donde está `docker-compose.yml`), ejecuta:

```bash
docker-compose up -d --build
```
Esto levantará los contenedores de:
*   MySQL (Base de datos)
*   Backend (Symfony PHP)
*   Frontend (React + Nginx)
*   Nginx (Proxy inverso)
*   PhpMyAdmin (Gestor BD)

### Verificar Estado
Ejecuta `docker-compose ps` para ver que todos los servicios estén en estado "Up" o "Healthy".

## Carga de Datos
La base de datos se inicializa automáticamente la primera vez gracias a los scripts en `database/docker-entrypoint-initdb.d/`.

Si necesitas correr migraciones manualmente o actualizar la BD:
```bash
docker-compose exec backend php bin/console doctrine:schema:update --force
```

## 6. Acceso a la Aplicación
*   **Web App**: [http://localhost:3000](http://localhost:3000)
*   **API**: [http://localhost:8000/api](http://localhost:8000/api)
*   **PhpMyAdmin**: [http://localhost:8080](http://localhost:8080)
