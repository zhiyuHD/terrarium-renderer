import type { Position } from './types.js';
/** The scene supplies the pot kind; its game effects belong to the caller. */
export declare function drawPot(g: CanvasRenderingContext2D, pot: Position & {
    kind: string;
}, x: number, y: number, scale: number, night: boolean): void;
