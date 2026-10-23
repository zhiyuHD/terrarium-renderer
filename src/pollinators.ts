import { plantAppearance, drawLeaf } from './plant-appearance.js';
import type { FlowerPlant } from './types.js';

export function drawMeadowPlant(g: CanvasRenderingContext2D, plant: FlowerPlant & { stage: number; dry: boolean }, x: number, base: number, night: boolean, flowersOnly = false): boolean {
  if (plant.species !== 'daisy' && plant.species !== 'lavender') return false;
  const appearance = plantAppearance(plant, night), height = 15 + plant.stage * 17;
  g.save(); g.translate(x, base); g.lineCap = 'round';
  for (const side of plant.stage > 1 ? [-1, 0, 1] : [0]) {
    const tx = side * 15, top = -height + Math.abs(side) * 12;
    if (!flowersOnly) {
      g.strokeStyle = appearance.stem; g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(tx * .6, top * .5, tx, top); g.stroke();
      for (const direction of [-1, 1]) drawLeaf(g, appearance, tx * .5 + direction * 8, top * .5 + appearance.wilt * 6, plant.species === 'lavender' ? 10 : 12, plant.species === 'lavender' ? 2 : 4, direction * -.5, side + direction + 3, 'pointed');
    }
    if (!plant.flower) continue;
    if (plant.species === 'daisy') {
      if (plant.flower === 'bloom') {
        for (let i = 0; i < 12; i++) {
          const angle = i * Math.PI / 6;
          g.fillStyle = night ? '#d5ddd4' : i % 2 ? '#fffdf0' : '#e5efe8';
          g.beginPath(); g.ellipse(tx + Math.cos(angle) * 9, top + Math.sin(angle) * 9, 7, 2.6, angle, 0, Math.PI * 2); g.fill();
        }
        g.fillStyle = '#e4b34d'; g.beginPath(); g.arc(tx, top, 5, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#f8d678'; g.beginPath(); g.arc(tx - 1, top - 1, 2, 0, Math.PI * 2); g.fill();
      } else {
        g.fillStyle = '#96b77c'; g.beginPath(); g.ellipse(tx, top, 4, 7, -.2, 0, Math.PI * 2); g.fill();
      }
    } else {
      for (let row = 0; row < (plant.flower === 'bloom' ? 6 : 3); row++) for (const direction of [-1, 1]) {
        g.fillStyle = plant.flower === 'bud' ? '#9c96b8' : row % 2 ? '#c6b4e9' : '#9275bb';
        g.beginPath(); g.ellipse(tx + direction * (3.5 - row * .3), top - row * 4, 3, 3.6, direction * .65, 0, Math.PI * 2); g.fill();
      }
    }
  }
  g.restore(); return true;
}

export function drawPollinator(g: CanvasRenderingContext2D, species: string, x: number, y: number, night: boolean): void {
  g.save(); g.translate(x, y);
  if (species === 'butterfly') {
    for (const side of [-1, 1]) {
      g.fillStyle = night ? '#ba937b' : '#e6a06d'; g.strokeStyle = '#65575e'; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(side * 11, -6, 12, 15, side * .5, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = night ? '#9c9eb2' : '#a6bfdb';
      g.beginPath(); g.ellipse(side * 10, 10, 10, 10, -side * .4, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = '#f9dfad'; g.beginPath(); g.arc(side * 14, -7, 4, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#68566a'; g.beginPath(); g.arc(side * 14, -7, 2, 0, Math.PI * 2); g.fill();
    }
  } else {
    g.fillStyle = '#e0f0edcf';
    for (const side of [-1, 1]) { g.beginPath(); g.ellipse(side * 8, -5, 8, 5, -side * .6, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = night ? '#bc995a' : '#e9bf63'; g.beginPath(); g.ellipse(0, 4, 7, 10, 0, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.ellipse(0, 4, 7, 10, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#625647'; g.fillRect(-8, 0, 16, 3); g.fillRect(-8, 7, 16, 3); g.restore();
  }
  g.fillStyle = '#4e4a46'; g.beginPath(); g.ellipse(0, species === 'bee' ? -7 : 2, species === 'bee' ? 5 : 2.5, species === 'bee' ? 5 : 14, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#4e4a46'; g.lineWidth = 1;
  for (const side of [-1, 1]) { g.beginPath(); g.moveTo(side, -10); g.quadraticCurveTo(side * 3, -18, side * 6, -18); g.stroke(); }
  g.restore();
}
