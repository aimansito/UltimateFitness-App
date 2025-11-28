import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import BlogCard from '../../components/blog/BlogCard';
import { 
  Calendar, 
  Eye, 
  Heart, 
  Tag, 
  User, 
  ArrowLeft, 
  Loader,
  Share2,
  Lock,
  Star,
  UserPlus
} from 'lucide-react';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isPremium } = useAuth();
  const [post, setPost] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug, isAuthenticated, isPremium]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);

      const response = await axios.get(`http://localhost:8000/api/blog/posts/${slug}`);

      if (response.data.success) {
        const postData = response.data.post;
        
        // Verificar restricciones
        // Si es premium y el usuario no es premium
        if (postData.categoria === 'premium' && !isPremium) {
          setAccessDenied(true);
          setPost(postData); // Guardamos datos básicos para mostrar el preview
          setLoading(false);
          return;
        }

        // Si no está autenticado
        if (!isAuthenticated) {
          setAccessDenied(true);
          setPost(postData);
          setLoading(false);
          return;
        }

        setPost(postData);
        setRelacionados(response.data.relacionados);
      }
    } catch (error) {
      console.error('Error al cargar post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked || !isAuthenticated) return;

    try {
      const response = await axios.post(`http://localhost:8000/api/blog/posts/${post.id}/me-gusta`);
      
      if (response.data.success) {
        setPost({ ...post, me_gusta: response.data.me_gusta });
        setLiked(true);
      }
    } catch (error) {
      console.error('Error al dar me gusta:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.titulo,
          text: post.extracto,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
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
      'noticias': 'bg-gray-500',
      'premium': 'bg-uf-red'
    };
    return colores[categoria] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-uf-gold mx-auto mb-4" />
          <p className="text-white text-xl">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Post no encontrado</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-uf-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar banner de acceso denegado
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Botón volver */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-uf-gold hover:text-yellow-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al blog
          </Link>

          {/* Preview de imagen */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={post.imagen_portada || '/images/blog-placeholder.jpg'}
              alt={post.titulo}
              className="w-full h-full object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              {post.categoria === 'premium' ? (
                <Lock className="w-24 h-24 text-uf-red" />
              ) : (
                <UserPlus className="w-24 h-24 text-uf-gold" />
              )}
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.titulo}
          </h1>

          {/* Extracto */}
          {post.extracto && (
            <p className="text-xl text-gray-400 mb-8">
              {post.extracto}
            </p>
          )}

          {/* Banner de restricción */}
          {post.categoria === 'premium' && !isPremium ? (
            // Usuario gratuito intentando ver premium
            <div className="bg-gradient-to-r from-uf-red/20 to-red-700/20 border-2 border-uf-red rounded-lg p-8 text-center">
              <Star className="w-16 h-16 text-uf-red mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                Contenido Exclusivo Premium
              </h2>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                Este artículo es parte de nuestro contenido premium. Mejora tu plan para acceder a artículos avanzados, planes personalizados y mucho más.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/planes"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-red to-red-700 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-red-700 hover:to-uf-red transition-all duration-300"
                >
                  <Star className="w-5 h-5" />
                  Mejorar a Premium
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 bg-gray-800 text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Ver Más Artículos
                </Link>
              </div>
            </div>
          ) : (
            // Usuario no autenticado
            <div className="bg-gradient-to-r from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-lg p-8 text-center">
              <UserPlus className="w-16 h-16 text-uf-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                Regístrate para Leer el Artículo Completo
              </h2>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                Únete a nuestra comunidad y accede a cientos de artículos sobre fitness, nutrición y bienestar completamente gratis.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-yellow-600 hover:to-uf-gold transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  Registrarse Gratis
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 bg-gray-800 text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Ver Más Artículos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Renderizar post completo (usuario con acceso)
  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón volver */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-uf-gold hover:text-yellow-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al blog
        </Link>

        {/* Imagen de portada */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={post.imagen_portada || '/images/blog-placeholder.jpg'}
            alt={post.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Categoría */}
          <div className="absolute bottom-6 left-6">
            <span className={`${getCategoriaColor(post.categoria)} text-white px-4 py-2 rounded-full text-sm font-bold uppercase flex items-center gap-2`}>
              {post.categoria === 'premium' && <Star className="w-4 h-4" />}
              {post.categoria_formateada}
            </span>
          </div>
        </div>

        {/* Header del post */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.titulo}
          </h1>

          {/* Extracto */}
          {post.extracto && (
            <p className="text-xl text-gray-400 mb-6">
              {post.extracto}
            </p>
          )}

          {/* Meta información */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.autor_nombre}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatearFecha(post.fecha_publicacion)}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.vistas} vistas
            </div>
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center gap-2 ${
                liked ? 'text-red-500' : 'hover:text-red-500'
              } transition-colors disabled:cursor-not-allowed`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {post.me_gusta}
            </button>
          </div>

          {/* Etiquetas */}
          {post.etiquetas && post.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {etiqueta}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-8 pb-8 border-b border-gray-700">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              liked
                ? 'bg-red-500 text-white cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Te gusta' : 'Me gusta'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-uf-gold hover:text-black transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
            Compartir
          </button>
        </div>

        {/* Contenido del post */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.contenido }}
          style={{
            color: '#d1d5db',
            lineHeight: '1.8'
          }}
        />

        {/* Posts relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionados.map((postRelacionado) => (
                <BlogCard key={postRelacionado.id} post={postRelacionado} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPost;