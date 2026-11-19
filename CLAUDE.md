# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ultimate Fitness is a fitness management platform connecting trainers and clients. It supports nutrition plans, training routines, and progress tracking with three distinct user roles: `admin`, `entrenador` (trainer), and `cliente` (user, free or premium).

**Stack:** React 19 + Vite (frontend) · Symfony 7.1 + API Platform 3.3 (backend) · MySQL 8 · Docker

---

## Running the Project

### With Docker (recommended)
```bash
# From project root
docker-compose up -d --build
```
- Web App: http://localhost:3000
- API: http://localhost:8000/api
- phpMyAdmin: http://localhost:8080

### Frontend (local)
```bash
cd frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:8000/api
npm run dev         # dev server
npm run build       # production build
npm run lint        # ESLint
npm run test        # Vitest (Storybook tests via Playwright/Chromium)
npm run storybook   # Storybook on port 6006
```

### Backend (local)
```bash
cd backend
composer install
# Copy .env to .env.local and configure DB_URL and JWT keys
php bin/console doctrine:migrations:migrate
php bin/symfony server:start   # or: php -S localhost:8000 -t public/
```

---

## Architecture

### Dual Authentication System

The app has **two separate auth flows** with separate JWT tokens stored in `localStorage`:

| Token key | User | Context |
|---|---|---|
| `token` | Admin / Cliente | `AuthContext.jsx` → `authService.js` |
| `token_entrenador` | Entrenador | `AuthContextEntrenador.jsx` → `authServiceEntrenador.js` |

The axios instance in `frontend/src/services/api.js` automatically selects the correct token: routes starting with `/entrenador` or containing `/custom/entrenador` use `token_entrenador`; all others use `token`.

On 401 responses, the interceptor clears the appropriate token and redirects to `/login` or `/entrenador/login`.

### Frontend Routing

`DashboardRouter.jsx` is the `/dashboard` entry point — it reads the user's `rol` and redirects to `/admin/dashboard`, `/entrenador/dashboard`, or `/user/dashboard`. Pages are organized under `src/pages/{admin,entrenador,user,public,private}/`.

### Backend API

All routes use PHP attributes and are auto-discovered from `src/Controller/`. API Platform is configured with `operations: []` on most entities to **disable automatic CRUD endpoints** — all endpoints are custom controllers. Route prefix is `/api` (set in `config/routes.yaml` and Symfony config).

JWT is handled by `lexik/jwt-authentication-bundle`. Login success handlers (`src/Security/`) return user data and role-specific tokens. The `Entrenador` entity is separate from `Usuario` and has its own login endpoint.

### Key Entities

- `Usuario` — clients and admins (implements `UserInterface`), roles: `admin` / `cliente`
- `Entrenador` — trainers, separate entity with separate auth
- `Dieta` / `DietaPlato` / `Plato` / `Alimento` — nutrition plan hierarchy
- `Entrenamiento` / `DiaEntrenamiento` / `DiaEjercicio` / `Ejercicio` — training plan hierarchy
- `Suscripcion` / `HistorialPago` — subscription management (Stripe integration)
- `CalendarioUsuario` — user calendar entries
- `BlogPost` — blog with public preview and authenticated full access

### File Storage

File uploads use `league/flysystem-bundle` with AWS S3 v3 adapter (configured for production). Local storage is used in development.

### Local backend after PHP changes
The local container runs with `opcache.revalidate_freq=60`. After editing PHP or config:
```bash
MSYS_NO_PATHCONV=1 docker exec ultimatefitness_backend sh -c "php bin/console cache:clear; chown -R www-data:www-data var; apache2ctl -k graceful"
```
`composer install` must keep the optimized, authoritative classmap (set in `composer.json`); without it every request takes seconds on the bind mount.

### Database Migrations

```bash
cd backend
php bin/console doctrine:migrations:diff    # generate migration from entity changes
php bin/console doctrine:migrations:migrate # apply migrations
```

---

## Environment Configuration

**Backend** (`backend/.env.local`):
- `DATABASE_URL` — MySQL DSN
- `JWT_SECRET_KEY` / `JWT_PUBLIC_KEY` / `JWT_PASSPHRASE`
- AWS S3 credentials for file storage

**Frontend** (`frontend/.env`):
- `VITE_API_URL` — backend API base URL (default: `http://localhost:8000/api`)

## Social media posts

When asked to create/update social media post images (Instagram/TikTok), read `SOCIAL_POSTS.md` first — it fixes the format (1080×1350), brand colors/fonts, logo placement, and the 4 reusable post archetypes so new posts stay visually consistent. It also says when to flag content that doesn't fit an existing archetype instead of improvising.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
