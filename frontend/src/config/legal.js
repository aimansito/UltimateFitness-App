// Datos del titular que aparecen en Aviso legal, Privacidad, Cookies y Términos.
// RELLENAR ANTES DE PUBLICAR: la LSSI (art. 10) y el RGPD (art. 13) exigen identificar
// al titular con su nombre, NIF y domicilio. Mientras esté vacío se muestra "pendiente".
export const TITULAR = {
  nombre: 'Aiman Harrar Daoud', // Nombre y apellidos de la persona titular (o razón social si se constituye empresa)
  nif: '09117700V', // DNI/NIF
  domicilio: 'C. Tórtola, 27, Beiro, 18014 Granada', // Dirección postal completa
  email: 'utfitness2025@gmail.com',
  web: 'ultimatefitnessuf.com',
  marca: 'Ultimate Fitness',
};

// Edad mínima para registrarse sin consentimiento de madre, padre o tutor (LOPDGDD art. 7)
export const EDAD_MINIMA = 14;

export const ULTIMA_ACTUALIZACION = '12 de noviembre de 2026';

export const dato = (valor) => valor || 'pendiente de completar';
