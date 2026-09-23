import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend, Area, AreaChart, ComposedChart } from 'recharts';
import type { HourlyForecast, DailyForecast } from '@/types';
import { weatherCodeToString } from '@/lib/riskEngine';
import { Thermometer, CloudRain, Wind, Calendar } from 'lucide-react';

interface ForecastProps {
  hourly: HourlyForecast | null;
  daily: DailyForecast[];
}

export function Forecast({ hourly, daily }: ForecastProps) {
  if (!hourly && daily.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-8 text-center">
        <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No forecast data yet. Click "Analyse Coimbatore" to fetch live forecast.</p>
      </div>
    );
  }

  const hourlyData = hourly
    ? hourly.time.map((t, i) => ({
        time: new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temperature: hourly.temperature[i],
        precipitation: hourly.precipitation[i],
        rainProbability: hourly.rainProbability[i],
        windSpeed: hourly.windSpeed[i],
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-400" />
          24-Hour Forecast
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Temperature (°C)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval={3} />
                <YAxis stroke="#64748b" fontSize={10} />
                <RTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Precipitation (mm)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval={3} />
                <YAxis stroke="#64748b" fontSize={10} />
                <RTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="precipitation" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rain Probability (%)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval={3} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <RTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="rainProbability" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Wind Speed (km/h)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval={3} />
                <YAxis stroke="#64748b" fontSize={10} />
                <RTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="windSpeed" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          7-Day Summary
        </h2>
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs">
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-center p-3 font-medium">Temp Range</th>
                <th className="text-center p-3 font-medium">Rain Prob.</th>
                <th className="text-center p-3 font-medium">Precipitation</th>
                <th className="text-center p-3 font-medium">Max Wind</th>
                <th className="text-left p-3 font-medium">Condition</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((d) => (
                <tr key={d.date} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="p-3 text-slate-200 font-medium">
                    {new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </td>
                  <td className="p-3 text-center text-slate-300">
                    <span className="text-orange-400">{d.tempMax.toFixed(0)}°</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-blue-400">{d.tempMin.toFixed(0)}°</span>
                  </td>
                  <td className="p-3 text-center text-slate-300">{d.rainProbability}%</td>
                  <td className="p-3 text-center text-cyan-300">{d.precipitation.toFixed(1)}mm</td>
                  <td className="p-3 text-center text-slate-300">{d.windSpeedMax.toFixed(0)} km/h</td>
                  <td className="p-3 text-slate-300">{weatherCodeToString(d.weatherCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
      {children}
    </div>
  );
}
