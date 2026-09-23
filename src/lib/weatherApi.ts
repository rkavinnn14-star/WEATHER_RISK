import type { GridData, HourlyForecast, DailyForecast } from '@/types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'precipitation_probability',
  'wind_speed_10m',
  'wind_direction_10m',
  'surface_pressure',
  'cloud_cover',
  'weather_code',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m',
  'precipitation',
  'precipitation_probability',
  'wind_speed_10m',
].join(',');

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'weather_code',
].join(',');

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    rain: number;
    precipitation_probability: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    weather_code: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

export async function fetchGridWeather(grid: GridData): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: String(grid.centerLat),
    longitude: String(grid.centerLng),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);
  const data = await res.json();
  return data as OpenMeteoResponse;
}

export function parseHourlyForecast(data: OpenMeteoResponse): HourlyForecast {
  const now = new Date();
  const startIdx = data.hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx === -1 ? 0 : startIdx;
  const end = Math.min(idx + 24, data.hourly.time.length);
  return {
    time: data.hourly.time.slice(idx, end),
    temperature: data.hourly.temperature_2m.slice(idx, end),
    precipitation: data.hourly.precipitation.slice(idx, end),
    rainProbability: data.hourly.precipitation_probability.slice(idx, end),
    windSpeed: data.hourly.wind_speed_10m.slice(idx, end),
  };
}

export function parseDailyForecast(data: OpenMeteoResponse): DailyForecast[] {
  return data.daily.time.map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    rainProbability: data.daily.precipitation_probability_max[i],
    windSpeedMax: data.daily.wind_speed_10m_max[i],
    weatherCode: data.daily.weather_code[i],
  }));
}

export function parseCurrentWeather(data: OpenMeteoResponse) {
  const c = data.current;
  return {
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    rainProbability: c.precipitation_probability,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    pressure: c.surface_pressure,
    cloudCover: c.cloud_cover,
    weatherCode: c.weather_code,
    lastUpdated: c.time,
  };
}
