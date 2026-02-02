interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export const PieChart = ({ data, size = 200 }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: size }}>
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  let currentAngle = -90;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return {
      ...item,
      pathD,
      percentage,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="flex-shrink-0">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathD}
            fill={slice.color}
            stroke="white"
            strokeWidth="2"
            className="transition-opacity hover:opacity-80"
          />
        ))}
        <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="white" />
      </svg>

      <div className="space-y-2 flex-1">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-600 truncate">{slice.label}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">
              {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
