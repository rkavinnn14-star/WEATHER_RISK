import { CheckCircle, Clock, Database, Radio, Satellite, CloudLightning, MapPin, Wind, CloudRain } from 'lucide-react';

interface DataSourcesProps {}

export function DataSources(_props: DataSourcesProps) {
  const activeSources = [
    {
      name: 'Open-Meteo',
      description: 'Weather API providing current conditions, hourly and daily forecasts for all 25 grid points.',
      status: 'Connected',
      icon: Radio,
      url: 'https://open-meteo.com',
    },
  ];

  const plannedSources = [
    { name: 'IMD', description: 'India Meteorological Department — official weather forecasts, warnings and bulletins.', icon: CloudRain },
    { name: 'MOSDAC / ISRO', description: 'Meteorological & Oceanographic Satellite Data Archival Centre — satellite-derived products.', icon: Satellite },
    { name: 'INSAT', description: 'Indian National Satellite System — cloud imagery, SST, atmospheric soundings.', icon: Satellite },
    { name: 'IMD Radar', description: 'Doppler weather radar — reflectivity, rainfall estimation, storm tracking.', icon: MapPin },
    { name: 'AWS Ground Stations', description: 'Automatic Weather Station network — real-time surface observations.', icon: Wind },
    { name: 'Lightning Data', description: 'Lightning detection network — strike location, intensity and frequency.', icon: CloudLightning },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          Active Data Sources
        </h2>
        <div className="space-y-3">
          {activeSources.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="rounded-xl bg-green-500/5 border border-green-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{s.name}</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        {s.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{s.description}</p>
                    <p className="text-xs text-cyan-400/70 mt-1">{s.url}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Planned / Integration Ready
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plannedSources.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-200">{s.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-[10px] font-medium">
                        Integration Ready — Not Connected
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{s.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg bg-slate-800/30 border border-slate-700/30 p-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            These sources are architecturally planned and the system is designed to ingest their data.
            They are not currently connected and do not provide live data to this prototype.
          </p>
        </div>
      </div>

      {/* AI/ML Placeholder */}
      <div className="rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/20 border border-slate-700/50 p-5">
        <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          AI Risk Intelligence
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          VARSHAA is designed to support machine-learning-based risk prediction using historical weather
          and hazard datasets. The architecture allows seamless upgrade from rule-based scoring to
          trained ML models.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3">
            <p className="text-xs font-semibold text-cyan-300 mb-1">Current MVP</p>
            <p className="text-sm text-slate-300">Rule-based risk engine using deterministic formulas on live weather parameters.</p>
          </div>
          <div className="rounded-lg bg-slate-700/30 border border-slate-600/30 p-3">
            <p className="text-xs font-semibold text-slate-300 mb-1">Future</p>
            <p className="text-sm text-slate-400">Machine Learning / Random Forest prediction using labelled historical data for probabilistic risk forecasting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
