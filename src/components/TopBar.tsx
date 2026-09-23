import { Activity, Play, Square, Radio } from 'lucide-react';
import type { SimState } from '@/lib/simulation';

interface TopBarProps {
  lastUpdated: string | null;
  simState: SimState;
  loading: boolean;
  onAnalyze: () => void;
  onSimulate: () => void;
  onStopSim: () => void;
}

export function TopBar({ lastUpdated, simState, loading, onAnalyze, onSimulate, onStopSim }: TopBarProps) {
  const simStepLabels = ['Normal', 'Increasing Rainfall', 'Heavy Rainfall', 'High Flood Risk', 'Very High Risk'];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {simState.active ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30">
              <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs font-semibold text-orange-300">
                SIMULATION — {simStepLabels[simState.step] ?? 'Running'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
              <Radio className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-green-300">LIVE — Open-Meteo</span>
            </div>
          )}
          {lastUpdated && (
            <span className="text-xs text-slate-500 hidden sm:inline">
              Updated: {new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {simState.active ? (
            <button
              onClick={onStopSim}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
            >
              <Square className="w-4 h-4" />
              Stop Simulation
            </button>
          ) : (
            <button
              onClick={onSimulate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 text-sm font-medium transition-colors border border-orange-500/30 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Simulation Mode</span>
              <span className="sm:hidden">Sim</span>
            </button>
          )}
          <button
            onClick={onAnalyze}
            disabled={loading || simState.active}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Activity className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Analyse Coimbatore'}
          </button>
        </div>
      </div>
    </div>
  );
}
