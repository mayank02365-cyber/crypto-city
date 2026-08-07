import React, { useState } from 'react';

export interface TradingChartData {
  timestamp: number;
  price: number;
}

export interface TradingChartProps {
  data: TradingChartData[];
  coinName?: string;
  isPositive?: boolean;
  height?: number;
  timeframe?: string;
  isLoading?: boolean;
  onTimeframeChange?: (tf: string) => void;
}

const TIMEFRAMES = ['1H', '24H', '7D', '30D', '90D', '1Y', 'ALL'];

function formatTimeframeDate(timestamp: number, timeframe: string): string {
  const date = new Date(timestamp);
  if (timeframe === '1H') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  if (timeframe === '24H') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (timeframe === '7D' || timeframe === '30D') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  if (timeframe === '90D' || timeframe === '1Y') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
}

function formatXAxisLabel(timestamp: number, timeframe: string): string {
  const date = new Date(timestamp);
  if (timeframe === '1H') {
    return date.toLocaleTimeString([], { minute: '2-digit' }) + 'm';
  }
  if (timeframe === '24H') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (timeframe === '7D' || timeframe === '30D') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  if (timeframe === '90D' || timeframe === '1Y') {
    return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
  }
  return date.toLocaleDateString([], { year: 'numeric' });
}

export const TradingChart: React.FC<TradingChartProps> = ({
  data,
  coinName,
  isPositive = true,
  height = 280,
  timeframe = '7D',
  isLoading = false,
  onTimeframeChange,
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState(timeframe);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; data: TradingChartData } | null>(null);

  const currentTf = onTimeframeChange ? timeframe : internalTimeframe;

  const handleTimeframeClick = (tf: string) => {
    setInternalTimeframe(tf);
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    }
  };

  const startPrice = data && data.length > 0 ? data[0].price : 0;

  if (isLoading || !data || data.length < 2) {
    return (
      <div className="flex flex-col w-full">
        {/* Timeframe Selector Header */}
        <div className="flex justify-end gap-1 mb-3">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              disabled={isLoading}
              onClick={() => handleTimeframeClick(tf)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                currentTf === tf
                  ? 'bg-accent text-bg-primary shadow-glow-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div style={{ height }} className="flex flex-col items-center justify-center space-y-2 glass-card animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-text-muted text-xs font-mono">Fetching {currentTf} historical market data...</span>
        </div>
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 35, left: 55 };
  const viewWidth = 700;
  const viewHeight = height;

  const strokeColor = isPositive ? '#60A5FA' : '#F43F5E';
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const chartW = viewWidth - padding.left - padding.right;
  const chartH = viewHeight - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.price - minPrice) / priceRange) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`;

  const gradientId = `svg-gradient-${coinName ? coinName.replace(/\s+/g, '-') : 'default'}-${currentTf}`;

  // Y-axis ticks
  const yTicks = [
    minPrice,
    minPrice + priceRange * 0.33,
    minPrice + priceRange * 0.66,
    maxPrice,
  ];

  // X-axis ticks (5 labels across graph)
  const xTickIndices = [
    0,
    Math.floor((points.length - 1) * 0.25),
    Math.floor((points.length - 1) * 0.5),
    Math.floor((points.length - 1) * 0.75),
    points.length - 1,
  ];

  const formatPrice = (p: number) => {
    if (p >= 1000) return `$${(p / 1000).toFixed(1)}k`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    return `$${p.toFixed(4)}`;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Timeframe Buttons Header */}
      <div className="flex justify-end gap-1 mb-3">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => handleTimeframeClick(tf)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              currentTf === tf
                ? 'bg-accent text-bg-primary shadow-glow-accent'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="relative w-full overflow-hidden" style={{ height }}>
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-full overflow-visible transition-all duration-300"
          onMouseLeave={() => setHoverPoint(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid Y-lines & Labels */}
          {yTicks.map((tick, idx) => {
            const y = padding.top + chartH - ((tick - minPrice) / priceRange) * chartH;
            return (
              <g key={`y-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={viewWidth - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="end"
                >
                  {formatPrice(tick)}
                </text>
              </g>
            );
          })}

          {/* X-axis Labels */}
          {xTickIndices.map((idxVal) => {
            const pt = points[idxVal];
            if (!pt) return null;
            return (
              <text
                key={`x-${idxVal}`}
                x={pt.x}
                y={padding.top + chartH + 18}
                fill="#64748B"
                fontSize="10"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
              >
                {formatXAxisLabel(pt.data.timestamp, currentTf)}
              </text>
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaD} fill={`url(#${gradientId})`} className="transition-all duration-500 ease-in-out" />

          {/* Smooth Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Hover Targets */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={10}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverPoint(pt)}
            />
          ))}

          {/* Hover Crosshair */}
          {hoverPoint && (
            <g>
              <line
                x1={hoverPoint.x}
                y1={padding.top}
                x2={hoverPoint.x}
                y2={padding.top + chartH}
                stroke="rgba(96, 165, 250, 0.35)"
                strokeDasharray="2 2"
              />
              <circle cx={hoverPoint.x} cy={hoverPoint.y} r={5} fill={strokeColor} stroke="#FFFFFF" strokeWidth={2} />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoverPoint && (
          <div
            className="absolute z-20 glass-modal px-3.5 py-2.5 rounded-xl border border-border shadow-elevated pointer-events-none space-y-0.5"
            style={{
              left: `${Math.min(Math.max(hoverPoint.x, 90), viewWidth - 110)}px`,
              top: `${Math.max(hoverPoint.y - 55, 10)}px`,
            }}
          >
            <p className="text-[10px] text-text-muted font-mono">
              {formatTimeframeDate(hoverPoint.data.timestamp, currentTf)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold text-text-primary">
                ${hoverPoint.data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {startPrice > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold ${
                    hoverPoint.data.price >= startPrice ? 'text-positive' : 'text-negative'
                  }`}
                >
                  {hoverPoint.data.price >= startPrice ? '+' : ''}
                  {(((hoverPoint.data.price - startPrice) / startPrice) * 100).toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
