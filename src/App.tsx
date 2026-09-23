import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/components/Dashboard';
import { RiskMap } from '@/components/RiskMap';
import { Forecast } from '@/components/Forecast';
import { Alerts } from '@/components/Alerts';
import { DataSources } from '@/components/DataSources';
import { useWeatherData } from '@/hooks/useWeatherData';
import type { ViewType, GridData } from '@/types';

function App() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedGrid, setSelectedGrid] = useState<GridData | null>(null);

  const {
    grids,
    loading,
    lastUpdated,
    hourlyForecast,
    dailyForecast,
    alerts,
    simState,
    error,
    fetchAllWeather,
    startSimulation,
    stopSimulation,
  } = useWeatherData();

  const handleGridClick = (grid: GridData) => {
    setSelectedGrid(grid);
    if (view !== 'riskmap') setView('riskmap');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar currentView={view} onNavigate={setView} />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopBar
          lastUpdated={lastUpdated}
          simState={simState}
          loading={loading}
          onAnalyze={fetchAllWeather}
          onSimulate={startSimulation}
          onStopSim={stopSimulation}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {view === 'dashboard' && (
            <Dashboard
              grids={grids}
              alerts={alerts}
              lastUpdated={lastUpdated}
              loading={loading}
              onGridClick={handleGridClick}
            />
          )}

          {view === 'riskmap' && (
            <RiskMap
              grids={grids}
              selectedGrid={selectedGrid}
              onGridClick={setSelectedGrid}
              onClose={() => setSelectedGrid(null)}
            />
          )}

          {view === 'forecast' && <Forecast hourly={hourlyForecast} daily={dailyForecast} />}

          {view === 'alerts' && <Alerts alerts={alerts} />}

          {view === 'datasources' && <DataSources />}
        </main>
      </div>
    </div>
  );
}

export default App;
