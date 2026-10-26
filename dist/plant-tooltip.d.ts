import { type LandScene } from './types.js';
export declare function createPlantTooltip(canvas: HTMLCanvasElement, language: 'zh' | 'en'): {
    setState(next: LandScene): void;
    dispose(): void;
};
