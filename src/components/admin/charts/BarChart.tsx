interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  maxBars?: number;
}

export const BarChart = ({ data, color = 'bg-forest-500', maxBars = 10 }: BarChartProps) => {
  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map(d => d.value), 1);

  return (
    <div className="space-y-3">
      {displayData.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-32 text-sm text-gray-600 truncate" title={item.label}>
            {item.label}
          </div>
          <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-sm font-medium text-gray-700 text-right">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-gray-500 text-center py-4">Sin datos disponibles</p>
      )}
    </div>
  );
};
