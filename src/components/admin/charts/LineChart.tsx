import { useState, useId } from 'react';

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export const LineChart = ({ data, color = '#3a7d3a', height = 200 }: LineChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const niceMax = Math.ceil(maxValue * 1.1) || 1;

  const paddingLeft = 48;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 40;
  const svgWidth = 800;
  const svgHeight = height;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
  const getY = (value: number) =>
    paddingTop + chartHeight - (value / niceMax) * chartHeight;

  const points = data.map((item, index) => ({
    x: getX(index),
    y: getY(item.value),
    ...item,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`;

  const gridLines = 5;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = Math.round((niceMax / gridLines) * i);
    return { value: val, y: getY(val) };
  });

  const maxLabels = 8;
  const step = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={svgWidth - paddingRight}
              y2={tick.y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray={i === 0 ? 'none' : '4 4'}
            />
            <text
              x={paddingLeft - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-gray-400"
              fontSize="12"
            >
              {tick.value}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />

        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === i ? 6 : 4}
            fill="white"
            stroke={color}
            strokeWidth="2.5"
            className="transition-all duration-150"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}

        {data.map((item, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={i}
              x={getX(i)}
              y={svgHeight - 8}
              textAnchor="middle"
              className="fill-gray-400"
              fontSize="11"
            >
              {item.label}
            </text>
          );
        })}

        {hoveredIndex !== null && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
          </g>
        )}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10"
          style={{
            left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
            top: `${(points[hoveredIndex].y / svgHeight) * 100 - 12}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium">{data[hoveredIndex].label}</div>
          <div className="text-gray-300">{data[hoveredIndex].value} visitas</div>
        </div>
      )}
    </div>
  );
};
