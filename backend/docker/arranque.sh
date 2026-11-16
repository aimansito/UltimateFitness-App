#!/bin/sh
# Arranque del backend en el servidor (Render). Si algo falla, el contenedor no arranca
# y Render mantiene publicada la versión anterior.
set -e
cd /var/www/html

# Claves JWT. En el servidor vienen fijas por variables de entorno (en base64) para que
# las sesiones sigan siendo válidas tras cada reinicio: el plan gratuito de Render apaga
# el servidor cuando no hay tráfico y lo vuelve a levantar con la siguiente visita.
# Sin esas variables (desarrollo) se genera un par nuevo, y las sesiones caducan al reiniciar.
mkdir -p config/jwt
if [ -n "$JWT_PRIVATE_KEY_B64" ] && [ -n "$JWT_PUBLIC_KEY_B64" ]; then
  echo "$JWT_PRIVATE_KEY_B64" | tr -d ' \n\r' | base64 -d > config/jwt/private.pem
  echo "$JWT_PUBLIC_KEY_B64" | tr -d ' \n\r' | base64 -d > config/jwt/public.pem
  chmod 600 config/jwt/private.pem
  echo "Claves JWT cargadas desde el entorno"
else
  echo "AVISO: faltan JWT_PRIVATE_KEY_B64 y JWT_PUBLIC_KEY_B64; se generan claves nuevas (las sesiones caducarán en cada reinicio)"
  rm -f config/jwt/*.pem
  php bin/console lexik:jwt:generate-keypair --overwrite
fi
chown -R www-data:www-data config/jwt

# Caché de producción
composer run-script post-install-cmd

# Base de datos: registrar migraciones ya aplicadas a mano y aplicar las pendientes
php bin/console app:sincronizar-migraciones --no-interaction
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

# Tareas puntuales, activadas con una variable en Render y retiradas después
if [ "$REPARAR_DATOS" = "1" ]; then
  php bin/console app:reparar-datos
fi
if [ "$CARGAR_CONTENIDO" = "1" ]; then
  php bin/console app:cargar-contenido
fi

chown -R www-data:www-data var
exec apache2-foreground
