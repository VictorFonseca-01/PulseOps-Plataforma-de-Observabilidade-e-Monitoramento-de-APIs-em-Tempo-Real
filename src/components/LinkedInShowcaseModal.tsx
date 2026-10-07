import { useState, type FC } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Award,
  Video,
  HelpCircle,
  FileText,
  Share2
} from 'lucide-react';

interface LinkedInShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInShowcaseModal: FC<LinkedInShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'interview' | 'video' | 'readme'>('linkedin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const linkedInPostText = `🚀 Apresento o PulseOps — Plataforma de Observabilidade e AIOps em Tempo Real para Sistemas Distribuídos!

Em ambientes distribuídos de alta escala, o maior pesadelo de engenharia não é a queda do sistema — é a degradação silenciosa (cauda longa de latência) e a fadiga de alertas que atrasa o MTTR (Mean Time to Resolution).

Para demonstrar na prática soluções modernas de Observabilidade e SRE, construí o PulseOps: uma plataforma completa de monitoramento e triagem proativa.

Principais pilares técnicos implementados:
⚡ Telemetria Percentil (p50, p95, p99): Streaming contínuo a 60 FPS com renderização matemática em curvas SVG puras, isolando a cauda de latência que as médias tradicionais mascaram.
🛡️ Monitoramento de Contratos de SLA & Error Budget: Rastreamento dinâmico de disponibilidade de 99.9% e consumo do orçamento de erro em tempo real.
🤖 AIOps & Triagem Inteligente via Laya MCP (Model Context Protocol): Sistema de decisão de Sistema-1 (~31ms) que classifica anomalias sem alucinações, com score calibrado de severidade e playbooks de mitigação instantâneos.
🌐 Topologia & Malha de Microsserviços: Mapeamento de dependências upstream/downstream (Cloudflare Edge -> Envoy Gateway -> Services -> PostgreSQL / Redis / Kafka).
📜 Live Logs & Distributed Tracing: Ingestão de telemetria com correlação por Trace ID e inspeção de payloads estruturados.
🔥 Engenharia do Caos & Incident Response: Simulador de cascata de falhas (P1 Envoy Gateway 504) com exportação instantânea de relatório de Post-Mortem.

🛠️ Stack:
• Frontend: React 19 + TypeScript (Strict Mode) + Vite
• Arquitetura: Clean Component Hierarchy, Custom Design System Tokens, Cyber Glassmorphism
• AIOps / MCP: Integração com Laya Decision Engine (Typed Decisions locais de sub-35ms)
• Data Viz: SVG reativo de alta precisão

Confira o código-fonte e teste a demonstração interativa:
👉 GitHub: https://github.com/VictorFonseca-01/PulseOps-Plataforma-de-Observabilidade-e-Monitoramento-de-APIs-em-Tempo-Real

O que achou da arquitetura? Feedback de Engenheiros de Software, Tech Leads e SREs é muito bem-vindo! 💬

#SoftwareEngineering #SRE #Observability #React #TypeScript #DevOps #SystemDesign #MCP #WebDevelopment #Portfolio`;

  const interviewTalkingPoints = `🎯 GUIA DE ENTREVISTA TÉCNICA — COMO VENDER ESSE PROJETO:

1. PITCH DE ELEVADOR (30 segundos):
"O PulseOps é uma plataforma de observabilidade e AIOps em tempo real voltada para microsserviços. Ele resolve dois problemas clássicos de SRE: a cauda longa de latência que as médias mascaram, monitorando percentis p50, p95 e p99, e a fadiga de alertas, utilizando o Laya MCP para realizar triagem de incidentes em ~31ms com decisões tipadas sem alucinações."

2. POR QUE USAR PERCENTIS (p95/p99) EM VEZ DE LATÊNCIA MÉDIA?
"Em 100 mil requisições, se 99 mil demoram 20ms e 1 mil demoram 10 segundos, a média diz 120ms (parece aceitável), mas 1% dos clientes premium estão tendo uma experiência péssima de 10s. O p99 captura exatamente essa cauda longa de lentidão."

3. O QUE É O ERROR BUDGET E O SLA DE 99.9%?
"Um SLA de 99.9% (três noves) permite apenas 43.8 minutos de indisponibilidade por mês. O Error Budget é o saldo restante desse tempo. Se o budget está esgotando rápido, o time congela novos deploys e foca 100% em confiabilidade."

4. COMO O MCP DA LAYA ENTRA NA ARQUITETURA?
"Modelos generativos tradicionais demoram 2 a 5 segundos e geram texto livre propenso a alucinar. O Laya MCP funciona como um motor de Sistema-1: executa em ~31ms locais, responde com formato estritamente tipado (choice, score de severidade, flag de urgência) e fornece um score de confiança probabilístico calibrado para acionar auto-scaling e circuit breakers com segurança."`;

  const videoScript = `🎬 ROTEIRO DE VÍDEO DEMONSTRATIVO PARA O LINKEDIN (DURAÇÃO: 30 SEGUNDOS):

[00:00 - 00:08] ABERTURA & DASHBOARD
• Ação: Abra o dashboard do PulseOps com o Live Streaming ativo.
• Narração/Legenda: "Construí o PulseOps: plataforma de observabilidade em tempo real com streaming de telemetria de latência p50, p95 e p99."

[00:08 - 00:16] INJEÇÃO DE CAOS (O MOMENTO 'WOW')
• Ação: Clique no botão "Injetar Simulação de Incidente (Chaos Engineering)".
• Efeito: As métricas de p99 sobem para 460ms, o banner vermelho de alerta pulsa e logs críticos aparecem instantaneamente.
• Narração/Legenda: "Simulando uma falha P1 no Gateway Envoy com saturação de thread pool..."

[00:16 - 00:24] TRIAGEM INTELIGENTE COM LAYA MCP
• Ação: Vá na aba "IA Triagem (Laya)" e clique em "Disparar Triagem com Laya MCP".
• Efeito: Mostra o Laya resolvendo a anomalia em 31ms, diagnosticando a causa raiz e gerando o comando de auto-remediação.
• Narração/Legenda: "AIOps via Laya MCP: triagem determinística em sub-35ms sem alucinações."

[00:24 - 00:30] TOPOLOGIA & ENCERRAMENTO
• Ação: Passe rápido pela aba "Topologia de Serviços" mostrando a malha de microsserviços.
• Narração/Legenda: "Código 100% aberto no GitHub com React 19 e TypeScript! Link nos comentários."`;

  const readmeMarkdown = `# ⚡ PulseOps — Plataforma de Observabilidade e AIOps em Tempo Real

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MCP](https://img.shields.io/badge/MCP-Laya_Engine-8B5CF6)](https://modelcontextprotocol.io/)
[![Status](https://img.shields.io/badge/Status-Production--Ready-emerald)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Plataforma enterprise de alta performance para observabilidade de microsserviços, telemetria percentil de latência (p50, p95, p99), monitoramento de SLA e triagem preditiva de incidentes (AIOps) com **Laya MCP**.

---

## 🎯 Capacidades de Engenharia

1. **📊 Telemetria Percentil em SVG puro:** Curvas de latência em tempo real a 60 FPS (p50, p95, p99) para isolamento da cauda longa.
2. **🤖 AIOps & Triagem Determinística (Laya MCP):** Tomada de decisão em ~31ms locais sem alucinações com cálculo de confiança calibrada.
3. **🛡️ Gestão de SLA & Error Budget:** Acompanhamento de metas de 99.9% de uptime e cálculo de burn rate do orçamento de erro.
4. **🌐 Malha de Topologia de Serviços:** Mapeamento visual das dependências entre Cloudflare Edge, Gateways Envoy, Microsserviços e Bancos de Dados.
5. **📜 Live Distributed Log Streaming:** Logs correlacionados por Trace ID com inspeção detalhada de payloads JSON.
6. **🔥 Chaos Engineering:** Simulador integrado de cascata de falhas P1 com geração automática de Post-Mortem em Markdown.

---

## 🚀 Como Executar Localmente

\`\`\`bash
# 1. Clone o repositório
git clone https://github.com/VictorFonseca-01/PulseOps-Plataforma-de-Observabilidade-e-Monitoramento-de-APIs-em-Tempo-Real.git

# 2. Acesse a pasta
cd PulseOps-Plataforma-de-Observabilidade-e-Monitoramento-de-APIs-em-Tempo-Real

# 3. Instale as dependências
npm install

# 4. Inicie o servidor
npm run dev
\`\`\`

Acesse no navegador: \`http://localhost:5173\`
`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content w-full max-w-4xl p-6 bg-[#0b0e1a]/95 border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Syne']">
                Kit de Destaque Profissional (LinkedIn & Entrevistas)
              </h3>
              <p className="text-xs text-slate-400">
                Textos validados, scripts de vídeo e cheatsheet técnico para alavancar seu perfil para Tech Leads e Recrutadores
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
        <div className="flex flex-wrap items-center gap-2 mt-4 mb-4 border-b border-white/5 pb-2">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'linkedin'
                ? 'bg-[#0077b5]/20 text-[#38bdf8] border border-[#0077b5]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#0077b5]" />
            Post Formatado para LinkedIn
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'interview'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            Perguntas & Respostas de Entrevista
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            Roteiro de Vídeo (30s)
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'readme'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            README.md com Laya MCP
          </button>
        </div>

        {/* Tab 1: LinkedIn Post */}
        {activeTab === 'linkedin' && (
          <div className="space-y-3">
            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
              <Award className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>
                <strong>Por que este post funciona:</strong> Ele foca na dor real dos líderes de engenharia (degradação oculta de latência e fadiga de alertas), lista conceitos sênior (p99, Error Budget, Chaos Engineering, Laya MCP) e convida para a interação.
              </span>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={linkedInPostText}
                rows={13}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 font-sans focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={() => handleCopy(linkedInPostText, 'linkedin')}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'linkedin' ? 'Copiado!' : 'Copiar Texto do Post'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interview Prep */}
        {activeTab === 'interview' && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
              💡 <strong>Como usar na entrevista:</strong> Quando o recrutador ou tech lead perguntar: <em>"Fale sobre um projeto técnico desafiador que você desenvolveu"</em>, use os pontos abaixo.
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={interviewTalkingPoints}
                rows={13}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 font-sans focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={() => handleCopy(interviewTalkingPoints, 'interview')}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                {copiedKey === 'interview' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'interview' ? 'Copiado!' : 'Copiar Roteiro'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Video Script */}
        {activeTab === 'video' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 text-xs text-amber-300">
              🎥 <strong>Dica de Produção:</strong> Use ferramentas gratuitas como o <em>OBS Studio</em>, <em>Loom</em> ou até o gravador de tela do Windows (Win+Alt+R). Posts no LinkedIn com vídeo curto têm até <strong>5x mais impressões</strong> do que apenas texto!
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={videoScript}
                rows={13}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 font-sans focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={() => handleCopy(videoScript, 'video')}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30"
              >
                {copiedKey === 'video' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'video' ? 'Copiado!' : 'Copiar Roteiro de Vídeo'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: README */}
        {activeTab === 'readme' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                readOnly
                value={readmeMarkdown}
                rows={13}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-cyan-300 font-mono focus:outline-none resize-none leading-relaxed"
              />
              <button
                onClick={() => handleCopy(readmeMarkdown, 'readme')}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
              >
                {copiedKey === 'readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'readme' ? 'Copiado!' : 'Copiar README.md'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
