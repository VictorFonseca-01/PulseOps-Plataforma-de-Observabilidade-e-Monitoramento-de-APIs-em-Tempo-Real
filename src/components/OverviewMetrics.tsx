import type { FC } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Activity, 
  Cpu 
} from 'lucide-react';
import type { SystemMetrics } from '../types/telemetry';

interface OverviewMetricsProps {
  metrics: SystemMetrics;
}

export const OverviewMetrics: FC<OverviewMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Disponibilidade & SLA */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Disponibilidade Global
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              99.9% SLA
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
              {metrics.uptimePercent.toFixed(3)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">últimos 30d</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Error Budget Restante:</span>
          <span className="font-mono text-emerald-400 font-semibold">94.2 min</span>
        </div>
      </div>

      {/* 2. Latência da Rede */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Latência de Rede
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Média Geral
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
              {metrics.avgLatencyMs.toFixed(0)}
              <span className="text-lg font-normal text-slate-400 ml-1">ms</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              -4.2% vs ontem
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>p50: <strong className="text-slate-200">28ms</strong></span>
          <span>p95: <strong className="text-indigo-300">84ms</strong></span>
          <span>p99: <strong className="text-amber-300">{metrics.p99LatencyMs.toFixed(0)}ms</strong></span>
        </div>
      </div>

      {/* 3. Throughput & Erros */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Vazão (Throughput)
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded-full border ${
              metrics.errorRatePercent > 0.5 
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {metrics.errorRatePercent > 0.5 ? 'Atenção 5xx' : 'Taxa de Erro Normal'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
              {(metrics.throughputRps / 1000).toFixed(1)}k
              <span className="text-lg font-normal text-slate-400 ml-1">req/s</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {metrics.activeSockets} sockets
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Taxa de Erro HTTP:</span>
          <span className="font-mono text-emerald-400 font-semibold">{metrics.errorRatePercent.toFixed(3)}%</span>
        </div>
      </div>

      {/* 4. Saúde do Cluster */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Infraestrutura & Cache
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-white/5 text-slate-300 border border-white/10">
              k8s sa-east-1
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
              {metrics.cpuUsagePercent.toFixed(0)}%
              <span className="text-lg font-normal text-slate-400 ml-1">CPU</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              RAM: {metrics.memoryUsagePercent.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Redis Cache Hit:</span>
          <span className="font-mono text-emerald-400 font-semibold">{metrics.redisCacheHitPercent.toFixed(1)}%</span>
        </div>
      </div>

    </div>
  );
};
