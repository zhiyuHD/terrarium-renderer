import { expect, it, vi, afterEach } from 'vitest';
import { LAND_SURFACE, WATER_SURFACE, cellPosition, residentScale, createLandRenderer, type LandScene } from '../src/index.js';
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('contains all cell edges and residents within visible surfaces at each supported grid size', () => {
  for (const size of [5, 6, 7, 8]) for (const surface of [LAND_SURFACE, WATER_SURFACE]) {
    const cells = new Set<string>();
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const p = cellPosition(surface, x, y, size); cells.add(`${p.x},${p.y}`);
      expect(p.x - surface.width / size / 2).toBeGreaterThanOrEqual(surface.x - 1e-9);
      expect(p.x + surface.width / size / 2).toBeLessThanOrEqual(surface.x + surface.width + 1e-9);
      expect(p.y - surface.height / size / 2).toBeGreaterThanOrEqual(surface.y - 1e-9);
      expect(p.y + surface.height / size / 2).toBeLessThanOrEqual(surface.y + surface.height + 1e-9);
      expect(p.x - 35 * residentScale(size)).toBeGreaterThan(surface.x);
      expect(p.x + 35 * residentScale(size)).toBeLessThan(surface.x + surface.width);
    }
    expect(cells.size).toBe(size ** 2);
  }
});
it('renders immutable expanded snapshots without engine state and stops scheduling after disposal', () => {
  let next: FrameRequestCallback | undefined, now = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { next = callback; return ++now; });
  vi.stubGlobal('cancelAnimationFrame', () => { next = undefined; });
  const cells: number[][] = [];
  const context = { createLinearGradient: () => ({ addColorStop() {} }), fillRect() {}, beginPath() {}, arc() {}, fill() {}, roundRect() {}, moveTo() {}, lineTo() {}, stroke() {}, quadraticCurveTo() {}, ellipse() {}, save() {}, restore() {}, translate() {}, scale() {}, rect(...args: number[]) { cells.push(args); } };
  const canvas = { getContext: () => context } as unknown as HTMLCanvasElement;
  const snapshot: LandScene = { gridSize: 8, phase: 'day', plants: [], bugs: [], seeds: [], items: [] };
  const original = structuredClone(snapshot), renderer = createLandRenderer(canvas);
  renderer.setState(snapshot); next!(0); expect(cells).toHaveLength(snapshot.gridSize! ** 2); expect(snapshot).toEqual(original);
  renderer.dispose(); expect(next).toBeUndefined(); renderer.setState(snapshot); expect(next).toBeUndefined();
});
