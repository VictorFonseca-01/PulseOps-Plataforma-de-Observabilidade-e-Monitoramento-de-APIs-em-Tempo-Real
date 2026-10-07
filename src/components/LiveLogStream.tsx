import { useState, type FC } from 'react';
import type { LogEntry, LogLevel } from '../types/telemetry';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  ChevronDown,
  ChevronRight,
  Bot
} from 'lucide-react';

interface LiveLogStreamProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  isStreaming: boolean;
  onNavigateToLaya?: () => void;
}

export const LiveLogStream: FC<LiveLogStreamProps> = ({
  logs,
  onClearLogs,
  isStreaming,
  onNavigateToLaya,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [copiedTraceId, setCopiedTraceId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleCopyTrace = (traceId: string) => {
    navigator.clipboard.writeText(traceId);
    setCopiedTraceId(traceId);
    setTimeout(() => setCopiedTraceId(null), 1500);
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `devpulse-logs-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch = 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase()) ||
      log.traceId.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelBadgeClass = (level: LogLevel) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'WARN':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'ERROR':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'CRITICAL':
        return 'bg-red-600/20 text-red-200 border-red-500/40 font-bold';
      case 'DEBUG':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Console de Logs Distribuídos & Tracing</h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {isStreaming ? '● Ingestion Ativa' : '○ Pausado'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming de eventos agregados de pods, gateways e microserviços com correlação de traces
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 text-xs font-mono">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-1 rounded transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por trace, serviço ou mensagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 w-52 sm:w-64"
            />
          </div>

          {/* Export JSON */}
          <button
            onClick={handleExportLogs}
            title="Exportar logs como JSON"
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClearLogs}
            title="Limpar logs visíveis"
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="relative bg-[#070911] border border-white/10 rounded-xl overflow-hidden font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-black/40 border-b border-white/5 text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
            <span className="ml-2 font-mono text-slate-400">stdout/cluster.telemetry.log</span>
          </div>
          <span className="text-slate-500">Exibindo {filteredLogs.length} eventos</span>
        </div>

        {/* Logs Feed Container */}
        <div className="max-h-[360px] overflow-y-auto p-3 space-y-1.5 terminal-scanline">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const isCopied = copiedTraceId === log.traceId;

            return (
              <div
                key={log.id}
                className="rounded-lg bg-black/25 hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all p-2"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                  {/* Left: Time, Level, Service, Message */}
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-slate-500 hover:text-slate-300 mt-0.5"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>

                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${getLevelBadgeClass(log.level)}`}>
                      {log.level}
                    </span>

                    <span className="text-indigo-400 font-bold shrink-0">
                      [{log.service}]
                    </span>

                    <span className="text-slate-300 break-words">
                      {log.message}
                    </span>
                  </div>

                  {/* Right: Trace ID & Latency */}
                  <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                    {log.durationMs !== undefined && (
                      <span className={`text-[11px] ${log.durationMs > 250 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        {log.durationMs}ms
                      </span>
                    )}

                    <button
                      onClick={() => handleCopyTrace(log.traceId)}
                      title="Copiar Trace ID para rastreamento distribuído"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5 transition-all"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{log.traceId}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded JSON details */}
                {isExpanded && log.payload && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 pl-6 text-[11px]">
                    <div className="text-slate-400 mb-1 font-semibold text-[10px] uppercase">Metadata Payload:</div>
                    <pre className="bg-black/60 p-2.5 rounded border border-white/5 text-cyan-300 overflow-x-auto">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>

                    {onNavigateToLaya && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={onNavigateToLaya}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition-all shadow-sm"
                        >
                          <Bot className="w-3 h-3 text-purple-400" />
                          Triar Evento com Laya MCP (~33ms)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Nenhum log correspondente aos filtros atuais.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
