interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export const LineChart = ({ data, color = '#3a7d3a', height = 200 }: LineChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 40;
  const chartWidth = 100;
  const chartHeight = height - padding * 2;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (item.value / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${chartHeight} L ${points.join(' L ')} L ${chartWidth},${chartHeight} Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`-10 -10 ${chartWidth + 20} ${chartHeight + 20}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
          <line
            key={i}
            x1="0"
            y1={chartHeight - tick * chartHeight}
            x2={chartWidth}
            y2={chartHeight - tick * chartHeight}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        <path d={areaD} fill="url(#areaGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => {
          const x = (index / (data.length - 1 || 1)) * chartWidth;
          const y = chartHeight - (item.value / maxValue) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="white"
              stroke={color}
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map((item, index) => (
          <span key={index} className="truncate max-w-[60px]">{item.label}</span>
        ))}
      </div>
    </div>
  );
};
