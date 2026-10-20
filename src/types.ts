export interface Position { x: number; y: number }
export interface NestPosition extends Position { nestId: string }
export interface Facility extends Position { kind: string; enabled: boolean }
export interface SceneDimensions { gridSize?: number; facilities?: Facility[] }
export interface Nest extends Position { id: string; depth: number; food: number; foodCapacity?: number }
export interface FlowerPlant { species: string; flower?: 'bud' | 'bloom'; seedHead?: boolean }
export interface LandScene extends SceneDimensions {
  phase: 'day' | 'night';
  soil?: Array<Position & { moisture: number; daylight?: number }>;
  eggs?: Array<Position & { id: string; species: string; hatchesAtMs: number; inside?: NestPosition }>;
  nests?: Nest[];
  food?: Array<Position & { portions: number; kind?: 'sunflower_seed' }>;
  webs?: Position[];
  plants: Array<Position & FlowerPlant & { id: string; stage: number; dry: boolean }>;
  seeds: Array<Position & { id: string; species: string }>;
  bugs: Array<Position & { id: string; species: string; flying?: boolean; carrying?: number; role?: 'queen' | 'worker'; inside?: NestPosition; energy?: number; hunger?: number }>;
  items: Array<Position & { id: 'coin' | 'pebble' }>;
}
export interface WaterScene extends SceneDimensions {
  phase: 'day' | 'night'; oxygen: number; cleanliness: number;
  fish: Array<Position & { id: string; species: string }>;
  plants: Array<Position & { species: string; stage: number }>;
  food: Array<Position & { portions: number }>;
}
export function sceneSize(scene: SceneDimensions): number { return scene.gridSize ?? 5; }
