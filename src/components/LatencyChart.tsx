import { useState, type FC } from 'react';
import type { LatencyDataPoint } from '../types/telemetry';
import { Activity } from 'lucide-react';

interface LatencyChartProps {
  data: LatencyDataPoint[];
}

export const LatencyChart: FC<LatencyChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'5m' | '15m' | '1h' | '24h'>('15m');
  const [showP50, setShowP50] = useState(true);
  const [showP95, setShowP95] = useState(true);
  const [showP99, setShowP99] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter or slice data according to timeframe
  const displayData = data.slice(-20);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Calculate scales
  const maxVal = Math.max(...displayData.map((d) => Math.max(d.p50, d.p95, d.p99)), 180);
  const minVal = 0;

  const getX = (index: number) => paddingX + (index / (displayData.length - 1 || 1)) * plotWidth;
  const getY = (val: number) => svgHeight - paddingY - ((val - minVal) / (maxVal - minVal || 1)) * plotHeight;

  // Generate SVG path for a line
  const makePath = (key: 'p50' | 'p95' | 'p99') => {
    return displayData.reduce((acc, point, idx) => {
      const x = getX(idx);
      const y = getY(point[key]);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  // Generate Area Path for p50
  const makeAreaPath = () => {
    if (displayData.length === 0) return '';
    const linePath = displayData.map((p, i) => `${getX(i)},${getY(p.p50)}`).join(' L ');
    const firstX = getX(0);
    const lastX = getX(displayData.length - 1);
    const baseY = svgHeight - paddingY;
    return `M ${firstX},${baseY} L ${linePath} L ${lastX},${baseY} Z`;
  };

  const hoveredPoint = hoveredIndex !== null && displayData[hoveredIndex] ? displayData[hoveredIndex] : null;

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Telemetria de Latência em Tempo Real</h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ● Live Streaming
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribuição percentil p50 (mediana), p95 e p99 agregada a cada 5 segundos
          </p>
        </div>

        {/* Controls: Metric visibility & Timeframe */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Legend Toggles */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setShowP50(!showP50)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                showP50 ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              p50
            </button>
            <button
              onClick={() => setShowP95(!showP95)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                showP95 ? 'bg-indigo-500/20 text-indigo-300 font-semibold' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
              p95
            </button>
            <button
              onClick={() => setShowP99(!showP99)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                showP99 ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              p99
            </button>
          </div>

          {/* Timeframe Select */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 text-xs font-mono">
            {(['5m', '15m', '1h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeframe === tf
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative w-full overflow-hidden bg-black/30 rounded-xl border border-white/5 p-2">
        
        {/* Tooltip on hover */}
        {hoveredPoint && (
          <div 
            className="absolute top-4 left-6 z-10 bg-[#0d111d]/90 backdrop-blur-md border border-indigo-500/30 rounded-lg p-2.5 shadow-xl text-xs flex items-center gap-4 animate-in fade-in"
          >
            <div className="font-mono text-slate-300 font-bold border-r border-white/10 pr-3">
              ⏱ {hoveredPoint.time}
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-cyan-300">
                p50: <strong>{hoveredPoint.p50}ms</strong>
              </span>
              <span className="text-indigo-300">
                p95: <strong>{hoveredPoint.p95}ms</strong>
              </span>
              <span className="text-amber-300">
                p99: <strong>{hoveredPoint.p99}ms</strong>
              </span>
              <span className="text-emerald-400">
                RPS: <strong>{(hoveredPoint.rps / 1000).toFixed(1)}k</strong>
              </span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="p95Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = svgHeight - paddingY - ratio * plotHeight;
            const val = Math.round(minVal + ratio * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="rgba(148, 163, 184, 0.6)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {val}ms
                </text>
              </g>
            );
          })}

          {/* Area fill for p50 */}
          {showP50 && <path d={makeAreaPath()} fill="url(#areaGradient)" />}

          {/* P99 Line (Amber/Rose) */}
          {showP99 && (
            <path
              d={makePath('p99')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="2 2"
              className="transition-all duration-300"
            />
          )}

          {/* P95 Line (Indigo) */}
          {showP95 && (
            <path
              d={makePath('p95')}
              fill="none"
              stroke="url(#p95Grad)"
              strokeWidth="2.5"
              className="transition-all duration-300"
            />
          )}

          {/* P50 Line (Cyan) */}
          {showP50 && (
            <path
              d={makePath('p50')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="transition-all duration-300"
            />
          )}

          {/* Interactive vertical hover lines and dots */}
          {displayData.map((point, idx) => {
            const cx = getX(idx);
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="cursor-pointer"
              >
                {/* Invisible hover capture column */}
                <rect
                  x={cx - (plotWidth / displayData.length) / 2}
                  y={paddingY}
                  width={plotWidth / displayData.length}
                  height={plotHeight}
                  fill="transparent"
                />

                {isHovered && (
                  <>
                    <line
                      x1={cx}
                      y1={paddingY}
                      x2={cx}
                      y2={svgHeight - paddingY}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    {showP50 && (
                      <circle cx={cx} cy={getY(point.p50)} r="4.5" fill="#06b6d4" stroke="#fff" strokeWidth="2" />
                    )}
                    {showP95 && (
                      <circle cx={cx} cy={getY(point.p95)} r="4.5" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                    )}
                    {showP99 && (
                      <circle cx={cx} cy={getY(point.p99)} r="4.5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                    )}
                  </>
                )}
              </g>
            );
          })}

          {/* X Axis Time Labels */}
          {displayData.map((point, idx) => {
            // Render every 4th label to prevent overlapping
            if (idx % 4 !== 0 && idx !== displayData.length - 1) return null;
            return (
              <text
                key={idx}
                x={getX(idx)}
                y={svgHeight - 10}
                fill="rgba(148, 163, 184, 0.6)"
                fontSize="10"
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
              >
                {point.time}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
