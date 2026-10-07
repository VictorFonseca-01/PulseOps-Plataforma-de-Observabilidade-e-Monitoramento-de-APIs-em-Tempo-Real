export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type EndpointStatus = 'healthy' | 'warning' | 'critical' | 'paused';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL';
export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface LatencyDataPoint {
  time: string;
  p50: number;
  p95: number;
  p99: number;
  rps: number;
}

export interface SystemMetrics {
  uptimePercent: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  throughputRps: number;
  activeSockets: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  redisCacheHitPercent: number;
  kafkaLagMessages: number;
}

export interface EndpointCheck {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  status: EndpointStatus;
  statusCode: number;
  latencyMs: number;
  slaPercent: number;
  lastChecked: string;
  history: {
    status: EndpointStatus;
    latencyMs: number;
    timestamp: string;
  }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  traceId: string;
  message: string;
  durationMs?: number;
  payload?: Record<string, unknown>;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
  description: string;
  rootCause: string;
  mitigation: string;
  impact: string;
}

export interface ServiceNode {
  id: string;
  name: string;
  category: 'gateway' | 'service' | 'database' | 'cache' | 'queue';
  status: 'healthy' | 'warning' | 'critical';
  latencyMs: number;
  throughput: string;
  errorRate: number;
  dependsOn: string[];
}
