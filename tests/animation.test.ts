import { afterEach, expect, it, vi } from 'vitest';
import { createSceneAnimation, setSceneActive, setSceneFrameRate, renderSceneFrame } from '../src/animation.js';
afterEach(() => { vi.unstubAllGlobals(); });
function clock() {
  let id = 0;
  const pending = new Map<number, FrameRequestCallback>();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { pending.set(++id, callback); return id; });
  vi.stubGlobal('cancelAnimationFrame', (key: number) => pending.delete(key));
  return { pending, tick(time: number) { const calls = [...pending.values()]; pending.clear(); for (const call of calls) call(time); } };
}
it('shares one callback between canvases, caps draws, and stops when every canvas is paused', () => {
  const time = clock(), first: number[] = [], second: number[] = [];
  const a = {} as HTMLCanvasElement, b = {} as HTMLCanvasElement;
  const one = createSceneAnimation(a, n => first.push(n)), two = createSceneAnimation(b, n => second.push(n));
  try {
    one.request(); two.request(); expect(time.pending.size).toBe(1);
    time.tick(0); time.tick(16); expect(first).toHaveLength(1); expect(second).toHaveLength(1);
    time.tick(34); expect(first).toHaveLength(2);
    setSceneActive(a, false); time.tick(68); expect(first).toHaveLength(2); expect(second).toHaveLength(3);
    setSceneActive(b, false); expect(time.pending.size).toBe(0);
    setSceneActive(a, true); expect(time.pending.size).toBe(1); time.tick(100); expect(first.at(-1)).toBe(100);
  } finally { one.dispose(); two.dispose(); }
  expect(time.pending.size).toBe(0);
});
it('retains queued state while paused and honors a lower gallery frame rate', () => {
  const time = clock(), canvas = {} as HTMLCanvasElement, drawn: number[] = [];
  let value = 1;
  const scene = createSceneAnimation(canvas, () => drawn.push(value));
  try {
    setSceneFrameRate(canvas, 10); scene.request(); time.tick(0); time.tick(50); expect(drawn).toEqual([1]);
    setSceneActive(canvas, false); value = 2; scene.request(); expect(time.pending.size).toBe(0);
    setSceneActive(canvas, true); time.tick(200); time.tick(250); expect(drawn).toEqual([1, 2]);
    time.tick(300); expect(drawn).toEqual([1, 2, 2]);
  } finally { scene.dispose(); }
});

it('paints a paused preview immediately without scheduling continuous animation', () => {
  const time = clock(), canvas = {} as HTMLCanvasElement, drawn: number[] = [];
  let value = 1;
  const scene = createSceneAnimation(canvas, () => drawn.push(value));
  try {
    setSceneActive(canvas, false); renderSceneFrame(canvas); expect(drawn).toEqual([]);
    scene.request(); renderSceneFrame(canvas);
    expect(drawn).toEqual([1]); expect(time.pending.size).toBe(0);
    value = 2; scene.request(); renderSceneFrame(canvas);
    expect(drawn).toEqual([1, 2]); expect(time.pending.size).toBe(0);
    setSceneActive(canvas, true); time.tick(0); expect(drawn).toEqual([1, 2, 2]);
  } finally { scene.dispose(); }
  renderSceneFrame(canvas); expect(time.pending.size).toBe(0);
});
