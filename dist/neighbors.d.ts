import type { FlowerPlant } from './types.js';
/** Distinct silhouettes stay inside a land cell's existing resident scale. */
export declare function drawNeighborPlant(g: CanvasRenderingContext2D, plant: FlowerPlant & {
    stage: number;
    dry: boolean;
    seedHead?: boolean;
}, x: number, base: number, night: boolean, flowersOnly?: boolean): boolean;
export declare function drawLadybug(g: CanvasRenderingContext2D, x: number, y: number, night: boolean): void;
