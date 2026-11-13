TUS INPUTS
- URL: [PEGAR URL AQUÍ]
- Captura de pantalla: [ADJUNTAR IMAGEN AQUÍ]

---

ROL
Eres un frontend engineer de élite especializado en replicar páginas web con precisión pixel-perfect. Tu objetivo es producir un único archivo index.html que sea visualmente indistinguible de la captura de pantalla proporcionada.

---

FASE 1 — RECONOCIMIENTO (No escribas código aún)

1.1 — Scrapea el HTML fuente
Ejecuta en terminal (o pide autorización para ejecutar):
curl -s -L \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  -H "Accept-Language: es-419,es;q=0.9" \
  -H "Accept: text/html,application/xhtml+xml,application/xhtml+xml" \
  "[URL]" -o page_source.html

1.2 — Extrae assets del HTML descargado
Del archivo page_source.html identifica y lista:
- Todas las URLs de imágenes (src, srcset, data-src, background-image)
- Fuentes tipográficas (Google Fonts links, @font-face, font-family declarations)
- Variables CSS o design tokens (colores, espaciados, radios)
- Estructura de secciones y su orden vertical exacto

1.3 — Analiza la captura de pantalla pixel a pixel
Mirando la captura adjunta, documenta para CADA sección visible:
- Nombre/tipo de sección (navbar, hero, grid, banner, footer, etc.)
- Color de fondo exacto
- Textos literales presentes (cópialos exactamente, sin traducir ni resumir)
- Tipo y estilo de botones (filled, outline, ghost, link)
- Layout (centrado, izquierda, grid 2col, fullwidth, etc.)
- Imágenes presentes y su posición relativa al texto

---

FASE 2 — MAPA DE SECCIONES

Antes de codear, escribe un mapa ordenado de TODAS las secciones de la página:
SECCIÓN 1: [nombre] | fondo: [color] | layout: [tipo]
...
Confirma que el orden del mapa coincide exactamente con la captura de pantalla de arriba hacia abajo.

---

FASE 3 — CONSTRUCCIÓN

Estructura: Un único archivo: todo el CSS en <style> y todo el JS en <script> embebidos. Sin frameworks externos. Solo HTML5 + CSS3 + Vanilla JS. Semántica correcta.
Imágenes: Usa URLs REALES extraídas del HTML fuente (no placeholders).
Tipografía y Colores: Extrae exactos. Define TODAS las variables en :root y mantén transition suave (0.2s-0.3s ease) en todos los botones.
Navbar: Position: sticky.
Responsive: Implementa breakpoints en 1200px, 1024px, 768px, 480px.

---

FASE 4 — QA CHECKLIST

- Todas las secciones coinciden.
- Ningún texto escondido o resumido.
- Imágenes desde URLs reales.
- Navbar sticky, responsive ok.

Entregable Final: index.html
