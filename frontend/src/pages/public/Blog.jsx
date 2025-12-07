import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import api from '../../services/api';
import BlogCard from '../../components/blog/BlogCard';
import { Search, Filter, Loader, ChevronLeft, ChevronRight, Lock, Star, UserPlus } from 'lucide-react';

function Blog() {
  const { isAuthenticated, isPremium } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaActual, setCategoriaActual] = useState('todas');
  const [showRegistrationBanner, setShowRegistrationBanner] = useState(false);

  const categorias = [
    { value: 'todas', label: 'Todas', color: 'uf-gold', requiresPremium: false },
    { value: 'nutricion', label: 'Nutrición', color: 'green-500', requiresPremium: false },
    { value: 'entrenamiento', label: 'Entrenamiento', color: 'blue-500', requiresPremium: false },
    { value: 'salud', label: 'Salud', color: 'purple-500', requiresPremium: false },
    { value: 'motivacion', label: 'Motivación', color: 'orange-500', requiresPremium: false },
    { value: 'recetas', label: 'Recetas', color: 'pink-500', requiresPremium: false },
    { value: 'noticias', label: 'Noticias', color: 'gray-500', requiresPremium: false },
    { value: 'premium', label: 'Premium', color: 'uf-red', requiresPremium: true }
  ];

  useEffect(() => {
    fetchPosts();
  }, [searchParams, isAuthenticated, isPremium]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const page = searchParams.get('page') || 1;
      const categoria = searchParams.get('categoria') || 'todas';
      const search = searchParams.get('q') || '';

      setCategoriaActual(categoria);
      setSearchQuery(search);

      let url;

      // Usuario NO autenticado - Usar endpoint público
      if (!isAuthenticated) {
        url = `/public/blog/preview`;
        const response = await axios.get(url);

        if (response.data.success) {
          setPosts(response.data.posts);
          setShowRegistrationBanner(true);
          setPagination(null);
        }
        setLoading(false);
        return;
      }

      // Usuario autenticado
      setShowRegistrationBanner(false);

      // Categoría Premium
      if (categoria === 'premium') {
        if (!isPremium) {
          // Usuario gratuito intenta ver premium
          setPosts([]);
          setLoading(false);
          return;
        }
        url = `/blog/posts/premium?page=${page}&limit=12`;
      } else if (search) {
        url = `/blog/search?q=${search}&page=${page}&limit=12`;
      } else if (categoria !== 'todas') {
        url = `/blog/posts/categoria/${categoria}?page=${page}&limit=12`;
      } else {
        url = `/blog/posts?page=${page}&limit=12`;
      }

      const response = await api.get(url);

      if (response.data.success) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery, page: 1 });
    } else {
      setSearchParams({ page: 1 });
    }
  };

  const handleCategoriaChange = (categoria) => {
    // Si es premium y el usuario no es premium
    if (categoria === 'premium' && !isPremium) {
      return; // No hace nada, el botón está deshabilitado
    }

    if (categoria === 'todas') {
      setSearchParams({ page: 1 });
    } else {
      setSearchParams({ categoria, page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-uf-gold mx-auto mb-4" />
          <p className="text-white text-xl">Cargando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Blog <span className="text-uf-gold">Ultimate Fitness</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Consejos, rutinas y todo lo que necesitas para alcanzar tus objetivos
          </p>
        </div>

        {/* Banner de registro (solo para no autenticados) */}
        {showRegistrationBanner && (
          <div className="bg-gradient-to-r from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-lg p-8 mb-8 text-center">
            <UserPlus className="w-16 h-16 text-uf-gold mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Regístrate para Acceder a Todo el Contenido
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Únete a nuestra comunidad y accede a cientos de artículos sobre fitness, nutrición y bienestar
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 transform hover:scale-105"
            >
              <UserPlus className="w-5 h-5" />
              Registrarse Gratis
            </Link>
          </div>
        )}

        {/* Buscador (solo para autenticados) */}
        {isAuthenticated && (
          <div className="mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos..."
                className="w-full bg-gray-800 text-white px-6 py-4 pr-12 rounded-lg border-2 border-gray-700 focus:border-uf-gold focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-uf-gold text-black p-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Filtros de categoría (solo para autenticados) */}
        {isAuthenticated && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-uf-gold" />
              <h3 className="text-white font-bold">Categorías:</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => {
                const isLocked = cat.requiresPremium && !isPremium;

                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoriaChange(cat.value)}
                    disabled={isLocked}
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isLocked
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : categoriaActual === cat.value
                        ? `bg-${cat.color} text-white`
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.label}
                      {cat.requiresPremium && (
                        <Star className="w-4 h-4 text-uf-red" />
                      )}
                      {isLocked && (
                        <Lock className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mensaje para usuarios gratuitos intentando ver premium */}
        {isAuthenticated && !isPremium && categoriaActual === 'premium' && (
          <div className="bg-gradient-to-r from-uf-red/20 to-red-700/20 border-2 border-uf-red rounded-lg p-8 mb-8 text-center">
            <Lock className="w-16 h-16 text-uf-red mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Contenido Exclusivo Premium
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Accede a artículos avanzados, planes personalizados y contenido exclusivo
            </p>
            <Link
              to="/upgrade-premium"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-red to-red-700 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-red-700 hover:to-uf-red transition-all duration-300 transform hover:scale-105"
            >
              <Star className="w-5 h-5" />
              Mejorar a Premium
            </Link>
          </div>
        )}

        {/* Grid de posts */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Paginación (solo para autenticados) */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.total_pages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors ${pagination.current_page === index + 1
                        ? 'bg-uf-gold text-black'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No se encontraron posts</p>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
                className="bg-uf-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Ver todos los posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;