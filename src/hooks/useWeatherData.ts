import { useState, useCallback, useRef, useEffect } from 'react';
import type { GridData, HourlyForecast, DailyForecast, Alert } from '@/types';
import { createGrids } from '@/lib/grid';
import { fetchGridWeather, parseCurrentWeather, parseHourlyForecast, parseDailyForecast } from '@/lib/weatherApi';
import { calculateRiskIndicators, calculateOverallRisk, riskLevelFromScore } from '@/lib/riskEngine';
import { generateAlerts } from '@/lib/alertEngine';
import { applySimulation, SIM_STEPS, type SimState } from '@/lib/simulation';

const INITIAL_GRIDS = createGrids();

export function useWeatherData() {
  const [grids, setGrids] = useState<GridData[]>(INITIAL_GRIDS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [simState, setSimState] = useState<SimState>({ active: false, step: 0 });
  const [error, setError] = useState<string | null>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAllWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGrids((prev) => prev.map((g) => ({ ...g, loading: true, error: false })));

    const results = await Promise.allSettled(
      INITIAL_GRIDS.map((grid) => fetchGridWeather(grid))
    );

    const updatedGrids = INITIAL_GRIDS.map((grid, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        const current = parseCurrentWeather(result.value);
        const riskIndicators = calculateRiskIndicators(current);
        const riskScore = calculateOverallRisk(riskIndicators);
        const riskLevel = riskLevelFromScore(riskScore);
        return { ...grid, weather: current, riskIndicators, riskScore, riskLevel, error: false, loading: false };
      }
      return { ...grid, weather: null, error: true, loading: false };
    });

    setGrids(updatedGrids);
    setLastUpdated(new Date().toISOString());

    const firstSuccess = results.find((r) => r.status === 'fulfilled');
    if (firstSuccess && firstSuccess.status === 'fulfilled') {
      setHourlyForecast(parseHourlyForecast(firstSuccess.value));
      setDailyForecast(parseDailyForecast(firstSuccess.value));
    }

    setAlerts(generateAlerts(updatedGrids));
    setLoading(false);

    const failCount = results.filter((r) => r.status === 'rejected').length;
    if (failCount === results.length) {
      setError('Failed to fetch weather data from Open-Meteo API. Please check your network connection.');
    } else if (failCount > 0) {
      setError(`${failCount} grid(s) failed to load weather data.`);
    }
  }, []);

  const startSimulation = useCallback(() => {
    setSimState({ active: true, step: 0 });
    let step = 0;
    setGrids(applySimulation(INITIAL_GRIDS, 0));
    setAlerts(generateAlerts(applySimulation(INITIAL_GRIDS, 0)));
    setLastUpdated(new Date().toISOString());

    simIntervalRef.current = setInterval(() => {
      step += 1;
      if (step >= SIM_STEPS) {
        step = SIM_STEPS - 1;
        if (simIntervalRef.current) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
        }
      }
      const simGrids = applySimulation(INITIAL_GRIDS, step);
      setGrids(simGrids);
      setAlerts(generateAlerts(simGrids));
      setLastUpdated(new Date().toISOString());
      setSimState({ active: true, step });
    }, 2500);
  }, []);

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setSimState({ active: false, step: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  return {
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
  };
}
