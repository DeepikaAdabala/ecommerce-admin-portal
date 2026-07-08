function PieChart({ data, colors, label }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let angle = 0;

  const segments = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const percentage = ((item.value / total) * 100).toFixed(0);
    const radius = 100;
    const innerRadius = 28;
    const labelRadius = 52;
    const x1 = 100 + radius * Math.cos((Math.PI * angle) / 180);
    const y1 = 100 + radius * Math.sin((Math.PI * angle) / 180);
    angle += sliceAngle;
    const x2 = 100 + radius * Math.cos((Math.PI * angle) / 180);
    const y2 = 100 + radius * Math.sin((Math.PI * angle) / 180);
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const path = `M100,100 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
    
    const midAngle = (angle - sliceAngle / 2) * (Math.PI / 180);
    const textX = 100 + labelRadius * Math.cos(midAngle);
    const textY = 100 + labelRadius * Math.sin(midAngle);
    
    return { item, path, color: colors[index % colors.length], percentage, textX, textY };
  });

  return (
    <div className="chart-card pie-chart-card">
      <div className="chart-header">
        <h6 className="mb-1">{label}</h6>
      </div>
      <svg viewBox="0 0 200 200" className="w-100" style={{ height: '120px' }}>
        {segments.map((segment) => (
          <g key={segment.item.label}>
            <path d={segment.path} fill={segment.color} />
            <text x={segment.textX} y={segment.textY} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              {segment.percentage}%
            </text>
          </g>
        ))}
        <circle cx="100" cy="100" r="28" fill="#fff" />
      </svg>
      <div className="chart-legend mt-1" style={{ fontSize: '0.75rem' }}>
        {segments.map((segment) => (
          <div key={segment.item.label} className="d-flex align-items-center gap-2 mb-1">
            <span className="legend-dot" style={{ background: segment.color, width: '0.65rem', height: '0.65rem' }} />
            <small style={{ fontSize: '0.75rem' }}>{segment.item.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart;
