// ============================================
// AVISO LEGAL (LSSI-CE art. 10)
// ============================================
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { PaginaLegal, Lista, Correo } from '../../components/legal/PaginaLegal';
import { TITULAR, dato } from '../../config/legal';

function AvisoLegal() {
  const secciones = [
    {
      id: 'titular',
      titulo: 'Titular del sitio web',
      contenido: (
        <>
          <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular:</p>
          <Lista>
            <li><strong className="text-white">Titular:</strong> {dato(TITULAR.nombre)}</li>
            <li><strong className="text-white">NIF:</strong> {dato(TITULAR.nif)}</li>
            <li><strong className="text-white">Domicilio:</strong> {dato(TITULAR.domicilio)}</li>
            <li><strong className="text-white">Email de contacto:</strong> <Correo email={TITULAR.email} /></li>
            <li><strong className="text-white">Sitio web:</strong> {TITULAR.web}</li>
          </Lista>
          <p>{TITULAR.marca} es el nombre comercial del servicio.</p>
        </>
      ),
    },
    {
      id: 'objeto',
      titulo: 'Objeto',
      contenido: (
        <p>
          Este aviso regula el acceso y el uso de {TITULAR.web}, una plataforma para crear y organizar rutinas de entrenamiento y planes de alimentación,
          consultar contenido sobre fitness y compartir el progreso con otras personas usuarias. El uso de los servicios que requieren cuenta se rige además
          por los <Link to="/terminos-condiciones" className="text-uf-gold hover:underline">Términos y condiciones</Link>.
        </p>
      ),
    },
    {
      id: 'propiedad',
      titulo: 'Propiedad intelectual e industrial',
      contenido: (
        <>
          <p>
            El diseño, el código, los logotipos, la marca y los textos e imágenes propios del sitio pertenecen al titular o se usan con licencia.
            No se permite reproducirlos, distribuirlos ni transformarlos con fines comerciales sin autorización.
          </p>
          <p>
            El contenido que publican las personas usuarias (rutinas, dietas, platos, fotos de perfil) pertenece a quien lo crea, según se explica en los Términos y condiciones.
          </p>
        </>
      ),
    },
    {
      id: 'uso',
      titulo: 'Condiciones de uso',
      contenido: (
        <>
          <p>Quien use el sitio se compromete a no:</p>
          <Lista>
            <li>Usarlo para fines ilícitos o que vulneren derechos de terceros.</li>
            <li>Intentar acceder a cuentas o datos de otras personas, o a partes del sistema no destinadas al público.</li>
            <li>Introducir programas maliciosos o realizar acciones que dañen o sobrecarguen el servicio.</li>
          </Lista>
        </>
      ),
    },
    {
      id: 'salud',
      titulo: 'Aviso sobre salud',
      contenido: (
        <p>
          Las rutinas, dietas y artículos tienen carácter informativo y general. No son consejo médico ni sustituyen la valoración de un profesional sanitario.
          Consulta con un profesional antes de empezar un programa de ejercicio o de alimentación, especialmente si tienes alguna condición de salud.
          Las rutinas y dietas creadas por otras personas usuarias no están revisadas por el titular.
        </p>
      ),
    },
    {
      id: 'responsabilidad',
      titulo: 'Responsabilidad',
      contenido: (
        <p>
          El titular procura que el servicio esté disponible y sea seguro, pero no puede garantizar que funcione sin interrupciones ni errores.
          No responde del contenido publicado por las personas usuarias, aunque lo retirará cuando tenga conocimiento de que es ilícito (art. 16 LSSI-CE).
          Los enlaces a sitios de terceros se ofrecen solo como referencia.
        </p>
      ),
    },
    {
      id: 'ley',
      titulo: 'Legislación aplicable',
      contenido: (
        <p>
          Se aplica la legislación española. Si eres consumidor, para cualquier controversia serán competentes los juzgados de tu domicilio, conforme a la normativa de consumo.
        </p>
      ),
    },
  ];

  return (
    <PaginaLegal
      titulo="Aviso legal"
      subtitulo={`Información sobre el titular de ${TITULAR.web} y las condiciones de uso del sitio.`}
      descripcionSeo="Aviso legal de Ultimate Fitness: titular del sitio, condiciones de uso y propiedad intelectual."
      icono={Scale}
      secciones={secciones}
    />
  );
}

export default AvisoLegal;
