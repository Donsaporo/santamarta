import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase, PageView, BlogPost } from '../../lib/supabase';
import { LineChart } from '../../components/admin/charts/LineChart';

interface DashboardStats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  totalPosts: number;
  publishedPosts: number;
  uniqueVisitors: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    totalPosts: 0,
    publishedPosts: 0,
    uniqueVisitors: 0,
  });
  const [recentViews, setRecentViews] = useState<{ label: string; value: number }[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [viewsResult, postsResult, recentPostsResult] = await Promise.all([
        supabase.from('page_views').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const views = viewsResult.data || [];
      const posts = postsResult.data || [];

      const todayViews = views.filter(v => new Date(v.created_at) >= today).length;
      const weekViews = views.filter(v => new Date(v.created_at) >= weekAgo).length;
      const uniqueSessions = new Set(views.map(v => v.session_id)).size;

      setStats({
        totalViews: views.length,
        todayViews,
        weekViews,
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        uniqueVisitors: uniqueSessions,
      });

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayViews = views.filter(v => v.created_at.split('T')[0] === dateStr).length;
        last7Days.push({
          label: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          value: dayViews,
        });
      }
      setRecentViews(last7Days);

      setRecentPosts(recentPostsResult.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Visitas Hoy', value: stats.todayViews, icon: Eye, color: 'bg-blue-500' },
    { label: 'Visitas esta Semana', value: stats.weekViews, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Visitantes Unicos', value: stats.uniqueVisitors, icon: Users, color: 'bg-orange-500' },
    { label: 'Posts Publicados', value: stats.publishedPosts, icon: FileText, color: 'bg-forest-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu sitio web</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Visitas Ultimos 7 Dias</h2>
            <Link
              to="/admin/analytics"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium flex items-center gap-1"
            >
              Ver mas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <LineChart data={recentViews} height={220} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Posts Recientes</h2>
            <Link
              to="/admin/posts"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay posts todavia</p>
              <Link
                to="/admin/posts/new"
                className="text-forest-600 hover:text-forest-700 font-medium mt-2 inline-block"
              >
                Crear primer post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/posts/${post.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-sm text-gray-500">
                      {post.status === 'published' ? 'Publicado' : 'Borrador'} •{' '}
                      {new Date(post.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
