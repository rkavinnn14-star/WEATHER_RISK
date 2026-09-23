import type { GridData, Alert, AlertLevel } from '@/types';

export function generateAlerts(grids: GridData[]): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date().toISOString();

  for (const grid of grids) {
    if (grid.error || !grid.weather) continue;
    const { riskIndicators: r, weather: w, id } = grid;

    if (r.floodRisk >= 76) {
      alerts.push({
        id: `${id}-flood-${now}`,
        level: 'CRITICAL',
        gridId: id,
        hazardType: 'FLOOD',
        reason: `VERY HIGH FLOOD RISK detected in ${id} due to ${w.precipitation.toFixed(1)}mm precipitation and ${w.rainProbability}% rain probability.`,
        timestamp: now,
      });
    } else if (r.floodRisk >= 51) {
      alerts.push({
        id: `${id}-flood-${now}`,
        level: 'HIGH',
        gridId: id,
        hazardType: 'FLOOD',
        reason: `HIGH FLOOD RISK in ${id} due to ${w.precipitation.toFixed(1)}mm precipitation and ${w.rainProbability}% rain probability.`,
        timestamp: now,
      });
    }

    if (r.thunderstormRisk >= 76) {
      alerts.push({
        id: `${id}-thunder-${now}`,
        level: 'CRITICAL',
        gridId: id,
        hazardType: 'THUNDERSTORM',
        reason: `VERY HIGH THUNDERSTORM RISK in ${id} with weather code ${w.weatherCode} and ${w.cloudCover}% cloud cover.`,
        timestamp: now,
      });
    } else if (r.thunderstormRisk >= 51) {
      alerts.push({
        id: `${id}-thunder-${now}`,
        level: 'HIGH',
        gridId: id,
        hazardType: 'THUNDERSTORM',
        reason: `HIGH THUNDERSTORM RISK in ${id} with weather code ${w.weatherCode}.`,
        timestamp: now,
      });
    }

    if (r.windRisk >= 76) {
      alerts.push({
        id: `${id}-wind-${now}`,
        level: 'CRITICAL',
        gridId: id,
        hazardType: 'WIND',
        reason: `VERY HIGH WIND RISK in ${id} with wind speed ${w.windSpeed.toFixed(1)} km/h.`,
        timestamp: now,
      });
    } else if (r.windRisk >= 51) {
      alerts.push({
        id: `${id}-wind-${now}`,
        level: 'HIGH',
        gridId: id,
        hazardType: 'WIND',
        reason: `HIGH WIND RISK in ${id} with wind speed ${w.windSpeed.toFixed(1)} km/h.`,
        timestamp: now,
      });
    }

    if (r.heatRisk >= 76) {
      alerts.push({
        id: `${id}-heat-${now}`,
        level: 'CRITICAL',
        gridId: id,
        hazardType: 'HEAT',
        reason: `VERY HIGH HEAT RISK in ${id} at ${w.temperature.toFixed(1)}°C and ${w.humidity}% humidity.`,
        timestamp: now,
      });
    } else if (r.heatRisk >= 51) {
      alerts.push({
        id: `${id}-heat-${now}`,
        level: 'HIGH',
        gridId: id,
        hazardType: 'HEAT',
        reason: `HIGH HEAT RISK in ${id} at ${w.temperature.toFixed(1)}°C and ${w.humidity}% humidity.`,
        timestamp: now,
      });
    }
  }

  return alerts.sort((a, b) => {
    const order: Record<AlertLevel, number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
    return order[a.level] - order[b.level];
  });
}

export const ALERT_LEVEL_COLORS: Record<AlertLevel, string> = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  MODERATE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  LOW: 'text-green-400 bg-green-500/10 border-green-500/30',
};
