import { createCanvas } from 'canvas';
import { expect, it, vi, afterEach } from 'vitest';
import { drawWaterPlant, drawWaterFish } from '../src/water-residents.js';
import { createWaterScene } from '../src/water-scene.js';
import type { WaterScene } from '../src/types.js';
afterEach(() => { vi.unstubAllGlobals(); });
function pixels(draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = createCanvas(120, 120), g = canvas.getContext('2d');
  g.translate(60, 70); draw(g as unknown as CanvasRenderingContext2D);
  return canvas.toBuffer('image/png').toString('base64');
}
it('draws a distinct silhouette or pattern for every supported fish and aquatic plant', () => {
  const fish = ['guppy', 'goldfish', 'perch', 'neon_tetra', 'corydoras'];
  const plants = ['waterweed', 'waterlily', 'algae', 'hornwort', 'duckweed'];
  expect(new Set(fish.map(species => pixels(g => drawWaterFish(g, species, 0, false)))).size).toBe(fish.length);
  expect(new Set(plants.map(species => pixels(g => drawWaterPlant(g, { species, stage: 3, health: 100 }, 0, false)))).size).toBe(plants.length);
});
it('renders only the supplied waterlily flower state and retains visible plant health differences', () => {
  const base = { species: 'waterlily', stage: 3, health: 100 };
  const render = (plant: typeof base & { flower?: 'bud' | 'bloom' }) => pixels(g => drawWaterPlant(g, plant, 0, false));
  expect(new Set([render(base), render({ ...base, flower: 'bud' }), render({ ...base, flower: 'bloom' })]).size).toBe(3);
  expect(render({ ...base, health: 10 })).not.toBe(render(base));
});
it('draws an immutable mixed water scene and cancels the animation on disposal', () => {
  let next: FrameRequestCallback | undefined;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { next = callback; return 1; });
  vi.stubGlobal('cancelAnimationFrame', () => { next = undefined; });
  const canvas = createCanvas(800, 500), renderer = createWaterScene(canvas as unknown as HTMLCanvasElement);
  const state: WaterScene = { phase: 'night', gridSize: 8, oxygen: 80, cleanliness: 85, food: [], plants: ['hornwort', 'duckweed', 'waterlily'].map((species, i) => ({ x: i, y: i, species, stage: 3, health: 60, flower: species === 'waterlily' ? 'bloom' : undefined })), fish: ['neon_tetra', 'corydoras'].map((species, i) => ({ id: `fish-${i}`, species, x: i + 1, y: 2 })) };
  const original = structuredClone(state);
  renderer.setState(state); next!(0);
  expect(state).toEqual(original); expect(canvas.getContext('2d').getImageData(300, 200, 1, 1).data[3]).toBe(255);
  renderer.dispose(); expect(next).toBeUndefined(); renderer.setState(state); expect(next).toBeUndefined();
});
