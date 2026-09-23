export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  rainProbability: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  weatherCode: number;
  lastUpdated: string;
}

export interface RiskIndicators {
  floodRisk: number;
  thunderstormRisk: number;
  windRisk: number;
  heatRisk: number;
}

export interface GridData {
  id: string;
  row: number;
  col: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  centerLat: number;
  centerLng: number;
  weather: WeatherData | null;
  riskScore: number;
  riskLevel: RiskLevel;
  riskIndicators: RiskIndicators;
  error: boolean;
  loading: boolean;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  precipitation: number[];
  rainProbability: number[];
  windSpeed: number[];
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  rainProbability: number;
  windSpeedMax: number;
  weatherCode: number;
}

export type AlertLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface Alert {
  id: string;
  level: AlertLevel;
  gridId: string;
  hazardType: string;
  reason: string;
  timestamp: string;
}

export type ViewType = 'dashboard' | 'riskmap' | 'forecast' | 'alerts' | 'datasources';
