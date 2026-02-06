const PAGE_LABELS: Record<string, string> = {
  '/': 'Inicio',
  '/nosotros': 'Nosotros',
  '/servicios': 'Servicios',
  '/testimonios': 'Testimonios',
  '/contacto': 'Contacto',
  '/blog': 'Blog',
};

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  maxBars?: number;
}

export const BarChart = ({ data, color = 'bg-forest-500', maxBars = 10 }: BarChartProps) => {
  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map(d => d.value), 1);
  const total = displayData.reduce((sum, d) => sum + d.value, 0);

  const getLabel = (raw: string) => PAGE_LABELS[raw] || raw;

  return (
    <div className="space-y-3">
      {displayData.map((item, index) => {
        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
        const widthPct = (item.value / maxValue) * 100;
        return (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]" title={item.label}>
                {getLabel(item.label)}
              </span>
              <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                {item.value.toLocaleString()} <span className="text-gray-400">({pct}%)</span>
              </span>
            </div>
            <div className="h-7 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-700 ease-out group-hover:opacity-80`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
      {data.length === 0 && (
        <p className="text-gray-500 text-center py-4">Sin datos disponibles</p>
      )}
    </div>
  );
};
