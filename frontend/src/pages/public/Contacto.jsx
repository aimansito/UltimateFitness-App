import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import SEO from '../../components/common/SEO';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

// No hay ninguna guía descargable todavía: el bloque queda oculto hasta que exista y se envíe de verdad
const GUIA_DISPONIBLE = false;


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
  const [errorEnvio, setErrorEnvio] = useState('');
  // Campo trampa para bots: oculto a las personas
  const [web, setWeb] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErrorEnvio('');
    try {
      await api.post('/contacto', { ...formData, web });
      setEnviado(true);
      setFormData({ nombre: '', email: '', tipoConsulta: 'informacion', asunto: '', mensaje: '' });
      setTimeout(() => setEnviado(false), 8000);
    } catch (err) {
      setErrorEnvio(err?.response?.data?.error || 'No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.');
    } finally {
      setEnviando(false);
    }
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
      valor: 'utfitness2025@gmail.com',
      link: 'mailto:utfitness2025@gmail.com'
    },
    {
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      titulo: 'UBICACIÓN',
      valor: 'Granada, España',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-uf-darker pb-20">
      <SEO
        title="Contacto"
        description="Ponte en contacto con Ultimate Fitness. Resolvemos tus dudas sobre la plataforma, tu cuenta y tus entrenamientos."
        keywords="contacto ultimate fitness, soporte fitness"
      />

      <PageHeader
        eyebrow="Estamos aquí"
        title="Ponte en"
        highlight="Contacto"
        subtitle="¿Tienes alguna pregunta? Nuestro equipo está aquí para ayudarte."
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container mx-auto max-w-6xl px-4 pt-12">
        <div className="grid md:grid-cols-2 gap-8">

          {/* FORMULARIO */}
          <div className="uf-card p-8">
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
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
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
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
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
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
                >
                  <option value="informacion">Información General</option>
                  <option value="cuenta">Mi cuenta</option>
                  <option value="tecnico">Soporte Técnico</option>
                  <option value="privacidad">Privacidad y datos personales</option>
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
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
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
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
                ></textarea>
              </div>

              {/* Campo trampa: los bots lo rellenan, las personas no lo ven */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  No rellenes este campo
                  <input type="text" name="web" tabIndex={-1} autoComplete="off" value={web} onChange={(e) => setWeb(e.target.value)} />
                </label>
              </div>

              {errorEnvio && (
                <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorEnvio}
                </p>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={enviando}
                className="uf-btn uf-btn-primary w-full disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
              <p className="text-xs leading-relaxed text-uf-muted">
                Usaremos tus datos solo para responder a tu mensaje. No los guardamos en ninguna lista ni los usamos para publicidad.{' '}
                <Link to="/politica-privacidad" className="text-uf-gold hover:underline">Política de privacidad</Link>.
              </p>
            </form>
          </div>

          {/* INFO DE CONTACTO */}
          <div className="space-y-6">

            {contactInfo.map((info, i) => (
              <div key={i} className="uf-card p-6">

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
            <div className="uf-card p-6">
              <h3 className="text-white font-bold mb-4 uppercase">Síguenos</h3>
              <div className="flex gap-4">

                <a
                  href="https://www.instagram.com/ultimatefitness.uf/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  <Instagram className="h-6 w-6" aria-hidden="true" />
                </a>

                <a
                  href="https://www.facebook.com/people/Aiman-Harrar/pfbid02RhkRkwtijJkrGWtLsztyCMbsJM9H4cGnV1K4LyTNoVbpPbWfT6usT3LmsZPiGk7Wl/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  <Facebook className="h-6 w-6" aria-hidden="true" />
                </a>

                <a
                  href="https://x.com/UltimateFts"
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-uf-gold text-black p-3 rounded-lg hover:bg-uf-blue hover:text-white transition transform hover:scale-110"
                >
                  <Twitter className="h-6 w-6" aria-hidden="true" />
                </a>

              </div>
            </div>

          </div>
        </div>

        {/* ============================================ */}
        {/* LEAD MAGNET (Captura de Email) */}
        {/* ============================================ */}
        {GUIA_DISPONIBLE && (
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-black border border-uf-gold/30 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-anton font-bold text-white mb-2 uppercase">
              Descarga nuestra <span className="text-uf-gold">Guía Gratuita </span>
            </h3>
            <p className="text-gray-400 mb-6 font-medium">
              Aprende a estructurar tus macros y entrenamientos con nuestra guía de 7 días. ¡Totalmente gratis!
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias! Revisa tu correo en unos minutos.'); }}>
              <input
                type="email"
                placeholder="Tu mejor email..."
                required
                className="flex-1 bg-gray-800 border border-gray-600 focus:border-uf-gold text-white px-4 py-3 rounded-lg focus:outline-none transition"
              />
              <button
                type="submit"
                className="bg-uf-gold hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition transform hover:scale-105"
              >
                Quiero la guía
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">Al descargar aceptas recibir tips semanales. Cero spam.</p>
          </div>
          <div className="hidden md:flex flex-1 justify-center relative">
            <div className="absolute w-40 h-40 bg-uf-gold/20 rounded-full blur-3xl"></div>
            <div className="relative border-4 border-uf-darker rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-300">
              <img src="/images/dieta.jpg" alt="Guía Nutricional Ultimate Fitness" className="w-64 h-auto object-cover opacity-80" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }} />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-center py-2 border-t border-uf-gold font-bold text-sm text-uf-gold">PDF GRATUITO</div>
            </div>
          </div>
        </div>
        )}
      </div>

    </div>
  );
}

export default Contacto;
