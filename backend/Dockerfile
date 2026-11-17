FROM php:8.2-apache

# 1. Instalar dependencias del sistema y extensiones PHP
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev openssl \
    && docker-php-ext-install pdo_mysql zip gd mbstring opcache intl \
    && pecl install apcu && docker-php-ext-enable apcu

# 2. Configurar Apache DocumentRoot para Symfony (carpeta /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 3. Módulos de Apache: reescritura (Symfony), cabeceras, compresión y caché del navegador
RUN a2enmod rewrite headers deflate expires
COPY docker/apache-rendimiento.conf /etc/apache2/conf-enabled/zz-rendimiento.conf
COPY docker/php-rendimiento.ini /usr/local/etc/php/conf.d/zz-rendimiento.ini

# 4. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 5. Copiar código fuente
COPY . .

# 6. Instalar dependencias de PHP (Optimizadas para producción)
# Mapa de clases completo y autoritativo: sin él, cada clase provoca varias búsquedas en disco por petición
RUN composer install --no-dev --optimize-autoloader --classmap-authoritative --no-scripts
RUN echo "--- CONTENIDO DE BUNDLES.PHP ---" && cat config/bundles.php && echo "--- FIN CONTENIDO ---"

# 7. Ajustar permisos para Apache
# 7. Ajustar permisos para Apache
RUN chown -R www-data:www-data /var/www/html/var
RUN mkdir -p /var/www/html/config/jwt && chown -R www-data:www-data /var/www/html/config/jwt
RUN rm -rf /var/www/html/var/cache/* /var/www/html/var/log/*

# 8. Script de arranque (docker/arranque.sh): claves JWT, caché, migraciones y tareas puntuales.
# Se normalizan los saltos de línea por si el repositorio se clonó en Windows.
RUN sed -i 's/\r$//' docker/*.sh && chmod +x docker/*.sh
CMD ["sh", "docker/arranque.sh"]

EXPOSE 80
