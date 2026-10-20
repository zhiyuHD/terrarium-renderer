import { type LandScene as SceneState } from './types.js';
export { plotPosition } from './geometry.js';
export declare function bugPositions(bugs: SceneState['bugs'], positions?: ReadonlyMap<string, {
    x: number;
    y: number;
}>, size?: number): Map<string, {
    x: number;
    y: number;
}>;
export declare function drawScene(canvas: HTMLCanvasElement, state: SceneState, positions?: ReadonlyMap<string, {
    x: number;
    y: number;
}>, hits?: ReadonlyArray<{
    x: number;
    y: number;
    strength: number;
}>): void;
export declare function createLandRenderer(canvas: HTMLCanvasElement): {
    setState(state: SceneState): void;
    dispose(): void;
};
export declare function createScene(canvas: HTMLCanvasElement, language?: 'zh' | 'en'): {
    setState(state: SceneState, recordedAtMs?: number): void;
    dispose(): void;
};
