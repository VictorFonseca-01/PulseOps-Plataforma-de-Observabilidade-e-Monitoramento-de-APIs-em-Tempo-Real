import { useState, type FC } from 'react';
import type { ServiceNode } from '../types/telemetry';
import { 
  Globe, 
  Database, 
  Cpu, 
  Layers, 
  Zap, 
  ArrowRight
} from 'lucide-react';

interface ServiceTopologyProps {
  nodes: ServiceNode[];
}

export const ServiceTopology: FC<ServiceTopologyProps> = ({ nodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-gateway');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getNodeIcon = (category: ServiceNode['category']) => {
    switch (category) {
      case 'gateway':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'cache':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'queue':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      default:
        return <Cpu className="w-4 h-4 text-indigo-300" />;
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Topologia da Arquitetura & Malha de Microsserviços</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mapeamento de dependências e comunicação distribuída inter-serviços
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 9 Saudáveis
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 1 Atenção (PGVector)
          </span>
        </div>
      </div>

      {/* Visual Mesh Architecture Flow (SVG) */}
      <div className="mb-6 bg-black/50 border border-white/10 rounded-2xl p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-2">
            <span>EDGE LAYER</span>
            <span>INGRESS / GATEWAY</span>
            <span>CORE SERVICES</span>
            <span>DATA & CACHE</span>
          </div>

          <svg viewBox="0 0 800 120" className="w-full h-24 select-none">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting paths with animated dash offset */}
            <path d="M 100 60 L 260 60" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" opacity="0.6" />
            <path d="M 320 60 L 460 30" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            <path d="M 320 60 L 460 50" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            <path d="M 320 60 L 460 70" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            <path d="M 320 60 L 460 90" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

            <path d="M 520 30 L 680 40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            <path d="M 520 50 L 680 80" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            <path d="M 520 70 L 680 100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            <path d="M 520 90 L 680 40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

            {/* Nodes */}
            {/* Edge */}
            <g transform="translate(60, 42)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-edge')}>
              <rect width="80" height="36" rx="8" fill="#0b1120" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="40" y="22" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Edge CDN</text>
            </g>

            {/* Gateway */}
            <g transform="translate(250, 42)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-gateway')}>
              <rect width="90" height="36" rx="8" fill="#111827" stroke="#6366f1" strokeWidth="2" filter="url(#neonGlow)" />
              <text x="45" y="22" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Envoy GW</text>
            </g>

            {/* Services cluster */}
            <g transform="translate(450, 15)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-auth')}>
              <rect width="80" height="24" rx="6" fill="#0f172a" stroke="#818cf8" strokeWidth="1" />
              <text x="40" y="16" fill="#cbd5e1" fontSize="9" textAnchor="middle">Auth Svc</text>
            </g>
            <g transform="translate(450, 43)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-billing')}>
              <rect width="80" height="24" rx="6" fill="#0f172a" stroke="#818cf8" strokeWidth="1" />
              <text x="40" y="16" fill="#cbd5e1" fontSize="9" textAnchor="middle">Billing</text>
            </g>
            <g transform="translate(450, 71)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-ai')}>
              <rect width="80" height="24" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="40" y="16" fill="#fcd34d" fontSize="9" textAnchor="middle">AI Engine</text>
            </g>

            {/* Data Layer */}
            <g transform="translate(660, 25)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-redis')}>
              <rect width="80" height="24" rx="6" fill="#0b1329" stroke="#10b981" strokeWidth="1" />
              <text x="40" y="16" fill="#a7f3d0" fontSize="9" textAnchor="middle">Redis Cache</text>
            </g>
            <g transform="translate(660, 55)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-postgres')}>
              <rect width="80" height="24" rx="6" fill="#0b1329" stroke="#10b981" strokeWidth="1" />
              <text x="40" y="16" fill="#a7f3d0" fontSize="9" textAnchor="middle">Postgres HA</text>
            </g>
            <g transform="translate(660, 85)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-kafka')}>
              <rect width="80" height="24" rx="6" fill="#0b1329" stroke="#a855f7" strokeWidth="1" />
              <text x="40" y="16" fill="#e9d5ff" fontSize="9" textAnchor="middle">Kafka Bus</text>
            </g>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Service Mesh Grid */}
        <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border relative ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                        {getNodeIcon(node.category)}
                      </div>
                      <span className="font-bold text-xs text-white truncate max-w-[120px]">
                        {node.name}
                      </span>
                    </div>

                    <span className={`status-beacon ${node.status}`} />
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Latência:</span>
                      <span className={`font-semibold ${node.latencyMs > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {node.latencyMs}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vazão:</span>
                      <span className="text-slate-300 font-semibold">{node.throughput}</span>
                    </div>
                  </div>

                  {node.dependsOn.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <span>Dep: {node.dependsOn.length} nós a jusante</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Node Deep-Dive Inspection */}
        {selectedNode && (
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    {getNodeIcon(selectedNode.category)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedNode.name}</h4>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-300">
                      Categoria: {selectedNode.category}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  selectedNode.status === 'healthy' 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              {/* Node Metrics Details */}
              <div className="space-y-3 mb-4">
                <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latência de Execução:</span>
                    <span className="text-white font-bold">{selectedNode.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa de Throughput:</span>
                    <span className="text-cyan-300 font-bold">{selectedNode.throughput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa de Erro 5xx:</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.errorRate}%</span>
                  </div>
                </div>

                {/* Downstream dependencies */}
                <div>
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Conexões a Jusante (Dependencies):
                  </h5>
                  {selectedNode.dependsOn.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedNode.dependsOn.map((depId) => {
                        const targetNode = nodes.find((n) => n.id === depId);
                        return (
                          <div
                            key={depId}
                            onClick={() => setSelectedNodeId(depId)}
                            className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5 hover:border-indigo-500/40 text-xs font-mono text-slate-300 cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-indigo-400" />
                              {targetNode?.name || depId}
                            </span>
                            <span className="text-slate-400">{targetNode?.latencyMs}ms</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-mono italic p-2 bg-black/20 rounded">
                      Nó terminal (sem dependências externas)
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span>Protocolo: </span>
              <span className="font-mono text-slate-200 font-medium">gRPC / HTTP 2.0 com mTLS</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
