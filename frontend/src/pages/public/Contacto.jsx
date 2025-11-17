// ============================================
// CONTACTO - Página de contacto
// ============================================
import { useState } from 'react';

function Contacto() {
  // ============================================
  // ESTADO DEL FORMULARIO
  // ============================================
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoConsulta: 'informacion',
    asunto: '',
    mensaje: ''
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // ============================================
  // FUNCIONES
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    // Simular envío
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);

      setFormData({
        nombre: '',
        email: '',
        tipoConsulta: 'informacion',
        asunto: '',
        mensaje: ''
      });

      setTimeout(() => setEnviado(false), 5000);
    }, 1500);
  };

  // ============================================
  // DATOS DE CONTACTO
  // ============================================
  const contactInfo = [
    {
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      titulo: 'EMAIL',
      valor: 'info@ultimatefitness.com',
      link: 'mailto:info@ultimatefitness.com'
    },
    {
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      titulo: 'TELÉFONO',
      valor: '+34 900 123 456',
      link: 'tel:+34900123456'
    },
    {
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      titulo: 'UBICACIÓN',
      valor: 'Madrid, España',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-20">

      {/* HEADER */}
      <div className="container mx-auto px-4 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-anton font-bold text-white mb-6 uppercase tracking-wider">
          Ponte en <span className="text-uf-gold">Contacto</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          ¿Tienes alguna pregunta? Nuestro equipo está aquí para ayudarte.
        </p>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">

          {/* FORMULARIO */}
          <div className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/30 rounded-2xl p-8">
            <h2 className="text-2xl font-anton font-bold text-uf-gold mb-2 uppercase">
              Envíanos un mensaje
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Completa el formulario y nos pondremos en contacto contigo
            </p>

            {enviado && (
              <div className="bg-green-500/20 border-2 border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span className="text-sm font-semibold">¡Mensaje enviado correctamente!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Nombre */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wider">
                  Nombre completo <span className="text-uf-gold">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wider">
                  Email <span className="text-uf-gold">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              {/* Tipo consulta */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wider">
                  Tipo de consulta
                </label>
                <select
                  name="tipoConsulta"
                  value={formData.tipoConsulta}
                  onChange={handleChange}
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="informacion">Información General</option>
                  <option value="premium">Plan Premium</option>
                  <option value="entrenador">Entrenador Personal</option>
                  <option value="tecnico">Soporte Técnico</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wider">
                  Asunto
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wider">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="5"
                  className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                ></textarea>
              </div>

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-uf-gold text-black font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-uf-blue hover:text-white transition-all"
              >
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>

          {/* INFO DE CONTACTO */}
          <div className="space-y-6">

            {contactInfo.map((info, i) => (
              <div key={i} className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/30 rounded-2xl p-6">

                <div className="flex items-center gap-4">
                  <div className="bg-uf-gold text-black p-4 rounded-xl">
                    {info.icono}
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      {info.titulo}
                    </h3>

                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-white text-lg font-bold hover:text-uf-gold transition"
                      >
                        {info.valor}
                      </a>
                    ) : (
                      <p className="text-white text-lg font-bold">{info.valor}</p>
                    )}
                  </div>
                </div>

              </div>
            ))}

            {/* Redes sociales */}
            <div className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/30 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 uppercase">Síguenos</h3>
              <div className="flex gap-4">

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  {/* ICONO IG */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204..."></path>
                  </svg>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  {/* ICONO FB */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627..."></path>
                  </svg>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  {/* ICONO TW */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10..."></path>
                  </svg>
                </a>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Contacto;
