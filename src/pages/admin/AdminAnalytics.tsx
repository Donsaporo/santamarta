import { useEffect, useState } from 'react';
import { Calendar, Monitor, Globe, Link2, Chrome, MapPin } from 'lucide-react';
import { supabase, PageView } from '../../lib/supabase';
import { LineChart } from '../../components/admin/charts/LineChart';
import { BarChart } from '../../components/admin/charts/BarChart';
import { PieChart } from '../../components/admin/charts/PieChart';

type DateRange = '7d' | '30d' | '90d';

export const AdminAnalytics = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      setPageViews(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDays = () => (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);

  const getViewsByDay = () => {
    const days = getDays();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = pageViews.filter(v => v.created_at.split('T')[0] === dateStr).length;
      result.push({
        label: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        value: count,
      });
    }
    return result;
  };

  const getTopPages = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      const path = v.page_path || '/';
      counts[path] = (counts[path] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getDeviceStats = () => {
    const counts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    pageViews.forEach(v => {
      const device = v.device_type || 'desktop';
      counts[device] = (counts[device] || 0) + 1;
    });
    return [
      { label: 'Desktop', value: counts.desktop, color: '#3a7d3a' },
      { label: 'Mobile', value: counts.mobile, color: '#2563eb' },
      { label: 'Tablet', value: counts.tablet, color: '#f59e0b' },
    ];
  };

  const getBrowserStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      const browser = v.browser || 'Otro';
      counts[browser] = (counts[browser] || 0) + 1;
    });
    const colors = ['#3a7d3a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return Object.entries(counts)
      .map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }))
      .sort((a, b) => b.value - a.value);
  };

  const getReferrerStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      let referrer = v.referrer || '';
      if (!referrer || referrer.trim() === '') {
        referrer = 'Trafico Directo';
      } else {
        try {
          const url = new URL(referrer);
          referrer = url.hostname;
        } catch {
          referrer = 'Otro';
        }
      }
      counts[referrer] = (counts[referrer] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getCountryStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      const country = v.country && v.country.trim() !== '' ? v.country : 'Sin datos';
      counts[country] = (counts[country] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getOSStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      const os = v.os || 'Otro';
      counts[os] = (counts[os] || 0) + 1;
    });
    const colors = ['#3a7d3a', '#2563eb', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];
    return Object.entries(counts)
      .map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }))
      .sort((a, b) => b.value - a.value);
  };

  const uniqueVisitors = new Set(pageViews.map(v => v.session_id)).size;
  const avgPerDay = (pageViews.length / getDays()).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analiticas</h1>
          <p className="text-gray-500 mt-1 text-sm">Metricas detalladas de tu sitio web</p>
        </div>

        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-forest-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-forest-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pageViews.length.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total de Visitas</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Globe className="w-4.5 h-4.5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{uniqueVisitors.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-0.5">Visitantes Unicos</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Monitor className="w-4.5 h-4.5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgPerDay}</p>
          <p className="text-sm text-gray-500 mt-0.5">Promedio por Dia</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Visitas por Dia</h2>
        <p className="text-sm text-gray-500 mb-6">Actividad de los ultimos {getDays()} dias</p>
        <LineChart data={getViewsByDay()} height={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Paginas mas Visitadas</h2>
          <BarChart data={getTopPages()} color="bg-forest-500" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Dispositivos</h2>
          </div>
          <PieChart data={getDeviceStats()} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Link2 className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Fuentes de Trafico</h2>
          </div>
          <BarChart data={getReferrerStats()} color="bg-blue-500" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Paises</h2>
          </div>
          <BarChart data={getCountryStats()} color="bg-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Chrome className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Navegadores</h2>
          </div>
          <PieChart data={getBrowserStats()} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Sistemas Operativos</h2>
          </div>
          <PieChart data={getOSStats()} />
        </div>
      </div>
    </div>
  );
};
