FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip gd mbstring

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copia backend completo
COPY . .

# Instalación SIN ejecutar scripts de Symfony
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Al arrancar, AHORA sí se ejecutan scripts (cache:clear con DATABASE_URL presente)
CMD composer run-script post-install-cmd && php-fpm -F

EXPOSE 9000
