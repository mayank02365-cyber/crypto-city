import React from 'react';

export interface FearGreedGaugeProps {
  value: number; // 0 - 100
  classification: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ value, classification, size = 'md' }) => {
  const dimensions = {
    sm: { width: 110, height: 65, radius: 48, cx: 55, cy: 60 },
    md: { width: 150, height: 85, radius: 68, cx: 75, cy: 80 },
    lg: { width: 190, height: 105, radius: 88, cx: 95, cy: 100 },
  };

  const { width, height, radius, cx, cy } = dimensions[size];
  const strokeWidth = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  const innerRadius = radius - strokeWidth / 2;

  const sections = [
    { color: '#F43F5E', pct: 0.25 },
    { color: '#F59E0B', pct: 0.2 },
    { color: '#EAB308', pct: 0.1 },
    { color: '#34D399', pct: 0.2 },
    { color: '#10B981', pct: 0.25 },
  ];

  let startA = 180;
  const realArcs = sections.map((sec, i) => {
    const angle = sec.pct * 180;
    const endA = startA - angle;
    
    const startRad = (startA * Math.PI) / 180;
    const endRad = (endA * Math.PI) / 180;

    const x1 = cx + innerRadius * Math.cos(startRad);
    const y1 = cy - innerRadius * Math.sin(startRad);
    const x2 = cx + innerRadius * Math.cos(endRad);
    const y2 = cy - innerRadius * Math.sin(endRad);

    const d = [
      'M', x1, y1,
      'A', innerRadius, innerRadius, 0, 0, 1, x2, y2
    ].join(' ');
    
    startA = endA;
    return <path key={i} d={d} fill="none" stroke={sec.color} strokeWidth={strokeWidth} strokeLinecap="butt" />;
  });

  const needleAngle = 180 - (value / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = innerRadius - strokeWidth;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {realArcs}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#60A5FA"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4.5} fill="#60A5FA" />
      </svg>
      <div className="-mt-1 flex flex-col items-center">
        <span className="font-mono font-bold text-text-primary text-base leading-tight">{value}</span>
        <span className="text-xs text-text-secondary leading-tight capitalize font-medium">{classification}</span>
      </div>
    </div>
  );
};
