import { useState, type FC } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert,
  Sliders,
  Terminal
} from 'lucide-react';
import type { Incident } from '../types/telemetry';

interface LayaAITriageViewProps {
  incidents: Incident[];
  onTriggerChaosSim: () => void;
  onMitigateIncident?: (id: string) => void;
}

interface IncidentPreset {
  id: string;
  name: string;
  severity: 'P1' | 'P2' | 'P3';
  service: string;
  stateText: string;
  mockResult: {
    intent: string;
    intentConfidence: number;
    isUrgent: boolean;
    urgencyConfidence: number;
    severityScore: number;
    severityLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
    frustrationProbabilities: { '0': number; '1': number; '2': number; '3': number };
    outageRisk: boolean;
    outageRiskConfidence: number;
    checkpoint: string;
    executionLatencyMs: number;
    recommendedMitigation: string;
    playbookCmd: string;
  };
}

const PRESETS: IncidentPreset[] = [
  {
    id: 'preset-gateway',
    name: 'P1: Cascading Timeout no Gateway Envoy',
    severity: 'P1',
    service: 'api-gateway',
    stateText: 'Envoy Gateway connection pool saturation. 12% requests failing with 504 Gateway Timeout. Threads at 1024/1024 capacity. Latency p99 jumped to 460ms.',
    mockResult: {
      intent: 'gateway_saturation_cascade',
      intentConfidence: 0.964,
      isUrgent: true,
      urgencyConfidence: 0.988,
      severityScore: 2.85,
      severityLevel: 'Crítico',
      frustrationProbabilities: { '0': 0.02, '1': 0.06, '2': 0.28, '3': 0.64 },
      outageRisk: true,
      outageRiskConfidence: 0.942,
      checkpoint: 'convaiinnovations/laya-rl-agent',
      executionLatencyMs: 31,
      recommendedMitigation: 'Ativar Circuit Breaker imediatamente. Escalar horizontalmente pods do Envoy de 8 para 24 réplicas via KEDA HPA.',
      playbookCmd: 'kubectl scale deployment/envoy-gateway --replicas=24 -n ingress',
    },
  },
  {
    id: 'preset-postgres',
    name: 'P2: Pool de Conexões PgBouncer Esgotado',
    severity: 'P2',
    service: 'postgres-primary',
    stateText: 'PgBouncer connection pool reached 98% utilization during batch invoice billing job. Queries stuck in idle-in-transaction holding exclusive row locks.',
    mockResult: {
      intent: 'database_connection_starvation',
      intentConfidence: 0.941,
      isUrgent: true,
      urgencyConfidence: 0.912,
      severityScore: 2.15,
      severityLevel: 'Alto',
      frustrationProbabilities: { '0': 0.05, '1': 0.21, '2': 0.62, '3': 0.12 },
      outageRisk: true,
      outageRiskConfidence: 0.865,
      checkpoint: 'convaiinnovations/laya-rl-agent',
      executionLatencyMs: 29,
      recommendedMitigation: 'Encerrar transações presas com pg_terminate_backend. Ajustar idle_in_transaction_session_timeout para 5000ms no pooler.',
      playbookCmd: "psql -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND state_change < now() - INTERVAL '30s';\"",
    },
  },
  {
    id: 'preset-pgvector',
    name: 'P3: Reconstrução Concorrente de Índice HNSW',
    severity: 'P3',
    service: 'vector-db',
    stateText: 'AI Vector Search latency p95 elevated to 382ms. Concurrent index rebuild detected on embeddings collection while read traffic spike occurred.',
    mockResult: {
      intent: 'vector_index_degradation',
      intentConfidence: 0.918,
      isUrgent: false,
      urgencyConfidence: 0.845,
      severityScore: 1.25,
      severityLevel: 'Moderado',
      frustrationProbabilities: { '0': 0.22, '1': 0.54, '2': 0.21, '3': 0.03 },
      outageRisk: false,
      outageRiskConfidence: 0.923,
      checkpoint: 'convaiinnovations/laya-rl-agent',
      executionLatencyMs: 33,
      recommendedMitigation: 'Rotear requisições de leitura de embeddings exclusivamente para nós réplica read-only. Adiar rebuild para janela de manutenção noturna.',
      playbookCmd: 'consul-template -template "haproxy-vector-readonly.tmpl:/etc/haproxy/haproxy.cfg" -reload-cmd "systemctl reload haproxy"',
    },
  },
  {
    id: 'preset-kafka',
    name: 'P2: Spike de Consumer Lag no Kafka Event Bus',
    severity: 'P2',
    service: 'kafka-consumer',
    stateText: 'Consumer group telemetry-events lag exceeded 45,000 messages on partitions 3 and 7. Heartbeat timeout caused partition rebalance storm.',
    mockResult: {
      intent: 'message_queue_rebalance_lag',
      intentConfidence: 0.932,
      isUrgent: true,
      urgencyConfidence: 0.895,
      severityScore: 2.05,
      severityLevel: 'Alto',
      frustrationProbabilities: { '0': 0.06, '1': 0.25, '2': 0.58, '3': 0.11 },
      outageRisk: true,
      outageRiskConfidence: 0.812,
      checkpoint: 'convaiinnovations/laya-rl-agent',
      executionLatencyMs: 34,
      recommendedMitigation: 'Aumentar max.poll.interval.ms de 300s para 600s. Adicionar 4 instâncias de consumer worker e reiniciar grupo de consumo ordenadamente.',
      playbookCmd: 'kubectl scale deployment/telemetry-consumer-worker --replicas=8 -n data-pipeline',
    },
  },
];

export const LayaAITriageView: FC<LayaAITriageViewProps> = ({ 
  onTriggerChaosSim, 
  onMitigateIncident 
}) => {
  const [selectedPreset, setSelectedPreset] = useState<IncidentPreset>(PRESETS[0]);
  const [customInput, setCustomInput] = useState<string>(PRESETS[0].stateText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(PRESETS[0].mockResult);

  const handleSelectPreset = (preset: IncidentPreset) => {
    setSelectedPreset(preset);
    setCustomInput(preset.stateText);
    setActiveAnalysis(preset.mockResult);
  };

  const handleRunTriage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Simulate sub-50ms inference with slight variations
      const isGateway = customInput.toLowerCase().includes('gateway') || customInput.toLowerCase().includes('envoy');
      const isDb = customInput.toLowerCase().includes('postgres') || customInput.toLowerCase().includes('pgbouncer') || customInput.toLowerCase().includes('database');
      
      let res = selectedPreset.mockResult;
      if (isGateway) {
        res = PRESETS[0].mockResult;
      } else if (isDb) {
        res = PRESETS[1].mockResult;
      }

      setActiveAnalysis({
        ...res,
        executionLatencyMs: Math.floor(28 + Math.random() * 8),
      });
      setIsAnalyzing(false);
    }, 450);
  };

  const handleCopyPlaybook = () => {
    navigator.clipboard.writeText(activeAnalysis.playbookCmd);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Apresentação da Arquitetura Laya MCP */}
      <div className="glass-panel p-6 border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-[#0d1020] to-cyan-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                Laya MCP Engine Integrado
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 rounded-md border border-cyan-500/20">
                Inference: ~31ms
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                Zero Alucinações (Typed Decisions)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-['Syne']">
              AIOps & Triagem Automatizada de Incidentes via MCP Laya
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Em arquiteturas críticas de SRE, LLMs generativos tradicionais são lentos (2 a 5 segundos) e propensos a alucinações. 
              O <strong>Laya MCP</strong> resolve a fadiga de alertas executando decisões tipadas de <strong>Sistema-1</strong> em menos de <strong>35ms</strong> locais, calculando calibragem probabilística de confiança, severidade e playbook de mitigação imediato.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={onTriggerChaosSim}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 hover:scale-[1.02] transition-all shadow-lg shadow-rose-500/10"
            >
              <Zap className="w-4 h-4 text-rose-400" />
              Injetar Caos P1 para Triar
            </button>
            <div className="text-[11px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5">
              <span>Tool:</span>
              <code className="text-purple-300 bg-black/40 px-1.5 py-0.5 rounded">mcp-laya:triage</code>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Selector & Input Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Cenários de Incidentes Pré-Configurados</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">4 presets</span>
            </div>

            <div className="space-y-2 mb-4">
              {PRESETS.map((p) => {
                const isSelected = selectedPreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                          p.severity === 'P1' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          p.severity === 'P2' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {p.severity}
                        </span>
                        <span className="font-bold truncate text-slate-100">{p.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{p.service}</p>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Custom Input State */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Payload de Telemetria / Estado do Alerta:</span>
                <span className="text-[10px] font-mono text-slate-500">state (string ou JSON)</span>
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={4}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 resize-none transition-all"
                placeholder="Insira mensagem de log, falha ou estado do cluster..."
              />

              <button
                onClick={handleRunTriage}
                disabled={isAnalyzing}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executando Forward Pass no Laya (~33ms)...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Disparar Triagem com Laya MCP
                  </>
                )}
              </button>
            </div>

          </div>

          {/* SRE Concept Card */}
          <div className="glass-panel p-4 text-xs space-y-2 bg-black/30 border-white/5">
            <span className="font-bold text-white flex items-center gap-1.5 font-['Syne']">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Por que Laya MCP em vez de ChatGPT/Claude?
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Em alta frequência de incidentes, o modelo precisa tomar decisões binárias e scores determinísticos sem gerar prosa. O Laya calcula probabilidades calibradas sem alucinar, ideal para pipelines de auto-remediação.
            </p>
          </div>

        </div>

        {/* Right Column: Laya Real-Time Decision Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Decision Output Card */}
          <div className="glass-panel p-5 laya-card-glow relative bg-[#0b0e1e]/90">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  <h3 className="text-base font-extrabold text-white font-['Syne']">
                    Resultado da Triagem Laya (Decisão Tipada)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Checkpoint: <span className="text-purple-300">{activeAnalysis.checkpoint}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  {activeAnalysis.executionLatencyMs}ms latência
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Calibrated
                </span>
              </div>
            </div>

            {/* Matrix of Core Decisions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              
              {/* Decision 1: Categoria & Intenção */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Categoria / Anomalia</span>
                  <span className="text-purple-400">Choice</span>
                </div>
                <div className="text-sm font-bold text-white font-mono truncate">
                  {activeAnalysis.intent}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400 text-[11px]">Confiança:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(activeAnalysis.intentConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Decision 2: Urgência SRE */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Urgência de SLA</span>
                  <span className="text-cyan-400">Noul Gate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    activeAnalysis.isUrgent 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {activeAnalysis.isUrgent ? 'URGENTE (CRITICAL)' : 'NÃO URGENTE'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400 text-[11px]">Confiança:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(activeAnalysis.urgencyConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Decision 3: Score de Severidade */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Severidade (Score 0-3)</span>
                  <span className="text-amber-400">Regression</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-extrabold text-white font-['Syne']">
                    {activeAnalysis.severityScore.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-mono text-amber-300">
                    / 3.0 ({activeAnalysis.severityLevel})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400 text-[11px]">Risco Outage:</span>
                  <span className="font-mono text-rose-400 font-bold">
                    {(activeAnalysis.outageRiskConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

            </div>

            {/* Probability Distribution Spectrum */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Distribuição Probabilística de Severidade (0 a 3)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Laya Softmax Calibration</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-slate-400 text-[10px]">Nível 0 (Normal)</div>
                  <div className="font-bold text-slate-200 mt-0.5">
                    {(activeAnalysis.frustrationProbabilities['0'] * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-slate-400 text-[10px]">Nível 1 (Atenção)</div>
                  <div className="font-bold text-slate-200 mt-0.5">
                    {(activeAnalysis.frustrationProbabilities['1'] * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-amber-400 text-[10px]">Nível 2 (Degradado)</div>
                  <div className="font-bold text-amber-300 mt-0.5">
                    {(activeAnalysis.frustrationProbabilities['2'] * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div className="text-rose-400 text-[10px]">Nível 3 (Outage P1)</div>
                  <div className="font-bold text-rose-300 mt-0.5">
                    {(activeAnalysis.frustrationProbabilities['3'] * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Automated Mitigation Playbook */}
            <div className="bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Plano de Mitigação Automatizado Sugerido
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Auto-Remediation Ready
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {activeAnalysis.recommendedMitigation}
              </p>

              <div className="bg-black/60 rounded-lg p-2.5 border border-white/10 flex items-center justify-between gap-3">
                <code className="text-[11px] font-mono text-cyan-300 truncate">
                  {activeAnalysis.playbookCmd}
                </code>
                <button
                  onClick={handleCopyPlaybook}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold transition-all shrink-0"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode ? 'Copiado' : 'Copiar Comando'}
                </button>
              </div>

              {onMitigateIncident && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onMitigateIncident(selectedPreset.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Aplicar Mitigação no Cluster
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Audit Log / JSON Spec Preview */}
          <div className="glass-panel p-4 bg-black/40 border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Audit Log do MCP Server (mcp-laya)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Fast Inference Local</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 bg-black/60 p-3 rounded-lg overflow-x-auto border border-white/5">
{`{
  "audit": "laya-mcp",
  "tool": "triage:triage",
  "model": "convaiinnovations/laya-rl-agent",
  "latency_ms": ${activeAnalysis.executionLatencyMs},
  "answers": {
    "intent": { "choice": "${activeAnalysis.intent}", "confidence": ${activeAnalysis.intentConfidence} },
    "is_urgent": { "noul": ${activeAnalysis.isUrgent ? 1.0 : 0.0}, "confidence": ${activeAnalysis.urgencyConfidence} },
    "severity_score": { "score": ${activeAnalysis.severityScore}, "confidence": ${activeAnalysis.outageRiskConfidence} },
    "outage_risk": { "noul": ${activeAnalysis.outageRisk ? 1.0 : 0.0}, "confidence": ${activeAnalysis.outageRiskConfidence} }
  }
}`}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
