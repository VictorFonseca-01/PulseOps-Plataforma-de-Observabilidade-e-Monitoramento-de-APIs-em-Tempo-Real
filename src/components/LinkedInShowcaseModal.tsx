import { useState, type FC } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Award
} from 'lucide-react';

interface LinkedInShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInShowcaseModal: FC<LinkedInShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'readme'>('linkedin');
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);

  if (!isOpen) return null;

  const linkedInText = `🚀 Apresento o DevPulse | Plataforma de Observabilidade Cloud & Telemetria em Tempo Real!

Construí este projeto focado em resolver um dos maiores desafios em sistemas distribuídos de alta escala: visibilidade completa de latência, saúde de contratos de API e gestão proativa de incidentes.

Principais capacidades de engenharia implementadas:
🔹 Telemetria Percentil (p50, p95, p99): Gráficos dinâmicos em SVG renderizando séries temporais com streaming contínuo.
🔹 Monitoramento de Endpoints & SLA: Acompanhamento de disponibilidade (99.9% target) e consumo do Error Budget.
🔹 Sonda Sintética Ativa: Mecanismo de health check com medição real de Time to First Byte (TTFB) e inspeção de payloads.
🔹 Console de Logs & Tracing Distribuído: Ingestão de logs com níveis de severidade, busca contextual e rastreamento por Trace ID.
🔹 Topologia de Serviços: Visualização da malha de microsserviços (Gateways, Bancos, Cache e Filas) com mapeamento de dependências.
🔹 Engenharia do Caos & Incidentes: Simulador de degradação P1/P2 com fluxo completo de triagem, mitigação e exportação de Post-Mortem.

🛠️ Stack Tecnológica:
- React + TypeScript (Strict Mode)
- Vite + Tailwind/Custom Design Tokens
- Visualização de Dados Reativa (SVG puro com 60 FPS)
- Arquitetura Modular & Clean Code

Confira o código-fonte completo no GitHub e teste a demonstração interativa:
👉 GitHub: [Seu link do repositório aqui]

Feedback de engenheiros de software, SREs e tech leads são super bem-vindos! 💬

#reactjs #typescript #observability #softwareengineering #sre #frontend #devops #webdevelopment #portfolio`;

  const readmeSnippet = `# ⚡ DevPulse — Cloud Observability & Telemetry Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Uma plataforma moderna e reativa para observabilidade de sistemas distribuídos, monitoramento de APIs, análise percentil de latência e gestão proativa de incidentes (SRE).

## 🚀 Funcionalidades

- **Métricas Globais de SLA:** Cálculo de uptime, disponibilidade e rastreamento de Error Budget.
- **Gráfico de Latência Percentil:** Curvas interativas de p50 (mediana), p95 e p99 em tempo real.
- **Sonda Sintética de HTTP:** Teste de endpoints com cálculo de TTFB (Time to First Byte).
- **Streaming de Logs com Trace IDs:** Terminal distribuído com filtros por severidade e payload inspect.
- **Malha de Serviços (Topology Map):** Mapeamento de dependências inter-serviços (Gateways, DB, Cache, Filas).
- **Chaos Engineering & Post-Mortems:** Simulação de incidentes P1 e geração automática de relatórios.

## 💻 Como Rodar Localmente

\`\`\`bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/devpulse-observability.git

# 2. Acesse a pasta
cd devpulse-observability

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
\`\`\`
`;

  const handleCopyLinkedIn = () => {
    navigator.clipboard.writeText(linkedInText);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 2000);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeSnippet);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content w-full max-w-3xl p-6 bg-[#0b0e1a]/95 border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kit de Destaque para LinkedIn & GitHub</h3>
              <p className="text-xs text-slate-400">
                Textos estruturados e badges prontas para você publicar e alavancar o seu perfil profissional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 mt-4 mb-3 border-b border-white/5 pb-2">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'linkedin'
                ? 'bg-[#0077b5]/20 text-[#38bdf8] border border-[#0077b5]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4 fill-[#0077b5]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.55a1.63 1.63 0 0 0-1.63 1.63 1.63 1.63 0 0 0 1.63 1.63 1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z" />
            </svg>
            Post Formatado para LinkedIn
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'readme'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4 fill-purple-400" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
            </svg>
            README.md para o Repositório Git
          </button>
        </div>

        {/* Content Tab 1: LinkedIn */}
        {activeTab === 'linkedin' && (
          <div className="space-y-3">
            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
              <Award className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>
                <strong>Dica de Ouro para o LinkedIn:</strong> Grave um vídeo curto (15 a 30s) ou GIF mostrando o gráfico de latência em tempo real e o botão de "Simular Caos (P1)" acionando alertas vermelhos. Isso multiplica as visualizações e engajamento dos recrutadores!
              </span>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={linkedInText}
                rows={12}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 font-sans focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={handleCopyLinkedIn}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                {copiedLinkedIn ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLinkedIn ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Tab 2: README */}
        {activeTab === 'readme' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                readOnly
                value={readmeSnippet}
                rows={12}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-cyan-300 font-mono focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={handleCopyReadme}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
              >
                {copiedReadme ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReadme ? 'Copiado!' : 'Copiar Markdown'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
