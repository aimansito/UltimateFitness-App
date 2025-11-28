import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart, Tag } from 'lucide-react';

function BlogCard({ post }) {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoriaColor = (categoria) => {
    const colores = {
      'nutricion': 'bg-green-500',
      'entrenamiento': 'bg-blue-500',
      'salud': 'bg-purple-500',
      'motivacion': 'bg-orange-500',
      'recetas': 'bg-pink-500',
      'noticias': 'bg-gray-500'
    };
    return colores[categoria] || 'bg-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-uf-gold transition-all duration-300 group">
      {/* Imagen */}
      <Link to={`/blog/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.imagen_portada || '/images/blog-placeholder.jpg'}
            alt={post.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {post.destacado && (
            <div className="absolute top-4 right-4 bg-uf-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
              Destacado
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <span className={`${getCategoriaColor(post.categoria)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
              {post.categoria_formateada}
            </span>
          </div>
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-6">
        {/* Título */}
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-uf-gold transition-colors line-clamp-2">
            {post.titulo}
          </h3>
        </Link>

        {/* Extracto */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {post.extracto}
        </p>

        {/* Etiquetas */}
        {post.etiquetas && post.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.etiquetas.slice(0, 3).map((etiqueta, index) => (
              <span
                key={index}
                className="flex items-center gap-1 text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded"
              >
                <Tag className="w-3 h-3" />
                {etiqueta}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.vistas}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.me_gusta}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-4 h-4" />
            {formatearFecha(post.fecha_publicacion)}
          </div>
        </div>

        {/* Botón leer más */}
        <Link
          to={`/blog/${post.slug}`}
          className="mt-4 block w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-2 px-4 rounded-lg text-center hover:from-yellow-600 hover:to-uf-gold transition-all duration-300"
        >
          Leer más
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;