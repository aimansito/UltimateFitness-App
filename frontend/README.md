# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Ultimate Fitness – Frontend (React + Vite)

## Instalación

npm install # o npm ci

## Descripción

SPA React/Vite/Tailwind que consume la API Symfony. Incluye rutas públicas (home, servicios, blog, login/registro, recuperar/restablecer contraseña) y privadas (dashboards usuario/entrenador/admin, dietas,
entrenos, suscripciones).

## Conexión con backend

- Define `VITE_API_URL` en `.env` apuntando a tu API:
  - Local: VITE_API_URL=http://localhost:8000/api
  - Producción: VITE_API_URL=https://ultimatefitnessuf.com/api
- Todas las llamadas usan `import.meta.env.VITE_API_URL`.

## Scripts

- `npm run dev` # entorno desarrollo
- `npm run build` # genera dist para producción
- `npm run preview`# sirve el build localmente
