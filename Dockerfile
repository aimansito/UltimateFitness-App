# ============================================
#  DOCKERFILE - PHP-FPM PARA SYMFONY
# ============================================

FROM php:8.2-fpm

# Eliminar configuraciones duplicadas de pools que causan conflictos
RUN rm -f /usr/local/etc/php-fpm.d/docker.conf \
          /usr/local/etc/php-fpm.d/zz-docker.conf

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libsodium-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip sodium \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Copiar configuración de PHP-FPM
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

# Exponer puerto PHP-FPM
EXPOSE 9000

# Ejecutar PHP-FPM en foreground
CMD ["php-fpm", "-F"]
