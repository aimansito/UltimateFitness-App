FROM php:8.2-apache

# 1. Instalar dependencias del sistema y extensiones PHP
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    && docker-php-ext-install pdo_mysql zip gd mbstring opcache intl

# 2. Configurar Apache DocumentRoot para Symfony (carpeta /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 3. Habilitar mod_rewrite de Apache (necesario para Symfony)
RUN a2enmod rewrite

# 4. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 5. Copiar código fuente
COPY . .

# 6. Instalar dependencias de PHP (Optimizadas para producción)
RUN composer install --no-dev --optimize-autoloader --no-scripts
RUN echo "--- CONTENIDO DE BUNDLES.PHP ---" && cat config/bundles.php && echo "--- FIN CONTENIDO ---"

# 7. Ajustar permisos para Apache
RUN chown -R www-data:www-data /var/www/html/var
RUN rm -rf /var/www/html/var/cache/* /var/www/html/var/log/*

# 8. Script de arranque
# Ejecuta scripts de post-install y arranca Apache
CMD composer run-script post-install-cmd && apache2-foreground

EXPOSE 80
