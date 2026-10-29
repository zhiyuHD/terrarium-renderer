import { type WaterScene as AquariumFrame } from './types.js';
export declare function createWaterScene(canvas: HTMLCanvasElement): {
    setActive(active: boolean): void;
    setState(next: AquariumFrame): void;
    dispose(): void;
};
