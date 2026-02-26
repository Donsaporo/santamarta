import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { api, BlogPost as BlogPostType } from '../lib/api';
import { SEO } from '../components/SEO';

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const posts = await api.posts.list({ slug: postSlug, status: 'published' });

      if (!posts.length) {
        setNotFound(true);
        return;
      }

      const data = posts[0];
      setPost(data);

      if (data.category_id) {
        const related = await api.posts.list({
          status: 'published',
          category_id: data.category_id,
          exclude: data.id,
          limit: 3,
        });
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getVideoEmbed = (url: string) => {
    if (!url) return null;

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          className="w-full aspect-video rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          className="w-full aspect-video rounded-xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return null;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <SEO title="Articulo no encontrado | Residencial Santa Marta" description="El articulo que buscas no existe o ha sido eliminado." />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Articulo no encontrado</h1>
          <p className="text-gray-600 mb-8">El articulo que buscas no existe o ha sido eliminado.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} | Blog | Residencial Santa Marta`}
        description={post.excerpt || post.title}
        ogImage={post.featured_image}
      />

      <article className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al blog
          </Link>

          <header className="mb-10">
            {post.category && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-100 rounded-full text-sm font-medium text-forest-700">
                  <Tag className="w-4 h-4" />
                  {post.category.name}
                </span>
              </div>
            )}

            <h1 className="text-h1 text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={post.published_at || post.created_at}>
                  {formatDate(post.published_at || post.created_at)}
                </time>
              </div>
            </div>
          </header>

          {post.featured_image && (
            <div className="mb-10">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          )}

          {post.video_url && (
            <div className="mb-10">
              {getVideoEmbed(post.video_url)}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-forest-600 prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-gray-600">
                <Share2 className="w-5 h-5" />
                Compartir:
              </span>
              <div className="flex gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-forest-100 text-gray-600 hover:text-forest-600 rounded-full transition-colors"
                    title={`Compartir en ${link.name}`}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-20 py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-h3 text-gray-900 mb-8 text-center">
                Articulos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 overflow-hidden">
                      {relatedPost.featured_image ? (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest-100 to-sage-100" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-forest-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDate(relatedPost.published_at || relatedPost.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
};
