 # Ultimate Fitness - Descripción del Backend del proyecto

  ## Requisitos
  - Docker y Docker Compose
  - Node 18+ (para build frontend local)
  - Git
  - Opcional: PHP/Symfony/Composer si quieres desarrollar backend fuera de Docker

  ## Instalación
  1) Clonar: `git clone https://github.com/aimansito/UltimateFitness-App && cd UltimateFitness-App`
  2) Backend: copiar `backend/.env` a `backend/.env.local` y ajustar:
     - `APP_ENV`, `APP_SECRET`
     - `DATABASE_URL`
     - `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`, `JWT_PASSPHRASE`
  3) Frontend: crear `frontend/.env` con `VITE_API_URL=http://localhost:8000/api` (o tu dominio en
  prod)
  4) BD: los scripts `database/docker-entrypoint-initdb.d/01_crear_bd.sql` y `02_datos_prueba.sql` se
  ejecutan solos al primer arranque de MySQL en Docker.

  ## Estructura de carpetas
  - `backend/`: Symfony (controllers, entities, config, security)
  - `frontend/`: React + Vite + Tailwind
  - `database/`: Dockerfile de MySQL y scripts init (`docker-entrypoint-initdb.d`)
  - `docker/`: configs de Nginx (`nginx/default.conf`, `nginx/railway.conf`) y PHP-FPM (`php/
  www.conf`)
  - `docker-compose.yml`: define servicios (mysql, backend, nginx, frontend, phpmyadmin)

  ## Variables de entorno
  - Backend: `APP_ENV`, `APP_SECRET`, `DATABASE_URL`, `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`,
  `JWT_PASSPHRASE`, CORS si aplica.
  - Frontend: `VITE_API_URL` apuntando a la API (`https://ultimatefitnessuf.com/api` en prod).

  ## Lanzar servidor (local con Docker)
  - `docker compose up -d --build`
  - Acceso: API vía Nginx en `http://localhost:8000`, frontend en `http://localhost:3000` (según tu
  compose), phpMyAdmin en `http://localhost:8080` si está habilitado.

  ## Comandos útiles
  - Logs: `docker compose logs -f backend nginx mysql`
  - Migraciones (en contenedor backend): `docker compose exec backend php bin/console
  doctrine:migrations:migrate`
  - Limpiar caché Symfony: `docker compose exec backend php bin/console cache:clear`
  - Frontend sin Docker (dev): `cd frontend && npm install && npm run dev`

  Con esto cumples los puntos: requisitos, instalación, estructura, env vars, arranque y comandos
  clave.