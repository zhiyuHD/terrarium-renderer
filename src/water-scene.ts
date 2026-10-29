import { createSceneAnimation } from './animation.js';
import { drawWaterPlant, drawWaterFish } from './water-residents.js';
import { cellPosition, residentScale, WATER_SURFACE } from './geometry.js';
import { sceneSize, type WaterScene as AquariumFrame } from './types.js';

export function createWaterScene(canvas: HTMLCanvasElement) {
  let state: AquariumFrame | undefined;
  let old = new Map<string, { x: number; y: number }>();
  let movedAt = 0;
  let disposed = false;
  const position = (x: number, y: number) => cellPosition(WATER_SURFACE, x, y, sceneSize(state ?? {}));
  const locations = (now: number) => new Map((state?.fish ?? []).map(fish => {
    const previous = old.get(fish.id) ?? fish;
    const t = Math.min(1, (now - movedAt) / 900);
    return [fish.id, { x: previous.x + (fish.x - previous.x) * t, y: previous.y + (fish.y - previous.y) * t }];
  }));
  const render = (now: number): void => {
    if (disposed || !state) return;
    const g = canvas.getContext('2d');
    if (g) {
      const night = state.phase === 'night';
      const size = sceneSize(state), scale = residentScale(size);
      g.fillStyle = night ? '#102e4b' : '#cbe9f1'; g.fillRect(0, 0, 800, 500);
      const water = g.createLinearGradient(0, 70, 0, 470); water.addColorStop(0, night ? '#174762' : '#71c6db'); water.addColorStop(1, night ? '#153540' : '#4193ac');
      g.fillStyle = water; g.beginPath(); g.roundRect(60, 70, 680, 400, 20); g.fill();
      g.strokeStyle = '#d6f3ed'; g.lineWidth = 7; g.stroke();
      g.fillStyle = '#b8a789'; g.fillRect(66, 435, 668, 27);
      g.font = '16px system-ui'; g.fillStyle = night ? '#def5fa' : '#164257';
      g.fillText(`O₂ ${state.oxygen.toFixed(1)} · ${state.cleanliness.toFixed(1)} / 100`, 72, 42);
      g.lineWidth = 1; g.strokeStyle = '#ffffff25';
      for (let x = 0; x < sceneSize(state); x++) for (let y = 0; y < sceneSize(state); y++) { const p = position(x, y); g.strokeRect(p.x - WATER_SURFACE.width / size / 2, p.y - WATER_SURFACE.height / size / 2, WATER_SURFACE.width / size, WATER_SURFACE.height / size); }
      for (const plant of state.plants) {
        const p = position(plant.x, plant.y);
        g.save(); g.translate(p.x, p.y); g.scale(scale, scale); g.translate(-p.x, -p.y);
        g.translate(p.x, p.y); drawWaterPlant(g, plant, now, night);
        g.restore();
      }
      for (const food of state.food) { const p = position(food.x, food.y); g.fillStyle = '#f4ca77'; for (let i = 0; i < food.portions; i++) { g.beginPath(); g.arc(p.x + (i % 4) * 5 - 8, p.y + Math.floor(i / 4) * 5, 2, 0, Math.PI * 2); g.fill(); } }
      for (const facility of state.facilities ?? []) {
        const p = position(facility.x, facility.y); g.save(); g.translate(p.x, p.y); g.scale(scale, scale); g.translate(-p.x, -p.y); g.globalAlpha = facility.enabled ? 1 : .35;
        if (facility.kind === 'air_stone') {
          g.fillStyle = '#769cad'; g.beginPath(); g.ellipse(p.x, p.y + 12, 15, 7, 0, 0, Math.PI * 2); g.fill();
          if (facility.enabled) for (let i = 0; i < 5; i++) { const rise = (now / 35 + i * 18) % 90; g.strokeStyle = '#d4f8ff99'; g.lineWidth = 1.5; g.beginPath(); g.arc(p.x + Math.sin(i + now / 1200) * 9, p.y - rise, 2 + i % 3, 0, Math.PI * 2); g.stroke(); }
        } else if (facility.kind === 'filter') {
          g.fillStyle = '#547e82'; g.beginPath(); g.roundRect(p.x - 12, p.y - 35, 24, 46, 6); g.fill();
          g.strokeStyle = '#b4e9db'; g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(p.x - 7, p.y - 24 + i * 8); g.lineTo(p.x + 7, p.y - 24 + i * 8); g.stroke(); }
        } else if (facility.kind === 'water_light') {
          g.fillStyle = night ? '#7d8580' : '#f9e6a4'; g.beginPath(); g.roundRect(p.x - 23, p.y - 45, 46, 8, 4); g.fill();
          if (!night && facility.enabled) { g.fillStyle = '#ffffba25'; g.beginPath(); g.moveTo(p.x - 18, p.y - 37); g.lineTo(p.x + 30, p.y + 20); g.lineTo(p.x - 30, p.y + 20); g.closePath(); g.fill(); }
        }
        g.restore();
      }
      for (const [index, egg] of (state.eggs ?? []).entries()) {
        const p = position(egg.x, egg.y);
        g.save(); g.translate(p.x + index % 3 * 7 - 7, p.y + 12); g.scale(scale, scale);
        g.fillStyle = '#f5e7c577'; g.strokeStyle = '#e6efdd'; g.lineWidth = 1;
        g.beginPath(); g.ellipse(0, 0, 5, 6, .2, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = egg.health < 30 ? '#b38f78' : '#9b8663';
        g.beginPath(); g.arc(0, 0, 1.2 + Math.min(1, egg.incubationHours / 4) * 1.5, 0, Math.PI * 2); g.fill();
        g.restore();
      }
      const points = locations(now);
      for (const fish of state.fish) {
        const p = position(points.get(fish.id)!.x, points.get(fish.id)!.y);
        const companions = state.fish.filter(other => other.x === fish.x && other.y === fish.y).map(other => other.id).sort();
        const index = companions.indexOf(fish.id), columns = Math.min(3, companions.length);
        const rows = Math.ceil(companions.length / columns);
        p.x += (index % columns - (Math.min(columns, companions.length - Math.floor(index / columns) * columns) - 1) / 2) * 24 * scale;
        p.y += (Math.floor(index / columns) - (rows - 1) / 2) * Math.min(16 * scale, 24 / rows);
        g.save(); g.translate(p.x, p.y); g.scale(scale, scale); g.translate(-p.x, -p.y);
        g.translate(p.x, p.y); if (fish.juvenile) g.scale(.55, .55); drawWaterFish(g, fish.species, now, night);
        g.restore();
      }
    }
  };
  const animation = createSceneAnimation(canvas, render);
  return {
    setActive(active: boolean) { animation.setActive(active); },
    setState(next: AquariumFrame) {
      if (disposed) return;
      const now = performance.now();
      const current = locations(now);
      if (next.fish.some(fish => { const previous = state?.fish.find(other => other.id === fish.id); return previous && (previous.x !== fish.x || previous.y !== fish.y); })) { old = current; movedAt = now; }
      state = next;
      animation.request();
    },
    dispose() { disposed = true; animation.dispose(); },
  };
}
