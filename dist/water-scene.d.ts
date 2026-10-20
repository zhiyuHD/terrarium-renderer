import { type WaterScene as AquariumFrame } from './types.js';
export declare function createWaterScene(canvas: HTMLCanvasElement): {
    setState(next: AquariumFrame): void;
    dispose(): void;
};
