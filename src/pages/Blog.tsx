import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, Search } from 'lucide-react';
import { supabase, BlogPost, BlogCategory } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const heroRef = useScrollAnimation<HTMLDivElement>();
  const postsRef = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsResult, categoriesResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*, category:blog_categories(*)')
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name'),
      ]);

      setPosts(postsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
    const matchesSearch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Blog | Residencial Santa Marta"
        description="Lee nuestros articulos sobre cuidado de adultos mayores, bienestar y vida en comunidad."
      />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-forest-50 via-white to-sage-50">
        <div
          ref={heroRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0 translate-y-5"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-h1 text-gray-900 mb-6">
              Nuestro Blog
            </h1>
            <p className="text-body-lg text-gray-600">
              Descubre articulos sobre bienestar, salud y consejos para el cuidado
              de nuestros seres queridos.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar articulos..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-white shadow-sm"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-forest-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-forest-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div
          ref={postsRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0 translate-y-5"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {searchTerm || selectedCategory
                  ? 'No se encontraron articulos con estos filtros'
                  : 'Pronto publicaremos nuevos articulos'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest-100 to-sage-100 flex items-center justify-center">
                          <span className="text-forest-300 text-6xl font-bold">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest-700">
                            <Tag className="w-3 h-3" />
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.published_at || post.created_at}>
                        {formatDate(post.published_at || post.created_at)}
                      </time>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-forest-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium text-sm group/link"
                    >
                      Leer mas
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
