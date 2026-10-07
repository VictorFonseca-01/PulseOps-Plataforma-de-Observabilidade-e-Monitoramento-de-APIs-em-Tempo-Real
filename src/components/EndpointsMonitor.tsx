import { useState, type FC } from 'react';
import type { EndpointCheck } from '../types/telemetry';
import { 
  Server, 
  Search, 
  RefreshCw, 
  Zap
} from 'lucide-react';

interface EndpointsMonitorProps {
  endpoints: EndpointCheck[];
  onPingEndpoint: (id: string) => void;
  onOpenSyntheticProbe: () => void;
}

export const EndpointsMonitor: FC<EndpointsMonitorProps> = ({
  endpoints,
  onPingEndpoint,
  onOpenSyntheticProbe,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handlePing = async (id: string) => {
    setPingingId(id);
    await onPingEndpoint(id);
    setTimeout(() => {
      setPingingId(null);
    }, 600);
  };

  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch = 
      ep.name.toLowerCase().includes(search.toLowerCase()) || 
      ep.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Monitor de Endpoints & Contratos de SLA</h3>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
              {endpoints.length} serviços registrados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Checagens sintéticas contínuas e taxa de disponibilidade dos microsserviços
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar rota ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 w-48 sm:w-56"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
            {(['all', 'healthy', 'warning'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'all' ? 'Todos' : st === 'healthy' ? 'Saudáveis' : 'Alerta'}
              </button>
            ))}
          </div>

          {/* Synthetic Probe Launch */}
          <button
            onClick={onOpenSyntheticProbe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Testar URL Externa
          </button>
        </div>
      </div>

      {/* Endpoints Table / Cards */}
      <div className="space-y-3">
        {filteredEndpoints.map((ep) => {
          const isPinging = pingingId === ep.id;

          const methodColor = 
            ep.method === 'GET' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
            ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
            ep.method === 'DELETE' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
            'bg-amber-500/10 text-amber-300 border-amber-500/20';

          return (
            <div
              key={ep.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all gap-4"
            >
              {/* Left: Endpoint Name & URL */}
              <div className="flex items-start sm:items-center gap-3">
                <div className={`status-beacon ${ep.status} mt-1.5 sm:mt-0`} />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white tracking-tight">
                      {ep.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-black/30 border border-white/5">
                      {ep.statusCode}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="text-slate-500 select-none">uri:</span>
                    <span className="text-indigo-300/90">{ep.url}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Latency & SLA bar */}
              <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                {/* Latency */}
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Latência TTFB</div>
                  <div className={`text-sm font-mono font-bold ${
                    ep.latencyMs > 300 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {ep.latencyMs}ms
                  </div>
                </div>

                {/* 90d Uptime History Ticks */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>SLA Uptime</span>
                    <span className="text-slate-200 font-bold">{ep.slaPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {ep.history.map((h, i) => (
                      <div
                        key={i}
                        title={`Check ${h.timestamp}: ${h.latencyMs}ms`}
                        className={`w-3.5 h-4 rounded-sm transition-all hover:scale-125 ${
                          h.status === 'healthy' ? 'bg-emerald-500/80 hover:bg-emerald-400' :
                          h.status === 'warning' ? 'bg-amber-500/80 hover:bg-amber-400' :
                          'bg-rose-500/80 hover:bg-rose-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Last checked */}
                <div className="hidden md:block">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Última Sondagem</div>
                  <div className="text-xs font-mono text-slate-300">{ep.lastChecked}</div>
                </div>

                {/* Action: Ping button */}
                <button
                  onClick={() => handlePing(ep.id)}
                  disabled={isPinging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.05] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-slate-200 hover:text-white transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pingando...' : 'Testar'}</span>
                </button>
              </div>

            </div>
          );
        })}

        {filteredEndpoints.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhum endpoint encontrado com o filtro aplicado.
          </div>
        )}
      </div>
    </div>
  );
};
