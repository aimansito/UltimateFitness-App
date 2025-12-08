# Ultimate Fitness App

## Descripción General
Plataforma integral de gestión deportiva diseñada para conectar entrenadores y clientes. Permite la administración eficiente de planes nutricionales, rutinas de entrenamiento personalizadas y seguimiento del progreso físico, todo centralizado en una aplicación web moderna y escalable.

---

## 1. Requisitos del Sistema

Para el correcto despliegue de la aplicación, es necesario disponer del siguiente software instalado en el entorno de servidor o desarrollo:

*   **Docker Desktop**: Versión reciente que incluya Docker Compose.
*   **Git**: Sistema de control de versiones para la obtención del código fuente.
*   **Node.js (v18 o superior)**: Requerido únicamente si se desea ejecutar o compilar el frontend fuera del entorno contenedorizado.

---

## 2. Instalación y Configuración

Siga estos pasos detallados para configurar el proyecto en su entorno local.

### Paso 2.1. Clonado del Repositorio
Abra su terminal y ejecute el siguiente comando para descargar el código fuente:

```bash
git clone https://github.com/aimansito/UltimateFitness-App
cd UltimateFitness-App
```

### Paso 2.2. Configuración del Backend (Symfony)
1.  Navegue al directorio del backend:
    ```bash
    cd backend
    ```
2.  Genere el archivo de configuración copiando la plantilla existente:
    ```bash
    cp .env .env.local
    ```
3.  Edite el archivo `.env.local` con sus credenciales y parámetros específicos. Asegúrese de definir correctamente:
    *   `DATABASE_URL`: Cadena de conexión a la base de datos MySQL.
    *   `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`, `JWT_PASSPHRASE`: Claves para la seguridad y autenticación vía tokens.

### Paso 2.3. Configuración del Frontend (React)
1.  Navegue al directorio del frontend:
    ```bash
    cd ../frontend
    ```
2.  Cree el archivo de variables de entorno:
    ```bash
    touch .env
    ```
3.  Añada la configuración de conexión con la API (Backend):
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```
    *Nota: En un entorno de producción, sustituya `localhost` por su dominio real.*

---

## 3. Despliegue con Docker

El proyecto utiliza Docker Compose para orquestar los servicios necesarios (Base de datos, Backend, Frontend, Servidor Web).

1.  Regrese a la raíz del proyecto (donde se ubica `docker-compose.yml`):
    ```bash
    cd ..
    ```
2.  Ejecute el comando de construcción y arranque:
    ```bash
    docker-compose up -d --build
    ```
    Este proceso descargará las imágenes, instalará dependencias y levantará los contenedores.

3.  Verifique que los servicios están operativos:
    ```bash
    docker-compose ps
    ```
    Todos los contenedores deben mostrar el estado `Up` o `healthy`.

---

## 4. Base de Datos y Datos Iniciales

El sistema está configurado para inicializarse automáticamente.
*   Al iniciar el contenedor de base de datos por primera vez, se ejecutarán los scripts SQL ubicados en `database/docker-entrypoint-initdb.d/`.
*   Esto creará el esquema de tablas y cargará un conjunto de datos de prueba predeterminado.

**Nota:** Si requiere actualizar el esquema manualmente tras cambios en el código, ejecute:
```bash
docker-compose exec backend php bin/console doctrine:schema:update --force
```

---

## 5. Acceso a la Plataforma

Una vez desplegado, el sistema estará accesible a través de los siguientes puertos:

*   **Aplicación Web (Cliente)**: [http://localhost:3000](http://localhost:3000)
    *   Interfaz principal para usuarios y entrenadores.
*   **API (Backend)**: [http://localhost:8000/api](http://localhost:8000/api)
    *   Documentación técnica de los endpoints (API Platform / Swagger).
*   **Gestión de Base de Datos**: [http://localhost:8000](http://localhost:8000) (o el puerto configurado para PhpMyAdmin si está activo, por defecto 8080).

---

## 6. Documentación Adicional

Para información específica sobre el uso de la plataforma según los diferentes roles, consulte los manuales dedicados:

*   **[Manual de Usuario](./manual_usuario.md)**: Guía para clientes (registro, dietas, entrenamientos).
*   **[Manual de Entrenador](./manual_entrenador.md)**: Guía para gestión de clientes y planes.
*   **[Manual de Administrador](./manual_administrador.md)**: Guía de gestión global del sistema.

---

## Stack Tecnológico

*   **Frontend**: React, Vite, TailwindCSS.
*   **Backend**: PHP 8.1+, Symfony 6, API Platform.
*   **Base de Datos**: MySQL 8.0.
*   **Servidor Web**: Nginx.
*   **Contenedores**: Docker.
