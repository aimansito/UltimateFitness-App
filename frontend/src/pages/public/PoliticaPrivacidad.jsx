// ============================================
// POLÍTICA DE PRIVACIDAD (RGPD art. 13 y LOPDGDD)
// Describe los tratamientos que hace realmente la app. Si se añade una función
// que recoja datos nuevos o un proveedor nuevo, hay que actualizar esta página.
// ============================================
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { PaginaLegal, Lista, Tabla, Correo } from '../../components/legal/PaginaLegal';
import { TITULAR, EDAD_MINIMA, dato } from '../../config/legal';

function PoliticaPrivacidad() {
  const enlace = (to, texto) => (
    <Link to={to} className="text-uf-gold hover:underline">
      {texto}
    </Link>
  );

  const secciones = [
    {
      id: 'responsable',
      titulo: 'Responsable del tratamiento',
      contenido: (
        <Lista>
          <li><strong className="text-white">Responsable:</strong> {dato(TITULAR.nombre)}</li>
          <li><strong className="text-white">NIF:</strong> {dato(TITULAR.nif)}</li>
          <li><strong className="text-white">Domicilio:</strong> {dato(TITULAR.domicilio)}</li>
          <li><strong className="text-white">Contacto para privacidad:</strong> <Correo email={TITULAR.email} /></li>
        </Lista>
      ),
    },
    {
      id: 'datos',
      titulo: 'Qué datos tratamos',
      contenido: (
        <>
          <Lista>
            <li><strong className="text-white">Datos de cuenta:</strong> nombre, apellidos, email, contraseña (guardada cifrada, nunca en claro) y, si lo indicas, teléfono.</li>
            <li><strong className="text-white">Datos físicos y de salud:</strong> sexo, edad, peso, altura, peso objetivo, índice de masa corporal, nivel de actividad, objetivo y, si las escribes, tus notas de salud (alergias, lesiones, restricciones).</li>
            <li><strong className="text-white">Tu actividad en el servicio:</strong> rutinas, dietas y platos que creas o copias, tu calendario y los entrenamientos que marcas como completados, con los ejercicios que indicas haber hecho.</li>
            <li><strong className="text-white">Fotos de tus entrenos:</strong> solo si decides añadir una. Antes de guardarla le quitamos la ubicación (GPS), el modelo del móvil y el resto de metadatos.</li>
            <li><strong className="text-white">Perfil social:</strong> foto de perfil, biografía, ajustes de privacidad, a quién sigues y quién te sigue, y lo que guardas en favoritos.</li>
            <li><strong className="text-white">Datos técnicos:</strong> dirección IP y datos de la petición, para proteger el servicio frente a abusos (por ejemplo, limitar intentos de inicio de sesión).</li>
            <li><strong className="text-white">Datos de navegación:</strong> solo si aceptas las cookies de analítica (ver la {enlace('/politica-cookies', 'Política de cookies')}).</li>
          </Lista>
          <p>No tratamos datos de pago: el servicio es gratuito y no hay cobros.</p>
        </>
      ),
    },
    {
      id: 'finalidades',
      titulo: 'Para qué y con qué base legal',
      contenido: (
        <Tabla
          cabecera={['Finalidad', 'Base legal']}
          filas={[
            ['Crear y gestionar tu cuenta y prestarte el servicio (rutinas, dietas, calendario, progreso).', 'Ejecución del contrato que aceptas al registrarte (art. 6.1.b RGPD).'],
            ['Usar tus datos físicos y de salud para calcular y adaptar tus planes y mostrar tu progreso.', 'Tu consentimiento explícito (art. 9.2.a RGPD), que das al registrarte y puedes retirar cuando quieras.'],
            ['Mostrar tu perfil público y lo que decidas compartir (rutinas, dietas, favoritos, entreno del día) a otras personas.', 'Ejecución del contrato, según los ajustes de privacidad que tú eliges.'],
            ['Enviarte correos del servicio: bienvenida y recuperación de contraseña.', 'Ejecución del contrato.'],
            ['Proteger el servicio: limitar intentos de acceso, detectar abusos y resolver incidencias.', 'Interés legítimo en mantener la seguridad (art. 6.1.f RGPD).'],
            ['Medir el uso del sitio para mejorarlo (Google Tag Manager, Microsoft Clarity).', 'Tu consentimiento en el aviso de cookies (art. 6.1.a RGPD y art. 22.2 LSSI-CE).'],
          ]}
        />
      ),
    },
    {
      id: 'salud',
      titulo: 'Datos de salud',
      contenido: (
        <>
          <p>
            Los datos de peso, altura, IMC y notas de salud son categorías especiales de datos. Solo se usan para tu propio plan y nunca se muestran en tu perfil público,
            aunque tu perfil sea público.
          </p>
          <p>
            Puedes retirar el consentimiento en cualquier momento desde {enlace('/cuenta', 'Gestionar cuenta')}, que borra esos datos al instante, o escribiendo a <Correo email={TITULAR.email} />.
            Retirarlo no afecta a lo tratado antes, pero algunas funciones que dependen de esos datos dejarán de estar personalizadas.
          </p>
        </>
      ),
    },
    {
      id: 'perfil',
      titulo: 'Perfil público y contenido compartido',
      contenido: (
        <>
          <p>
            Las cuentas nuevas empiezan con el perfil privado. Si lo haces público, cualquier persona podrá ver tu nombre, tu foto y tu biografía, y lo que marques como visible
            en cada bloque (público, solo seguidores o solo yo). Tus rutinas y dietas son privadas hasta que decidas mostrarlas una por una.
          </p>
          <p>
            Si compartes tu entreno del día en el feed, se muestran la foto (si la añadiste), la rutina y los ejercicios a quien pueda ver tus entrenamientos según tu
            privacidad. Si no lo compartes, la foto no aparece en ninguna página de la plataforma. Al deshacer el entreno o eliminar tu cuenta, la foto se borra.
            Si descargas la imagen de tu entreno, lo que hagas con ella fuera de la plataforma queda bajo tu control.
          </p>
          <p>
            Si compartes una rutina o dieta, otras personas pueden guardarla o copiarla en su cuenta. Las copias que ya hayan hecho se mantienen aunque después la vuelvas privada.
          </p>
        </>
      ),
    },
    {
      id: 'destinatarios',
      titulo: 'Quién más accede a los datos',
      contenido: (
        <>
          <p>No vendemos ni cedemos tus datos. Solo acceden a ellos proveedores que nos prestan un servicio, como encargados del tratamiento y con contrato conforme al art. 28 RGPD:</p>
          <Lista>
            <li>Proveedor de alojamiento del servidor y de la base de datos.</li>
            <li>Proveedor de almacenamiento de archivos, para las fotos de perfil.</li>
            <li>Proveedor de envío de correo electrónico.</li>
            <li>Google (Tag Manager) y Microsoft (Clarity), solo si aceptas las cookies de analítica.</li>
          </Lista>
          <p>
            Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso la transferencia se ampara en una decisión de adecuación
            de la Comisión Europea (como el Marco de Privacidad de Datos UE-EE. UU.) o en cláusulas contractuales tipo.
          </p>
          <p>También podemos comunicar datos a autoridades cuando una ley lo exija.</p>
        </>
      ),
    },
    {
      id: 'conservacion',
      titulo: 'Cuánto tiempo los guardamos',
      contenido: (
        <Lista>
          <li><strong className="text-white">Datos de cuenta, salud y actividad:</strong> mientras tengas la cuenta. Cuando la eliminas desde {enlace('/cuenta', 'Gestionar cuenta')} se borran en ese momento, junto con tu foto, seguidores y favoritos. Las copias de seguridad del proveedor de alojamiento se sobrescriben en sus ciclos habituales.</li>
          <li><strong className="text-white">Enlaces de recuperación de contraseña:</strong> caducan a la hora.</li>
          <li><strong className="text-white">Contadores de intentos de acceso:</strong> se borran solos en un máximo de una hora.</li>
          <li><strong className="text-white">Registros técnicos del servidor:</strong> el tiempo necesario para resolver incidencias de seguridad.</li>
          <li><strong className="text-white">Cookies de analítica:</strong> según la {enlace('/politica-cookies', 'Política de cookies')}.</li>
        </Lista>
      ),
    },
    {
      id: 'derechos',
      titulo: 'Tus derechos',
      contenido: (
        <>
          <p>
            Puedes pedir acceso a tus datos, rectificarlos, suprimirlos, limitar u oponerte a su tratamiento, recibirlos en un formato portable y retirar los consentimientos dados.
            Escribe a <Correo email={TITULAR.email} /> desde el email de tu cuenta indicando qué derecho quieres ejercer. Responderemos en un plazo máximo de un mes.
          </p>
          <p>
            Desde {enlace('/cuenta', 'Gestionar cuenta')} puedes hacerlo tú directamente: descargar todos tus datos en un archivo, borrar tus datos de salud, cambiar tu contraseña
            y eliminar tu cuenta. Tus datos personales y tu privacidad se editan en {enlace('/perfil/datos', 'Mis datos personales')} y en tu panel.
          </p>
          <p>
            Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">www.aepd.es</a>).
          </p>
        </>
      ),
    },
    {
      id: 'menores',
      titulo: 'Menores de edad',
      contenido: (
        <p>
          Para registrarte debes tener al menos {EDAD_MINIMA} años (art. 7 LOPDGDD). Si descubrimos una cuenta de una persona menor de esa edad sin el consentimiento de su madre, padre o tutor, la eliminaremos.
        </p>
      ),
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad',
      contenido: (
        <p>
          Aplicamos medidas como el cifrado de las contraseñas, conexiones cifradas, control de acceso para que cada cuenta solo vea sus datos privados y límites de intentos frente a ataques.
          Si ocurriera una brecha que suponga un riesgo para ti, te lo comunicaremos conforme al RGPD.
        </p>
      ),
    },
    {
      id: 'cambios',
      titulo: 'Cambios en esta política',
      contenido: (
        <p>Si cambiamos cómo tratamos tus datos, actualizaremos esta página y, si el cambio es importante, te avisaremos por email o en la plataforma antes de que se aplique.</p>
      ),
    },
  ];

  return (
    <PaginaLegal
      titulo="Política de privacidad"
      subtitulo="Qué datos tratamos, para qué, con quién los compartimos y cómo ejercer tus derechos."
      descripcionSeo="Política de privacidad de Ultimate Fitness conforme al RGPD y la LOPDGDD."
      icono={Shield}
      secciones={secciones}
    />
  );
}

export default PoliticaPrivacidad;
