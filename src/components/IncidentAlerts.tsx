import { useState, type FC } from 'react';
import type { Incident, IncidentStatus } from '../types/telemetry';
import { 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  Flame, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react';

interface IncidentAlertsProps {
  incidents: Incident[];
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
  onTriggerChaosSim: () => void;
  onNavigateToLaya?: () => void;
}

export const IncidentAlerts: FC<IncidentAlertsProps> = ({
  incidents,
  onUpdateIncidentStatus,
  onTriggerChaosSim,
  onNavigateToLaya,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(incidents[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPostMortem = (inc: Incident) => {
    const postMortemMd = `# Relatório de Incidente Post-Mortem: ${inc.title}
- **ID:** ${inc.id}
- **Severidade:** ${inc.severity}
- **Status:** ${inc.status.toUpperCase()}
- **Início:** ${inc.startedAt}
- **Serviços Afetados:** ${inc.affectedServices.join(', ')}

### Descrição
${inc.description}

### Causa Raiz (Root Cause)
${inc.rootCause}

### Mitigação e Resolução
${inc.mitigation}

### Impacto de Negócio / SLA
${inc.impact}
`;
    navigator.clipboard.writeText(postMortemMd);
    setCopiedId(inc.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getSeverityBadge = (severity: Incident['severity']) => {
    switch (severity) {
      case 'P1':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-extrabold';
      case 'P2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
      case 'P3':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'investigating':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'identified':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'monitoring':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white">Central de Incidentes & Alertas de SLA (SRE)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de incidentes ativos, triagem de causa raiz e relatórios de post-mortem
          </p>
        </div>

        <button
          onClick={onTriggerChaosSim}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all self-start sm:self-auto"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          Injetar Simulação de Incidente (Chaos Engineering)
        </button>
      </div>

      {/* Incident Cards */}
      <div className="space-y-3">
        {incidents.map((inc) => {
          const isExpanded = expandedId === inc.id;
          const isCopied = copiedId === inc.id;

          return (
            <div
              key={inc.id}
              className={`rounded-xl border transition-all ${
                inc.status !== 'resolved'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Card Summary Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start md:items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${getSeverityBadge(inc.severity)}`}>
                    {inc.severity}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{inc.title}</span>
                      <span className="text-xs font-mono text-slate-400">[{inc.id}]</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] font-mono">
                        <Clock className="w-3 h-3 text-slate-500" /> {inc.startedAt}
                      </span>
                      <span>•</span>
                      <span className="text-[11px]">
                        Serviços: <strong className="text-indigo-300">{inc.affectedServices.join(', ')}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusBadge(inc.status)}`}>
                    {inc.status === 'investigating' ? 'Investigando' :
                     inc.status === 'identified' ? 'Causa Identificada' :
                     inc.status === 'monitoring' ? 'Em Monitoramento' : 'Resolvido'}
                  </span>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Incident Deep-Dive Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="text-rose-400 font-bold block mb-1 uppercase text-[10px]">Diagnóstico da Causa Raiz:</span>
                      <p className="text-slate-300 font-sans">{inc.rootCause}</p>
                    </div>

                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-bold block mb-1 uppercase text-[10px]">Ação de Mitigação:</span>
                      <p className="text-slate-300 font-sans">{inc.mitigation}</p>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-xs">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px] font-mono">Impacto Registrado no SLA:</span>
                    <p className="text-slate-300">{inc.impact}</p>
                  </div>

                  {/* Incident Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {inc.status !== 'resolved' ? (
                        <>
                          {inc.status === 'investigating' && (
                            <button
                              onClick={() => onUpdateIncidentStatus(inc.id, 'identified')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                            >
                              Identificar Causa (ACK)
                            </button>
                          )}
                          <button
                            onClick={() => onUpdateIncidentStatus(inc.id, 'resolved')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Marcar como Resolvido
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Incidente mitigado e encerrado
                        </span>
                      )}
                      {onNavigateToLaya && (
                        <button
                          onClick={onNavigateToLaya}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 hover:scale-[1.02] transition-all shadow-md shadow-purple-500/10"
                        >
                          <Bot className="w-3.5 h-3.5 text-purple-400" />
                          Triagem Laya MCP (~33ms)
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyPostMortem(inc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Post-Mortem Copiado!' : 'Copiar Post-Mortem (MD)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
