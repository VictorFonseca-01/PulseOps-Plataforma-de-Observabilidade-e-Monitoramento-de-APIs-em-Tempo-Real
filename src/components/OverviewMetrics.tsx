import type { FC } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Cpu, 
  HardDrive, 
  Database, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import type { SystemMetrics } from '../types/telemetry';

interface OverviewMetricsProps {
  metrics: SystemMetrics;
}

export const OverviewMetrics: FC<OverviewMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. SLA Global Uptime */}
      <div className="glass-panel p-5 hover-glow hover-lift">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Disponibilidade SLA</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> 99.9% target
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold tracking-tight font-['Syne'] text-white">
            {metrics.uptimePercent.toFixed(3)}%
          </span>
          <span className="text-xs text-slate-400 font-mono">últimos 30d</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mb-3">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, metrics.uptimePercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Error Budget restante</span>
          <span className="font-mono text-emerald-400 font-medium">94.2 min</span>
        </div>
      </div>

      {/* 2. Latência p50 / p95 / p99 */}
      <div className="glass-panel p-5 hover-glow hover-lift">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Latência da Rede</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Média: {metrics.avgLatencyMs.toFixed(1)}ms
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold tracking-tight font-['Syne'] text-white">
            {metrics.avgLatencyMs.toFixed(0)}
            <span className="text-lg font-normal text-slate-400 ml-1">ms</span>
          </span>
          <span className="text-xs text-emerald-400 font-mono flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" /> -4.2% vs ontem
          </span>
        </div>

        {/* Quantiles distribution */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
          <div className="bg-white/[0.02] p-1.5 rounded-md text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">p50</div>
            <div className="text-xs font-bold text-slate-200 font-mono">28ms</div>
          </div>
          <div className="bg-white/[0.02] p-1.5 rounded-md text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">p95</div>
            <div className="text-xs font-bold text-indigo-300 font-mono">84ms</div>
          </div>
          <div className="bg-white/[0.02] p-1.5 rounded-md text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">p99</div>
            <div className="text-xs font-bold text-amber-300 font-mono">{metrics.p99LatencyMs.toFixed(0)}ms</div>
          </div>
        </div>
      </div>

      {/* 3. Taxa de Erro HTTP & Throughput */}
      <div className="glass-panel p-5 hover-glow hover-lift">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Taxa de Erro 5xx/4xx</span>
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            metrics.errorRatePercent > 0.5 
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          }`}>
            {metrics.errorRatePercent > 0.5 ? 'Atenção' : 'Excelente'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold tracking-tight font-['Syne'] text-white">
            {metrics.errorRatePercent.toFixed(3)}%
          </span>
          <span className="text-xs text-slate-400 font-mono">das reqs</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mb-3">
          <div 
            className="bg-rose-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, metrics.errorRatePercent * 10)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Throughput Global</span>
          <span className="font-mono text-cyan-400 font-semibold">
            {(metrics.throughputRps / 1000).toFixed(1)}k req/s
          </span>
        </div>
      </div>

      {/* 4. Saúde de Infraestrutura & Cache */}
      <div className="glass-panel p-5 hover-glow hover-lift">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Cluster & Cache</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
            k8s sa-east-1
          </span>
        </div>

        {/* Resource mini bars */}
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" /> CPU Pods
              </span>
              <span className="font-mono font-medium text-slate-200">{metrics.cpuUsagePercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpuUsagePercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-cyan-400" /> Memória
              </span>
              <span className="font-mono font-medium text-slate-200">{metrics.memoryUsagePercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div 
                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memoryUsagePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> Redis Cache Hit
            </span>
            <span className="font-mono text-emerald-400 font-semibold">{metrics.redisCacheHitPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
