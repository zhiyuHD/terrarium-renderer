import type { FlowerPlant, LandScene } from './types.js';
export declare function drawGardenPlant(g: CanvasRenderingContext2D, p: FlowerPlant & {
    stage: number;
    dry: boolean;
}, x: number, base: number, night: boolean, flowersOnly: boolean): boolean;
export declare function drawGardenGround(g: CanvasRenderingContext2D, state: LandScene, size: number, night: boolean): void;
export declare function drawDecomposer(g: CanvasRenderingContext2D, species: string, x: number, y: number, night: boolean): void;
