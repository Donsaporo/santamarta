import { useState } from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export const PieChart = ({ data, size = 180 }: PieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const radius = size / 2 - 10;
  const hoverRadius = radius + 6;
  const centerX = size / 2;
  const centerY = size / 2;

  let currentAngle = -90;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const isHovered = hoveredIndex === index;
    const r = isHovered ? hoverRadius : radius;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + r * Math.cos(startRad);
    const y1 = centerY + r * Math.sin(startRad);
    const x2 = centerX + r * Math.cos(endRad);
    const y2 = centerY + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return { ...item, pathD, percentage, index };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-shrink-0" style={{ width: size + 12, height: size + 12 }}>
        <svg
          width={size + 12}
          height={size + 12}
          viewBox={`-6 -6 ${size + 12} ${size + 12}`}
        >
          {slices.map((slice) => (
            <path
              key={slice.index}
              d={slice.pathD}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer"
              opacity={hoveredIndex !== null && hoveredIndex !== slice.index ? 0.5 : 1}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
          <circle cx={centerX} cy={centerY} r={radius * 0.45} fill="white" />
          {hoveredIndex !== null && (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-900 font-semibold"
              fontSize="18"
            >
              {slices[hoveredIndex].percentage.toFixed(0)}%
            </text>
          )}
        </svg>
      </div>

      <div className="space-y-2.5 flex-1 min-w-0">
        {slices.map((slice) => (
          <div
            key={slice.index}
            className={`flex items-center gap-2.5 transition-opacity duration-200 cursor-pointer ${
              hoveredIndex !== null && hoveredIndex !== slice.index ? 'opacity-50' : ''
            }`}
            onMouseEnter={() => setHoveredIndex(slice.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-700 truncate">{slice.label}</span>
            <span className="text-sm font-semibold text-gray-900 ml-auto whitespace-nowrap">
              {slice.percentage.toFixed(1)}%
              <span className="text-gray-400 font-normal ml-1">({slice.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
