import type { ChartDatum } from '../../types/ecommerce';

interface LineChartProps {
  data: ChartDatum[];
  color?: string;
  label: string;
  params?: Array<{ label: string; value: string | number }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisTicks?: number[];
}

function LineChart({ data, color = '#2563eb', label, params = [], xAxisLabel = 'X axis', yAxisLabel = 'Y axis', yAxisTicks = [] }: LineChartProps) {
  const rawMaxValue = Math.max(...data.map((point: ChartDatum) => point.value), 1);
  const axisMaxValue = yAxisTicks.length ? Math.max(rawMaxValue, yAxisTicks[yAxisTicks.length - 1]) : rawMaxValue;
  const width = 320;
  const height = 180;
  const padding = 30;
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data
    .map((point: ChartDatum, index: number) => {
      const x = padding + index * stepX;
      const y = height - padding - (point.value / axisMaxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const yTicks = yAxisTicks.length
    ? yAxisTicks.map((value) => ({ value, ratio: value / axisMaxValue }))
    : [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({ value: Math.round(axisMaxValue * ratio), ratio }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h6 className="mb-1">{label}</h6>
          {params.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mt-2">
              {params.map((param: { label: string; value: string | number }) => (
                <div key={param.label} className="text-muted small">
                  <span className="d-block text-uppercase fw-semibold small text-dark">{param.label}</span>
                  <span>{param.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-100">
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#e5e7eb" strokeWidth="1">
          {yTicks.map((tick) => {
            const y = padding + (1 - tick.ratio) * (height - padding * 2);
            return <line key={tick.value} x1={padding} y1={y} x2={width - padding} y2={y} />;
          })}
        </g>
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#9ca3af" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#9ca3af" />
        {yTicks.map((tick) => {
          const y = padding + (1 - tick.ratio) * (height - padding * 2);
          return (
            <text key={`tick-${tick.value}`} x={padding - 10} y={y + 4} fill="#6b7280" fontSize="11" textAnchor="end">
              ${tick.value}
            </text>
          );
        })}
        <text x={width / 2} y={height - 10} fill="#6b7280" fontSize="12" textAnchor="middle">
          {xAxisLabel}
        </text>
        <text x={12} y={height / 2} fill="#6b7280" fontSize="12" textAnchor="middle" transform={`rotate(-90 12 ${height / 2})`}>
          {yAxisLabel}
        </text>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
        />
        <polygon fill="url(#lineGradient)" points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} />
        {data.map((point, index) => {
          const x = padding + index * stepX;
          const y = height - padding - (point.value / axisMaxValue) * (height - padding * 2);
          return <circle key={point.label} cx={x} cy={y} r="4" fill={color} />;
        })}
        {data.map((point, index) => {
          const x = padding + index * stepX;
          return (
            <text key={`${point.label}-label`} x={x} y={height - padding + 16} fill="#6b7280" fontSize="11" textAnchor="middle">
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default LineChart;
