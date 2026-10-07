import type { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Incident } from '../types/telemetry';

interface SystemHealthBannerProps {
  activeIncidents: Incident[];
  onViewIncidents: () => void;
  onQuickMitigate: () => void;
}

export const SystemHealthBanner: FC<SystemHealthBannerProps> = ({
  activeIncidents,
  onViewIncidents,
  onQuickMitigate,
}) => {
  const isHealthy = activeIncidents.length === 0;

  if (isHealthy) {
    return (
      <div className="mb-6 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            Todos os 10 microsserviços operando normalmente. Taxa de erro de 0.04% dentro do orçamento.
          </span>
        </div>
        <span className="font-mono text-emerald-400 font-semibold text-xs hidden sm:inline">
          SLA Global: 99.982%
        </span>
      </div>
    );
  }

  const topIncident = activeIncidents[0];

  return (
    <div className="mb-6 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[11px] border border-rose-500/30">
          {topIncident.severity}
        </span>
        <span className="text-slate-200">
          <strong className="text-white">{topIncident.title}</strong> — {topIncident.affectedServices.join(', ')}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onQuickMitigate}
          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all"
        >
          Mitigar Agora
        </button>
        <button
          onClick={onViewIncidents}
          className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <span>Ver Detalhes</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
