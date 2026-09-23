import { Thermometer, Droplets, Wind, AlertTriangle, Grid3x3, TrendingUp, Clock, Zap } from 'lucide-react';
import type { GridData, Alert } from '@/types';
import { RISK_COLORS, weatherCodeToString } from '@/lib/riskEngine';

interface DashboardProps {
  grids: GridData[];
  alerts: Alert[];
  lastUpdated: string | null;
  loading: boolean;
  onGridClick: (grid: GridData) => void;
}

export function Dashboard({ grids, alerts, lastUpdated, loading, onGridClick }: DashboardProps) {
  const loaded = grids.filter((g) => g.weather && !g.error);
  const lowCount = loaded.filter((g) => g.riskLevel === 'LOW').length;
  const modCount = loaded.filter((g) => g.riskLevel === 'MODERATE').length;
  const highCount = loaded.filter((g) => g.riskLevel === 'HIGH').length;
  const veryHighCount = loaded.filter((g) => g.riskLevel === 'VERY HIGH').length;

  const highestGrid = loaded.length > 0
    ? loaded.reduce((max, g) => (g.riskScore > max.riskScore ? g : max))
    : null;

  const avgTemp = loaded.length > 0
    ? loaded.reduce((s, g) => s + (g.weather?.temperature ?? 0), 0) / loaded.length
    : 0;

  const totalRain = loaded.reduce((s, g) => s + (g.weather?.precipitation ?? 0), 0);
  const maxWind = loaded.length > 0
    ? loaded.reduce((max, g) => Math.max(max, g.weather?.windSpeed ?? 0), 0)
    : 0;

  const overallRisk = loaded.length > 0
    ? Math.round(loaded.reduce((s, g) => s + g.riskScore, 0) / loaded.length)
    : 0;
  const overallLevel = overallRisk <= 25 ? 'LOW' : overallRisk <= 50 ? 'MODERATE' : overallRisk <= 75 ? 'HIGH' : 'VERY HIGH';

  const stats = [
    { label: 'Total Grids', value: '25', icon: Grid3x3, color: 'text-cyan-400' },
    { label: 'Low Risk', value: lowCount, icon: Grid3x3, color: 'text-green-400' },
    { label: 'Moderate Risk', value: modCount, icon: Grid3x3, color: 'text-yellow-400' },
    { label: 'High Risk', value: highCount, icon: Grid3x3, color: 'text-orange-400' },
    { label: 'Very High Risk', value: veryHighCount, icon: Grid3x3, color: 'text-red-400' },
    { label: 'Active Alerts', value: alerts.length, icon: AlertTriangle, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Overall risk banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Coimbatore Overall Risk</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold" style={{ color: RISK_COLORS[overallLevel] }}>{overallRisk}</span>
              <span className="text-lg font-semibold" style={{ color: RISK_COLORS[overallLevel] }}>{overallLevel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            {lastUpdated ? new Date(lastUpdated).toLocaleString('en-IN') : 'Not yet analyzed'}
          </div>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Weather summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex items-center gap-3">
          <Thermometer className="w-8 h-8 text-orange-400" />
          <div>
            <p className="text-xs text-slate-400">Avg Temperature</p>
            <p className="text-xl font-bold text-white">{avgTemp.toFixed(1)}°C</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex items-center gap-3">
          <Droplets className="w-8 h-8 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">Total Rainfall</p>
            <p className="text-xl font-bold text-white">{totalRain.toFixed(1)}mm</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex items-center gap-3">
          <Wind className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-xs text-slate-400">Max Wind Speed</p>
            <p className="text-xl font-bold text-white">{maxWind.toFixed(1)} km/h</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-xs text-slate-400">Highest Risk Grid</p>
            <p className="text-xl font-bold text-white">{highestGrid?.id ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Grid overview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Grid Risk Overview</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : loaded.length === 0 ? (
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-8 text-center">
            <p className="text-slate-400">No weather data yet. Click "Analyse Coimbatore" to fetch live data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {grids.map((grid) => (
              <button
                key={grid.id}
                onClick={() => onGridClick(grid)}
                className={`aspect-square rounded-lg border p-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:z-10 ${
                  grid.error
                    ? 'bg-slate-800 border-slate-700'
                    : 'border-slate-700/50'
                }`}
                style={grid.error ? {} : { backgroundColor: RISK_COLORS[grid.riskLevel] + '30', borderColor: RISK_COLORS[grid.riskLevel] + '60' }}
              >
                <span className="text-[10px] font-bold text-white">{grid.id}</span>
                {grid.error ? (
                  <span className="text-[9px] text-slate-500">N/A</span>
                ) : (
                  <span className="text-sm font-bold" style={{ color: RISK_COLORS[grid.riskLevel] }}>
                    {grid.riskScore}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* System flow */}
      <SystemFlow />
    </div>
  );
}

function SystemFlow() {
  const steps = [
    'Location',
    'Coimbatore 5×5 Grid',
    'Weather Data',
    'Grid Mapping',
    'Feature Engineering',
    'Risk Engine',
    'Risk Score',
    'Early Warning',
    'Dashboard / Map / Alert',
  ];
  return (
    <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">System Flow</h3>
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-xs text-slate-300 font-medium">{step}</span>
            {i < steps.length - 1 && <span className="text-cyan-500 text-sm">↓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
