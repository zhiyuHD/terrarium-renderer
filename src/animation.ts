interface Animation {
  draw(now: number): void;
  interval: number;
  last: number;
}
const animations = new Set<Animation>();
const controls = new WeakMap<HTMLCanvasElement, ReturnType<typeof createSceneAnimation>>();
let frame = 0;
function schedule(): void {
  if (!frame && animations.size) frame = requestAnimationFrame(render);
}
function render(now: number): void {
  frame = 0;
  for (const animation of animations) {
    const elapsed = now - animation.last;
    if (elapsed + .01 < animation.interval) continue;
    animation.last = Number.isFinite(elapsed) ? now - elapsed % animation.interval : now;
    try { animation.draw(now); }
    catch (error) {
      animations.delete(animation);
      setTimeout(() => { throw error; }, 0);
    }
  }
  schedule();
}
function remove(animation: Animation): void {
  animations.delete(animation);
  if (!animations.size && frame) { cancelAnimationFrame(frame); frame = 0; }
}

/** Visible canvases share one frame callback; pausing the last one stops scheduling. */
export function createSceneAnimation(canvas: HTMLCanvasElement, draw: (now: number) => void) {
  const animation: Animation = { draw, interval: 1000 / 30, last: -Infinity };
  let active = true, ready = false, disposed = false;
  const control = {
    request() {
      if (disposed) return;
      ready = true; animation.last = -Infinity;
      if (active) { animations.add(animation); schedule(); }
    },
    setActive(value: boolean) {
      if (disposed || active === value) return;
      active = value;
      if (active && ready) { animation.last = -Infinity; animations.add(animation); schedule(); }
      else remove(animation);
    },
    drawOnce() {
      if (disposed || !ready) return;
      animation.last = performance.now();
      animation.draw(animation.last);
    },
    setFrameRate(fps: number) {
      if (!Number.isFinite(fps) || fps < 1 || fps > 60) throw new RangeError('Frame rate must be between 1 and 60');
      animation.interval = 1000 / fps;
    },
    dispose() { disposed = true; remove(animation); controls.delete(canvas); },
  };
  controls.set(canvas, control);
  return control;
}
export function setSceneActive(canvas: HTMLCanvasElement, active: boolean): void { controls.get(canvas)?.setActive(active); }
export function setSceneFrameRate(canvas: HTMLCanvasElement, fps: number): void { controls.get(canvas)?.setFrameRate(fps); }

/** Paint current state without starting or resuming its animation loop. */
export function renderSceneFrame(canvas: HTMLCanvasElement): void { controls.get(canvas)?.drawOnce(); }
