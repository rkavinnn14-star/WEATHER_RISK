import type { GridData } from '@/types';

const GRID_SIZE = 5;
const MIN_LAT = 10.95;
const MAX_LAT = 11.25;
const MIN_LNG = 76.85;
const MAX_LNG = 77.15;

const CELL_LAT = (MAX_LAT - MIN_LAT) / GRID_SIZE;
const CELL_LNG = (MAX_LNG - MIN_LNG) / GRID_SIZE;

export function createGrids(): GridData[] {
  const grids: GridData[] = [];
  let id = 1;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const minLat = MIN_LAT + row * CELL_LAT;
      const maxLat = minLat + CELL_LAT;
      const minLng = MIN_LNG + col * CELL_LNG;
      const maxLng = minLng + CELL_LNG;
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      grids.push({
        id: `CBE-${String(id).padStart(2, '0')}`,
        row,
        col,
        minLat,
        maxLat,
        minLng,
        maxLng,
        centerLat,
        centerLng,
        weather: null,
        riskScore: 0,
        riskLevel: 'LOW',
        riskIndicators: { floodRisk: 0, thunderstormRisk: 0, windRisk: 0, heatRisk: 0 },
        error: false,
        loading: false,
      });
      id++;
    }
  }
  return grids;
}

export const GRID_COUNT = GRID_SIZE * GRID_SIZE;
export { MIN_LAT, MAX_LAT, MIN_LNG, MAX_LNG, CELL_LAT, CELL_LNG };
