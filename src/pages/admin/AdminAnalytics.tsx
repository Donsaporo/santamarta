import { useEffect, useState } from 'react';
import { Calendar, Monitor, Globe, Link2 } from 'lucide-react';
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

  const getViewsByDay = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = pageViews.filter(v => v.created_at.split('T')[0] === dateStr).length;

      result.push({
        label: date.toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
        }),
        value: count,
      });
    }

    return result;
  };

  const getTopPages = () => {
    const pageCounts: Record<string, number> = {};
    pageViews.forEach(v => {
      const path = v.page_path || '/';
      pageCounts[path] = (pageCounts[path] || 0) + 1;
    });

    return Object.entries(pageCounts)
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
      { label: 'Mobile', value: counts.mobile, color: '#4a9d4a' },
      { label: 'Tablet', value: counts.tablet, color: '#6bb76b' },
    ];
  };

  const getBrowserStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      const browser = v.browser || 'Desconocido';
      counts[browser] = (counts[browser] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getReferrerStats = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach(v => {
      let referrer = v.referrer || 'Directo';
      if (referrer && referrer !== 'Directo') {
        try {
          const url = new URL(referrer);
          referrer = url.hostname;
        } catch {
          referrer = 'Desconocido';
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
      const country = v.country || 'Desconocido';
      counts[country] = (counts[country] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };

  const uniqueVisitors = new Set(pageViews.map(v => v.session_id)).size;

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
          <p className="text-gray-600 mt-1">Metricas detalladas de tu sitio web</p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-forest-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-forest-500" />
            <span className="text-sm text-gray-500">Total de Visitas</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pageViews.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Visitantes Unicos</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">Promedio/Dia</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {(pageViews.length / (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90)).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Visitas por Dia</h2>
        <LineChart data={getViewsByDay()} height={280} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Paginas mas Visitadas</h2>
          <BarChart data={getTopPages()} color="bg-forest-500" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dispositivos</h2>
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
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Paises</h2>
          </div>
          <BarChart data={getCountryStats()} color="bg-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Navegadores</h2>
        <BarChart data={getBrowserStats()} color="bg-sage-500" />
      </div>
    </div>
  );
};
