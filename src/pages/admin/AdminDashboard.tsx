import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, FileText, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { api, BlogPost } from '../../lib/api';
import { LineChart } from '../../components/admin/charts/LineChart';

interface DashboardStats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  prevWeekViews: number;
  totalPosts: number;
  publishedPosts: number;
  uniqueVisitors: number;
  prevUniqueVisitors: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    prevWeekViews: 0,
    totalPosts: 0,
    publishedPosts: 0,
    uniqueVisitors: 0,
    prevUniqueVisitors: 0,
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

      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const [views, posts] = await Promise.all([
        api.analytics.list(),
        api.posts.list(),
      ]);


      const todayViews = views.filter(v => new Date(v.created_at) >= today).length;
      const weekViews = views.filter(v => new Date(v.created_at) >= weekAgo).length;
      const prevWeekViews = views.filter(v => {
        const d = new Date(v.created_at);
        return d >= twoWeeksAgo && d < weekAgo;
      }).length;

      const weekSessions = new Set(
        views.filter(v => new Date(v.created_at) >= weekAgo).map(v => v.session_id)
      ).size;
      const prevWeekSessions = new Set(
        views.filter(v => {
          const d = new Date(v.created_at);
          return d >= twoWeeksAgo && d < weekAgo;
        }).map(v => v.session_id)
      ).size;

      setStats({
        totalViews: views.length,
        todayViews,
        weekViews,
        prevWeekViews,
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        uniqueVisitors: weekSessions,
        prevUniqueVisitors: prevWeekSessions,
      });

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayViews = views.filter(v => new Date(v.created_at).toISOString().split('T')[0] === dateStr).length;
        last7Days.push({
          label: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
          value: dayViews,
        });
      }
      setRecentViews(last7Days);
      setRecentPosts(posts.slice(0, 5));
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

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const weekTrend = getTrend(stats.weekViews, stats.prevWeekViews);
  const visitorTrend = getTrend(stats.uniqueVisitors, stats.prevUniqueVisitors);

  const statCards = [
    {
      label: 'Visitas Hoy',
      value: stats.todayViews,
      icon: Eye,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Visitas esta Semana',
      value: stats.weekViews,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      trend: weekTrend,
    },
    {
      label: 'Visitantes Unicos',
      value: stats.uniqueVisitors,
      icon: Users,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      trend: visitorTrend,
    },
    {
      label: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: FileText,
      color: 'bg-forest-500',
      bgLight: 'bg-forest-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen general de tu sitio web</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const TrendIcon = stat.trend !== undefined && stat.trend >= 0 ? TrendingUp : TrendingDown;
          const trendColor = stat.trend !== undefined && stat.trend >= 0 ? 'text-emerald-600' : 'text-red-500';
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bgLight} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                {stat.trend !== undefined && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                    <TrendIcon className="w-3.5 h-3.5" />
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Visitas Ultimos 7 Dias</h2>
              <p className="text-sm text-gray-500 mt-0.5">{stats.weekViews} visitas totales</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-forest-600 hover:text-forest-700 text-sm font-medium flex items-center gap-1"
            >
              Ver mas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <LineChart data={recentViews} height={240} />
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
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No hay posts todavia</p>
              <Link
                to="/admin/posts/new"
                className="text-forest-600 hover:text-forest-700 font-medium text-sm"
              >
                Crear primer post
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/posts/${post.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm group-hover:text-forest-700 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.status === 'published' ? (
                        <span className="text-emerald-600">Publicado</span>
                      ) : (
                        <span className="text-amber-600">Borrador</span>
                      )}
                      {' '}&middot;{' '}
                      {new Date(post.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-forest-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
