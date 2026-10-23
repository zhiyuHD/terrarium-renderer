import type { FlowerPlant } from './types.js';
export declare function drawMeadowPlant(g: CanvasRenderingContext2D, plant: FlowerPlant & {
    stage: number;
    dry: boolean;
}, x: number, base: number, night: boolean, flowersOnly?: boolean): boolean;
export declare function drawPollinator(g: CanvasRenderingContext2D, species: string, x: number, y: number, night: boolean): void;
