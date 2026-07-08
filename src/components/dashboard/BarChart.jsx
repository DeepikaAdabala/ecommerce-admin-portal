function BarChart({ data, label, params = [], color = '#673bf681', isVertical = false, xAxisLabel = '', yAxisLabel = '' }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (isVertical) {
    const width = 150;
    const height = 100;
    const padding = 15;
    const baseSlot = (width - padding * 2) / data.length;
    const barWidth = Math.min(baseSlot * 0.45, 32);
    const barGap = baseSlot;

    return (
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h6 className="mb-1">{label}</h6>
            {params.length > 0 && (
              <div className="d-flex flex-wrap gap-3 mt-2">
                {params.map((param) => (
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
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#9ca3af" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#9ca3af" />
          <text x={width / 2} y={height - 4} fill="#6b7280" fontSize="4" textAnchor="middle">
            {xAxisLabel}
          </text>
          <text x={6} y={height / 2} fill="#6b7280" fontSize="4" textAnchor="middle" transform={`rotate(-90 6 ${height / 2})`}>
            {yAxisLabel}
          </text>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - padding * 2);
            const barX = padding + index * barGap + (barGap - barWidth) / 2;
            const barY = height - padding - barHeight;
            return (
              <g key={item.label}>
                <rect x={barX} y={barY} width={barWidth} height={barHeight} fill={color} />
                <text x={barX + barWidth / 2} y={height - padding + 6} fill="#7c6b80" fontSize="4" textAnchor="middle">
                  {item.label}
                </text>
                <text x={barX + barWidth / 2} y={barY - 0.5} fill="#6b7680" fontSize="4" textAnchor="middle">
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h6 className="mb-1">{label}</h6>
      </div>
      <div className="bar-list">
        {data.map((item) => (
          <div key={item.label} className="bar-row mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small>{item.label}</small>
              <small className="fw-semibold">{item.value}</small>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: '#f97316' }}
                aria-valuenow={(item.value / maxValue) * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;
