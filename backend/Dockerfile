FROM php:8.2-fpm

# Eliminar configs duplicadas que causan 502
RUN rm -f /usr/local/etc/php-fpm.d/docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf \
    && apt-get update && apt-get install -y \
        git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev libsodium-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip sodium \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 🔥 COPIA EL CÓDIGO (ESTO ES LO QUE TE FALTABA)
COPY . /var/www/html

# Instalar dependencias Symfony
RUN composer install --no-dev --optimize-autoloader

# Copiar config PHP-FPM
COPY ../docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

EXPOSE 9000
CMD ["php-fpm", "-F"]
