// ============================================
// FOOTER - Pie de página
// ============================================
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black border-t border-uf-gold/20 py-12">
      <div className="container mx-auto px-8">

        {/* Contenedor principal con 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* ============================================ */}
          {/* COLUMNA 1 - Logo y descripción */}
          {/* ============================================ */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logos/logo.png"
                alt="Ultimate Fitness"
                className="h-16"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-uf-gold font-bold text-2xl uppercase">
                ULTIMATE FITNESS
              </span>
            </Link>

            {/* Descripción */}
            <p className="text-gray-400 text-sm text-center md:text-left leading-relaxed">
              Tu plataforma definitiva de entrenamiento y nutrición online. Alcanza tus objetivos con los mejores profesionales del sector.
            </p>
          </div>

          {/* ============================================ */}
          {/* COLUMNA 2 - Navegación */}
          {/* ============================================ */}
          <div className="text-center md:text-left">
            <h3 className="text-uf-gold font-bold mb-4 uppercase tracking-wider text-sm">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicios" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/gym" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Gym
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/alimentacion" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Dietas
                </Link>
              </li>
              <li>
                <Link to="/suplementos" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Suplementos
                </Link>
              </li>
            </ul>
          </div>

          {/* ============================================ */}
          {/* COLUMNA 3 - Contacto */}
          {/* ============================================ */}
          <div className="text-center md:text-left">
            <h3 className="text-uf-gold font-bold mb-4 uppercase tracking-wider text-sm">
              Contáctanos
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <svg className="w-4 h-4 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>utfitness2025@gmail.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <svg className="w-4 h-4 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+34 633714372</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <svg className="w-4 h-4 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Granada, España</span>
              </li>
            </ul>
          </div>

          {/* ============================================ */}
          {/* COLUMNA 4 - Legal */}
          {/* ============================================ */}
          <div className="text-center md:text-left">
            <h3 className="text-uf-gold font-bold mb-4 uppercase tracking-wider text-sm">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/politica-privacidad" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidad" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidad" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidad" className="text-gray-400 hover:text-uf-gold transition-colors text-sm">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ============================================ */}
        {/* SEPARADOR */}
        {/* ============================================ */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* ============================================ */}
        {/* REDES SOCIALES (centradas) */}
        {/* ============================================ */}
        <div className="flex justify-center space-x-6 mb-6">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/people/Aiman-Harrar/pfbid02RhkRkwtijJkrGWtLsztyCMbsJM9H4cGnV1K4LyTNoVbpPbWfT6usT3LmsZPiGk7Wl/?sk=about"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-uf-gold hover:border-uf-gold transition-all transform hover:scale-110"
            title="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/ultimatefitness.uf/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-uf-gold hover:border-uf-gold transition-all transform hover:scale-110"
            title="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* Twitter/X */}
          <a
            href="https://x.com/UltimateFts"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-uf-gold hover:border-uf-gold transition-all transform hover:scale-110"
            title="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* ============================================ */}
        {/* COPYRIGHT */}
        {/* ============================================ */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © 2025 <span className="text-uf-gold font-semibold">ULTIMATE FITNESS</span>. Todos los derechos reservados.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Diseñado con ❤️ para transformar vidas
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;