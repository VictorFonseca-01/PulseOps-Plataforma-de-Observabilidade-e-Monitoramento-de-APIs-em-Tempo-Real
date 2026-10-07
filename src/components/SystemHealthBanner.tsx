import type { FC } from 'react';
import { CheckCircle2, Flame, ArrowRight } from 'lucide-react';
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
      <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-emerald-200">
            <strong>Todos os Sistemas Operacionais:</strong> 100% dos nós saudáveis, taxa de erro de 0.04% dentro do orçamento de SLA.
          </span>
        </div>
        <span className="font-mono text-emerald-400 text-[11px] hidden sm:inline">
          SLA Global: 99.982%
        </span>
      </div>
    );
  }

  const topIncident = activeIncidents[0];

  return (
    <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-black/40 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-rose-950/20 animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="p-1 rounded-md bg-rose-500/20 border border-rose-500/40">
          <Flame className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <span className="font-bold text-rose-200 mr-2">
            [{topIncident.severity} - {topIncident.status.toUpperCase()}]:
          </span>
          <span className="text-slate-200">
            {topIncident.title} ({topIncident.affectedServices.join(', ')})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onQuickMitigate}
          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold font-mono transition-all"
        >
          Mitigar Rota
        </button>
        <button
          onClick={onViewIncidents}
          className="flex items-center gap-1 text-slate-300 hover:text-white text-[11px] font-semibold transition-all"
        >
          <span>Ver Detalhes</span>
          <ArrowRight className="w-3 h-3 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
