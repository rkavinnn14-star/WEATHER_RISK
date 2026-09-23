import type { WeatherData, RiskIndicators, RiskLevel } from '@/types';

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function calculateFloodRisk(precip: number, rainProb: number, cloudCover: number): number {
  const precipScore = clamp(precip * 20);
  const probScore = clamp(rainProb);
  const cloudScore = clamp(cloudCover * 0.3);
  return Math.round(clamp(precipScore * 0.5 + probScore * 0.4 + cloudScore * 0.1));
}

export function calculateThunderstormRisk(precip: number, weatherCode: number, cloudCover: number): number {
  const severeCodes = [95, 96, 99, 200, 201, 202, 230, 231, 232];
  const thunderstormCodes = [29, 39, 95, 96, 99];
  let codeScore = 0;
  if (severeCodes.includes(weatherCode)) codeScore = 100;
  else if (thunderstormCodes.includes(weatherCode)) codeScore = 70;
  else if (weatherCode >= 45 && weatherCode <= 48) codeScore = 20;
  const precipScore = clamp(precip * 15);
  const cloudScore = clamp(cloudCover * 0.4);
  return Math.round(clamp(codeScore * 0.5 + precipScore * 0.3 + cloudScore * 0.2));
}

export function calculateWindRisk(windSpeed: number): number {
  return Math.round(clamp(windSpeed * 2.5));
}

export function calculateHeatRisk(temp: number, humidity: number): number {
  const tempScore = clamp((temp - 25) * 4);
  const humidityScore = clamp((humidity - 50) * 1.5);
  return Math.round(clamp(tempScore * 0.6 + humidityScore * 0.4));
}

export function calculateRiskIndicators(w: WeatherData): RiskIndicators {
  return {
    floodRisk: calculateFloodRisk(w.precipitation, w.rainProbability, w.cloudCover),
    thunderstormRisk: calculateThunderstormRisk(w.precipitation, w.weatherCode, w.cloudCover),
    windRisk: calculateWindRisk(w.windSpeed),
    heatRisk: calculateHeatRisk(w.temperature, w.humidity),
  };
}

export function calculateOverallRisk(r: RiskIndicators): number {
  return Math.round(
    clamp(
      r.floodRisk * 0.35 +
      r.thunderstormRisk * 0.3 +
      r.windRisk * 0.2 +
      r.heatRisk * 0.15
    )
  );
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 75) return 'HIGH';
  return 'VERY HIGH';
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  'LOW': '#22c55e',
  'MODERATE': '#eab308',
  'HIGH': '#f97316',
  'VERY HIGH': '#ef4444',
};

export const RISK_BG_COLORS: Record<RiskLevel, string> = {
  'LOW': 'bg-green-500',
  'MODERATE': 'bg-yellow-500',
  'HIGH': 'bg-orange-500',
  'VERY HIGH': 'bg-red-500',
};

export function generateRiskExplanation(gridId: string, weather: WeatherData, risk: RiskIndicators): string {
  const factors: string[] = [];

  if (risk.floodRisk > 50) {
    factors.push(`High flood risk due to ${weather.precipitation.toFixed(1)}mm precipitation and ${weather.rainProbability}% rain probability`);
  } else if (risk.floodRisk > 25) {
    factors.push(`Moderate flood risk from ${weather.precipitation.toFixed(1)}mm rainfall and ${weather.rainProbability}% rain probability`);
  }

  if (risk.thunderstormRisk > 50) {
    factors.push(`Elevated thunderstorm risk with weather code ${weather.weatherCode} and ${weather.cloudCover}% cloud cover`);
  } else if (risk.thunderstormRisk > 25) {
    factors.push(`Possible thunderstorm activity indicated by weather code ${weather.weatherCode}`);
  }

  if (risk.windRisk > 50) {
    factors.push(`High wind risk at ${weather.windSpeed.toFixed(1)} km/h`);
  } else if (risk.windRisk > 25) {
    factors.push(`Moderate wind speeds of ${weather.windSpeed.toFixed(1)} km/h`);
  }

  if (risk.heatRisk > 50) {
    factors.push(`High heat risk with ${weather.temperature.toFixed(1)}°C temperature and ${weather.humidity}% humidity`);
  } else if (risk.heatRisk > 25) {
    factors.push(`Warm conditions at ${weather.temperature.toFixed(1)}°C with ${weather.humidity}% humidity`);
  }

  if (factors.length === 0) {
    return `Grid ${gridId} is currently at low risk. Weather conditions are stable with no significant hazard indicators.`;
  }

  return `Grid ${gridId}: ${factors.join('. ')}.`;
}

export const WMO_WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function weatherCodeToString(code: number): string {
  return WMO_WEATHER_CODES[code] ?? 'Unknown';
}
