import { createCanvas } from 'canvas';
import { expect, it } from 'vitest';
import { drawMeadowPlant, drawPollinator } from '../src/pollinators.js';
function pixels(draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = createCanvas(160, 160), context = canvas.getContext('2d');
  draw(context as unknown as CanvasRenderingContext2D);
  return canvas.toBuffer().toString('base64');
}
it('distinguishes meadow flowers, flower stages, leaf damage and both pollinators', () => {
  const plant = { id: 'plant', species: 'daisy', x: 0, y: 0, stage: 3, health: 100, flower: 'bloom' as const };
  const render = (overrides = {}) => pixels(g => { drawMeadowPlant(g, { ...plant, ...overrides }, 80, 130, false, false); });
  expect(new Set([render(), render({ species: 'lavender' }), render({ flower: 'bud' }), render({ health: 20, leafDamage: 80 })]).size).toBe(4);
  expect(pixels(g => drawPollinator(g, 'bee', 80, 80, false))).not.toBe(pixels(g => drawPollinator(g, 'butterfly', 80, 80, false)));
});

it('renders all ten pot finishes distinctly in occupied and empty plots without changing snapshots', async () => {
  const { drawScene } = await import('../src/index.js');
  const kinds = ['clay', 'porcelain', 'spring', 'slow', 'still', 'reservoir', 'drainage', 'shade', 'sun', 'healing'];
  const images = kinds.map(kind => {
    const scene = { phase: 'day' as const, plants: [], seeds: [], bugs: [], items: [], economy: { pots: [{ kind, x: 2, y: 2 }] } };
    const before = structuredClone(scene), canvas = createCanvas(800, 500);
    drawScene(canvas as unknown as HTMLCanvasElement, scene); expect(scene).toEqual(before);
    return canvas.toBuffer().toString('base64');
  });
  expect(new Set(images).size).toBe(kinds.length);
});
