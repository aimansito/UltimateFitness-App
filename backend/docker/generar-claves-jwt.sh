#!/bin/sh
# Genera un par de claves JWT y las imprime en base64 para pegarlas en Render como
# JWT_PRIVATE_KEY_B64 y JWT_PUBLIC_KEY_B64. La passphrase debe ser la misma que JWT_PASSPHRASE.
#
#   MSYS_NO_PATHCONV=1 docker exec -e PASS='tu_passphrase' ultimatefitness_backend sh docker/generar-claves-jwt.sh
set -e
if [ -z "$PASS" ]; then
  echo "Falta la passphrase: ejecuta con -e PASS='...'" >&2
  exit 1
fi
DIR=$(mktemp -d)
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -aes-256-cbc -pass "pass:$PASS" -out "$DIR/private.pem" 2>/dev/null
openssl pkey -in "$DIR/private.pem" -passin "pass:$PASS" -pubout -out "$DIR/public.pem"
echo "JWT_PRIVATE_KEY_B64="
base64 -w0 "$DIR/private.pem"
echo
echo
echo "JWT_PUBLIC_KEY_B64="
base64 -w0 "$DIR/public.pem"
echo
rm -rf "$DIR"
