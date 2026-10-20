import { type LandScene as SceneState } from './types.js';
export declare function createNestViewer(canvas: HTMLCanvasElement, language?: 'zh' | 'en'): {
    setState(next: SceneState, atMs?: number): void;
    dispose(): void;
};
