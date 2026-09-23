import { MapContainer, Polygon, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { GridData } from '@/types';
import { RISK_COLORS, generateRiskExplanation, weatherCodeToString } from '@/lib/riskEngine';
import { MIN_LAT, MAX_LAT, MIN_LNG, MAX_LNG } from '@/lib/grid';
import 'leaflet/dist/leaflet.css';

interface RiskMapProps {
  grids: GridData[];
  selectedGrid: GridData | null;
  onGridClick: (grid: GridData) => void;
  onClose: () => void;
}

function MapBounds() {
  const map = useMap();
  map.fitBounds([
    [MIN_LAT - 0.02, MIN_LNG - 0.02],
    [MAX_LAT + 0.02, MAX_LNG + 0.02],
  ]);
  return null;
}

export function RiskMap({ grids, selectedGrid, onGridClick, onClose }: RiskMapProps) {
  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden border border-slate-700" style={{ height: 'calc(100vh - 180px)', minHeight: '400px' }}>
        <MapContainer center={[(MIN_LAT + MAX_LAT) / 2, (MIN_LNG + MAX_LNG) / 2]} zoom={11} className="w-full h-full bg-slate-900" zoomControl={true}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          <MapBounds />
          {grids.map((grid) => {
            const positions: [number, number][] = [
              [grid.minLat, grid.minLng],
              [grid.maxLat, grid.minLng],
              [grid.maxLat, grid.maxLng],
              [grid.minLat, grid.maxLng],
            ];
            const color = grid.error ? '#64748b' : RISK_COLORS[grid.riskLevel];
            return (
              <Polygon
                key={grid.id}
                positions={positions}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: grid.error ? 0.1 : 0.35,
                  weight: 1.5,
                }}
                eventHandlers={{ click: () => onGridClick(grid) }}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <strong>{grid.id}</strong>
                    {grid.error ? (
                      <div className="text-slate-500">Data unavailable</div>
                    ) : (
                      <>
                        <div>Risk: {grid.riskScore} ({grid.riskLevel})</div>
                        <div>Temp: {grid.weather?.temperature.toFixed(1)}°C</div>
                        <div>Rain: {grid.weather?.precipitation.toFixed(1)}mm</div>
                      </>
                    )}
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700 p-3 space-y-2">
        <p className="text-xs font-semibold text-slate-300 mb-1">Risk Level</p>
        {(['LOW', 'MODERATE', 'HIGH', 'VERY HIGH'] as const).map((level) => (
          <div key={level} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: RISK_COLORS[level] }} />
            <span className="text-xs text-slate-300">{level}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700">
          <div className="w-4 h-4 rounded bg-slate-500" />
          <span className="text-xs text-slate-300">Unavailable</span>
        </div>
      </div>

      {/* Detail panel */}
      {selectedGrid && (
        <GridDetailPanel grid={selectedGrid} onClose={onClose} />
      )}
    </div>
  );
}

function GridDetailPanel({ grid, onClose }: { grid: GridData; onClose: () => void }) {
  const w = grid.weather;
  const r = grid.riskIndicators;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-[90%] max-w-md max-h-[70%] overflow-y-auto rounded-2xl bg-slate-900/95 backdrop-blur border border-slate-700 p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-12 rounded-full" style={{ backgroundColor: grid.error ? '#64748b' : RISK_COLORS[grid.riskLevel] }} />
          <div>
            <h3 className="text-lg font-bold text-white">{grid.id}</h3>
            <p className="text-xs text-slate-400">
              {grid.centerLat.toFixed(4)}°N, {grid.centerLng.toFixed(4)}°E
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none px-2">×</button>
      </div>

      {grid.error ? (
        <div className="rounded-lg bg-slate-800/50 p-4 text-center">
          <p className="text-slate-400 text-sm">Weather data unavailable for this grid.</p>
          <p className="text-slate-500 text-xs mt-1">API request failed. This grid could not be populated.</p>
        </div>
      ) : w ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: RISK_COLORS[grid.riskLevel] }}>{grid.riskScore}</span>
            <span className="text-sm font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: RISK_COLORS[grid.riskLevel] + '20', color: RISK_COLORS[grid.riskLevel] }}>
              {grid.riskLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Stat label="Temperature" value={`${w.temperature.toFixed(1)}°C`} />
            <Stat label="Humidity" value={`${w.humidity}%`} />
            <Stat label="Rainfall" value={`${w.precipitation.toFixed(1)}mm`} />
            <Stat label="Rain Prob." value={`${w.rainProbability}%`} />
            <Stat label="Wind Speed" value={`${w.windSpeed.toFixed(1)} km/h`} />
            <Stat label="Pressure" value={`${w.pressure.toFixed(0)} hPa`} />
            <Stat label="Cloud Cover" value={`${w.cloudCover}%`} />
            <Stat label="Condition" value={weatherCodeToString(w.weatherCode)} />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-700">
            <RiskBar label="Flood Risk" value={r.floodRisk} />
            <RiskBar label="Thunderstorm Risk" value={r.thunderstormRisk} />
            <RiskBar label="Wind Risk" value={r.windRisk} />
            <RiskBar label="Heat Risk" value={r.heatRisk} />
          </div>

          <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
            <p className="text-xs font-semibold text-cyan-300 mb-1">Why is this grid at risk?</p>
            <p className="text-xs text-slate-300 leading-relaxed">{generateRiskExplanation(grid.id, w, r)}</p>
          </div>

          <p className="text-[10px] text-slate-500 text-right">
            Last updated: {new Date(w.lastUpdated).toLocaleString('en-IN')}
          </p>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">Loading...</p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/50 px-3 py-2">
      <p className="text-slate-500">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function RiskBar({ label, value }: { label: string; value: number }) {
  const level = value <= 25 ? 'LOW' : value <= 50 ? 'MODERATE' : value <= 75 ? 'HIGH' : 'VERY HIGH';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: RISK_COLORS[level] }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color: RISK_COLORS[level] }}>{value}</span>
    </div>
  );
}
