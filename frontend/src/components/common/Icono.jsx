// Renderiza un icono (componente de lucide-react) guardado en un objeto de datos
function Icono({ de: Componente, className = 'w-5 h-5', ...props }) {
  if (!Componente || typeof Componente === 'string') return null;
  return <Componente className={className} aria-hidden="true" {...props} />;
}

export default Icono;
