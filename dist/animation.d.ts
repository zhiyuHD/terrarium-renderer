/** Visible canvases share one frame callback; pausing the last one stops scheduling. */
export declare function createSceneAnimation(canvas: HTMLCanvasElement, draw: (now: number) => void): {
    request(): void;
    setActive(value: boolean): void;
    drawOnce(): void;
    setFrameRate(fps: number): void;
    dispose(): void;
};
export declare function setSceneActive(canvas: HTMLCanvasElement, active: boolean): void;
export declare function setSceneFrameRate(canvas: HTMLCanvasElement, fps: number): void;
/** Paint current state without starting or resuming its animation loop. */
export declare function renderSceneFrame(canvas: HTMLCanvasElement): void;
