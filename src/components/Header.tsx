import type { FC } from 'react';
import { 
  Activity, 
  Radio, 
  Share2, 
  Flame, 
  Zap, 
  Globe, 
  Terminal, 
  Play,
  Pause
} from 'lucide-react';

interface HeaderProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onOpenSyntheticProbe: () => void;
  onOpenLinkedInModal: () => void;
  onTriggerChaosSim: () => void;
  activeIncidentsCount: number;
  activeTab: 'dashboard' | 'topology' | 'logs' | 'incidents';
  setActiveTab: (tab: 'dashboard' | 'topology' | 'logs' | 'incidents') => void;
}

export const Header: FC<HeaderProps> = ({
  isStreaming,
  onToggleStreaming,
  onOpenSyntheticProbe,
  onOpenLinkedInModal,
  onTriggerChaosSim,
  activeIncidentsCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b0d17] rounded-[11px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight font-['Syne'] text-white">
                  Pulse<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Ops</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v2.4 Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Observabilidade & Monitoramento de APIs em Tempo Real
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Painel Principal
            </button>
            <button
              onClick={() => setActiveTab('topology')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'topology'
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Topologia de Serviços
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Live Logs
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'incidents'
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Incidentes
              {activeIncidentsCount > 0 && (
                <span className="w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center">
                  {activeIncidentsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stream toggle */}
            <button
              onClick={onToggleStreaming}
              title={isStreaming ? 'Pausar fluxo de telemetria' : 'Retomar fluxo em tempo real'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isStreaming
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{isStreaming ? 'STREAM ATIVO' : 'PAUSADO'}</span>
              {isStreaming ? <Pause className="w-3 h-3 ml-1 opacity-70" /> : <Play className="w-3 h-3 ml-1 opacity-70" />}
            </button>

            {/* Synthetic Probe Button */}
            <button
              onClick={onOpenSyntheticProbe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Sonda Sintética</span>
            </button>

            {/* Chaos Simulation Button */}
            <button
              onClick={onTriggerChaosSim}
              title="Dispara um teste de caos simulando pico de latência e degradação"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Simular Caos (P1)
            </button>

            {/* LinkedIn / Git Portfolio Modal */}
            <button
              onClick={onOpenLinkedInModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>LinkedIn & Git</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
