import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { OverviewMetrics } from './components/OverviewMetrics';
import { LatencyChart } from './components/LatencyChart';
import { EndpointsMonitor } from './components/EndpointsMonitor';
import { LiveLogStream } from './components/LiveLogStream';
import { ServiceTopology } from './components/ServiceTopology';
import { IncidentAlerts } from './components/IncidentAlerts';
import { SyntheticProbeModal } from './components/SyntheticProbeModal';
import { LinkedInShowcaseModal } from './components/LinkedInShowcaseModal';
import { SystemHealthBanner } from './components/SystemHealthBanner';

import { 
  initialSystemMetrics, 
  initialEndpoints, 
  initialLogs, 
  initialIncidents, 
  serviceTopologyData, 
  generateInitialHistory 
} from './data/mockData';

import type { 
  EndpointCheck, 
  Incident, 
  IncidentStatus, 
  LatencyDataPoint, 
  LogEntry, 
  ServiceNode, 
  SystemMetrics 
} from './types/telemetry';

export function App() {
  const [metrics, setMetrics] = useState<SystemMetrics>(initialSystemMetrics);
  const [latencyHistory, setLatencyHistory] = useState<LatencyDataPoint[]>(generateInitialHistory);
  const [endpoints, setEndpoints] = useState<EndpointCheck[]>(initialEndpoints);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [nodes, setNodes] = useState<ServiceNode[]>(serviceTopologyData);

  const [isStreaming, setIsStreaming] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'topology' | 'logs' | 'incidents'>('dashboard');
  const [isSyntheticProbeOpen, setIsSyntheticProbeOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Active unmitigated incidents count
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  // Real-time telemetry tick simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // 1. Add new latency point
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const p50Jitter = Math.floor(28 + Math.random() * 8);
      const p95Jitter = Math.floor(70 + Math.random() * 25);
      const p99Jitter = Math.floor(130 + Math.random() * 30);
      const rpsJitter = Math.floor(18000 + Math.random() * 1500);

      setLatencyHistory((prev) => [
        ...prev.slice(1),
        { time: timeStr, p50: p50Jitter, p95: p95Jitter, p99: p99Jitter, rps: rpsJitter },
      ]);

      // 2. Fluctuate KPI metrics slightly
      setMetrics((prev) => ({
        ...prev,
        avgLatencyMs: Number((36 + Math.random() * 4).toFixed(1)),
        throughputRps: Math.floor(18000 + (Math.random() - 0.5) * 800),
        cpuUsagePercent: Number((42 + Math.random() * 5).toFixed(1)),
        memoryUsagePercent: Number((60 + Math.random() * 3).toFixed(1)),
      }));

      // 3. Emit realistic microservice logs
      const sampleEvents = [
        {
          service: 'api-gateway',
          level: 'INFO' as const,
          message: `HTTP/2 200 OK [GET /api/v1/inventory/items/sku-lookup] - ${Math.floor(20 + Math.random() * 20)}ms`,
          payload: { route: '/inventory/items/sku-lookup', status: 200, datacenter: 'sa-east-1a' },
        },
        {
          service: 'redis-cache',
          level: 'DEBUG' as const,
          message: `SETEX session:tk_${Math.random().toString(36).substring(7)} 7200s [OK]`,
          payload: { key_prefix: 'session', ttl: 7200 },
        },
        {
          service: 'auth-service',
          level: 'INFO' as const,
          message: `JWT signature validated via RS256 key_id=prod-auth-2026-v1`,
          payload: { iss: 'devpulse.auth.internal', scope: ['read', 'write'] },
        },
        {
          service: 'kafka-consumer',
          level: 'INFO' as const,
          message: `Batch consumed 128 events on partition #${Math.floor(Math.random() * 8)}`,
          payload: { topic: 'events.telemetry.v1', batch_size: 128 },
        },
      ];

      const chosenEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newLog: LogEntry = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
        level: chosenEvent.level,
        service: chosenEvent.service,
        traceId: `tr_${Math.random().toString(36).substring(2, 11)}`,
        message: chosenEvent.message,
        durationMs: Math.floor(12 + Math.random() * 30),
        payload: chosenEvent.payload,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Ping an endpoint manually
  const handlePingEndpoint = useCallback((id: string) => {
    setEndpoints((prev) =>
      prev.map((ep) => {
        if (ep.id !== id) return ep;
        const newLatency = Math.floor(18 + Math.random() * 35);
        return {
          ...ep,
          latencyMs: newLatency,
          lastChecked: 'Agora',
          history: [
            ...ep.history.slice(1),
            { status: 'healthy', latencyMs: newLatency, timestamp: 'Agora' },
          ],
        };
      })
    );
  }, []);

  // Update incident status (ACK / Resolve)
  const handleUpdateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        return {
          ...inc,
          status,
          resolvedAt: status === 'resolved' ? 'Resolvido agora mesmo' : inc.resolvedAt,
        };
      })
    );
  }, []);

  // Trigger Chaos Engineering Incident (P1)
  const handleTriggerChaosSim = useCallback(() => {
    const chaosIncident: Incident = {
      id: `INC-2026-${Math.floor(10 + Math.random() * 90)}`,
      title: 'Spike de Conexões & Degradação no Gateway Envoy',
      severity: 'P1',
      status: 'investigating',
      startedAt: 'Agora (Injetado via Chaos)',
      affectedServices: ['api-gateway', 'auth-service', 'billing-service'],
      description: 'Injeção de falha sintética: saturação de thread pool no Envoy com 12% de timeout 504 Gateway Timeout.',
      rootCause: 'Simulação acionada pelo usuário: saturação de backpressure e esgotamento de buffers TCP.',
      mitigation: 'Escalar automaticamente réplicas HPA do Gateway para 24 pods e habilitar circuit-breaker.',
      impact: 'Latência p99 subiu momentaneamente para 460ms. Erros 504 simulados.',
    };

    setIncidents((prev) => [chaosIncident, ...prev]);

    // Degrade metrics momentarily
    setMetrics((prev) => ({
      ...prev,
      p99LatencyMs: 460.0,
      errorRatePercent: 3.82,
      cpuUsagePercent: 88.5,
    }));

    // Add critical log
    const criticalLog: LogEntry = {
      id: `log-chaos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
      level: 'CRITICAL',
      service: 'api-gateway',
      traceId: `tr_chaos_${Math.random().toString(36).substring(2, 8)}`,
      message: 'EMERGENCY: Upstream connection timeout 504 Gateway Timeout on 342 active requests',
      durationMs: 480,
      payload: { circuit_breaker: 'OPEN', active_threads: 1024, max_threads: 1024 },
    };
    setLogs((prev) => [criticalLog, ...prev]);

    // Update node status
    setNodes((prev) =>
      prev.map((n) =>
        n.id === 'node-gateway' ? { ...n, status: 'critical', latencyMs: 340 } : n
      )
    );
  }, []);

  // Quick mitigate top active incident
  const handleQuickMitigate = useCallback(() => {
    if (activeIncidents.length === 0) return;
    const topId = activeIncidents[0].id;
    handleUpdateIncidentStatus(topId, 'resolved');

    // Restore metrics
    setMetrics(initialSystemMetrics);
    setNodes(serviceTopologyData);
  }, [activeIncidents, handleUpdateIncidentStatus]);

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Top Navigation & Controls */}
      <Header
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        onOpenSyntheticProbe={() => setIsSyntheticProbeOpen(true)}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
        onTriggerChaosSim={handleTriggerChaosSim}
        activeIncidentsCount={activeIncidents.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* System Health / Alert Banner */}
        <SystemHealthBanner
          activeIncidents={activeIncidents}
          onViewIncidents={() => setActiveTab('incidents')}
          onQuickMitigate={handleQuickMitigate}
        />

        {/* Global Overview Metrics (Always visible or in dashboard) */}
        <OverviewMetrics metrics={metrics} />

        {/* Dynamic Views depending on Active Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Real-time Latency Chart */}
            <LatencyChart data={latencyHistory} />

            {/* Endpoints & SLA Monitor */}
            <EndpointsMonitor
              endpoints={endpoints}
              onPingEndpoint={handlePingEndpoint}
              onOpenSyntheticProbe={() => setIsSyntheticProbeOpen(true)}
            />

            {/* Live Streaming Logs Preview */}
            <LiveLogStream
              logs={logs}
              onClearLogs={() => setLogs([])}
              isStreaming={isStreaming}
            />
          </div>
        )}

        {activeTab === 'topology' && (
          <ServiceTopology nodes={nodes} />
        )}

        {activeTab === 'logs' && (
          <LiveLogStream
            logs={logs}
            onClearLogs={() => setLogs([])}
            isStreaming={isStreaming}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentAlerts
            incidents={incidents}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onTriggerChaosSim={handleTriggerChaosSim}
          />
        )}

      </main>

      {/* Footer / Portfolio Info */}
      <footer className="border-t border-white/5 bg-[#030408] py-6 px-4 text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-['Syne']">PulseOps Platform</span>
            <span>•</span>
            <span>Desenvolvido para portfólio profissional (GitHub & LinkedIn)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React 19 + TypeScript</span>
            <span>•</span>
            <span>Arquitetura de Baixa Latência</span>
            <span>•</span>
            <button
              onClick={() => setIsLinkedInModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
            >
              Kit de Compartilhamento
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SyntheticProbeModal
        isOpen={isSyntheticProbeOpen}
        onClose={() => setIsSyntheticProbeOpen(false)}
      />

      <LinkedInShowcaseModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />

    </div>
  );
}

export default App;
