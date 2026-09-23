import type { GridData } from '@/types';
import { calculateRiskIndicators, calculateOverallRisk, riskLevelFromScore } from './riskEngine';

export interface SimState {
  active: boolean;
  step: number;
}

export const SIM_STEPS = 5;

const SIM_PROFILES = [
  { precip: 0.0, rainProb: 20, cloud: 30, wind: 8, temp: 28, humidity: 55, weatherCode: 1 },
  { precip: 0.5, rainProb: 45, cloud: 55, wind: 12, temp: 27, humidity: 65, weatherCode: 80 },
  { precip: 2.5, rainProb: 70, cloud: 75, wind: 18, temp: 25, humidity: 78, weatherCode: 63 },
  { precip: 8.0, rainProb: 88, cloud: 90, wind: 28, temp: 23, humidity: 88, weatherCode: 65 },
  { precip: 18.0, rainProb: 96, cloud: 95, wind: 42, temp: 21, humidity: 94, weatherCode: 95 },
];

export function applySimulation(grids: GridData[], step: number): GridData[] {
  const profile = SIM_PROFILES[Math.min(step, SIM_PROFILES.length - 1)];
  const now = new Date().toISOString();

  return grids.map((grid, i) => {
    const variance = ((i * 7 + step * 13) % 11) / 10;
    const weather = {
      temperature: profile.temp + (variance - 0.5) * 2,
      humidity: Math.min(100, profile.humidity + (variance - 0.5) * 6),
      precipitation: profile.precip * (0.7 + variance * 0.6),
      rainProbability: Math.min(100, profile.rainProb + (variance - 0.5) * 8),
      windSpeed: profile.wind * (0.8 + variance * 0.4),
      windDirection: 180 + (variance - 0.5) * 40,
      pressure: 1008 - step * 1.5,
      cloudCover: Math.min(100, profile.cloud + (variance - 0.5) * 8),
      weatherCode: profile.weatherCode,
      lastUpdated: now,
    };
    const riskIndicators = calculateRiskIndicators(weather);
    const riskScore = calculateOverallRisk(riskIndicators);
    const riskLevel = riskLevelFromScore(riskScore);
    return { ...grid, weather, riskIndicators, riskScore, riskLevel, error: false, loading: false };
  });
}
