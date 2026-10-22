import { plantAppearance } from './plant-appearance.js';

interface WaterPlant { species: string; stage: number; health?: number; flower?: 'bud' | 'bloom' }
/** Water plants share health colors while retaining distinct silhouettes. */
export function drawWaterPlant(g: CanvasRenderingContext2D, plant: WaterPlant, now: number, night: boolean): void {
  const appearance = plantAppearance(plant, night), height = 22 + plant.stage * 9;
  const sway = Math.sin(now / 1600) * 2;
  g.strokeStyle = appearance.stem; g.fillStyle = appearance.leaf; g.lineWidth = 2;
  if (plant.species === 'duckweed') {
    for (let i = 0; i < 3 + plant.stage; i++) {
      const x = (i % 3 - 1) * 14 + sway, y = Math.floor(i / 3) * 10 - 8;
      g.strokeStyle = appearance.stem; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sway, y + 15, x - 4, y + 25); g.stroke();
      for (const dx of [-4, 4]) {
        g.fillStyle = dx < 0 ? appearance.leaf : appearance.youngLeaf;
        g.beginPath(); g.ellipse(x + dx, y, 7, 4.5, dx / 20, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = appearance.vein; g.beginPath(); g.arc(x, y - 1, 1, 0, Math.PI * 2); g.fill();
    }
    return;
  }
  if (plant.species === 'waterlily') {
    g.strokeStyle = appearance.stem; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, 22); g.quadraticCurveTo(-8, 0, sway, -height + 22); g.stroke();
    for (const dx of [-13, 12]) {
      g.fillStyle = appearance.leaf;
      g.beginPath(); g.ellipse(dx, -height + 26, 17, 7, dx / 90, .2, Math.PI * 2 - .2); g.lineTo(dx, -height + 26); g.fill();
      g.strokeStyle = appearance.vein; g.lineWidth = .7;
      g.beginPath(); g.moveTo(dx, -height + 26); g.lineTo(dx + 12, -height + 27); g.stroke();
    }
    if (plant.flower) {
      g.save(); g.translate(sway, -height + 18);
      if (plant.flower === 'bloom') for (let i = 0; i < 8; i++) {
        g.save(); g.rotate(i * Math.PI / 4); g.fillStyle = i % 2 ? '#f4d5e4' : '#d991b8';
        g.beginPath(); g.ellipse(0, -6, 3.8, 9, 0, 0, Math.PI * 2); g.fill(); g.restore();
      }
      else { g.fillStyle = '#d99dbb'; g.beginPath(); g.ellipse(0, -3, 4, 8, .15, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#f2d37b'; g.beginPath(); g.arc(0, -1, plant.flower === 'bloom' ? 4 : 2, 0, Math.PI * 2); g.fill(); g.restore();
    }
    return;
  }
  for (let strand = -1; strand <= 1; strand++) {
    const x = strand * 11, top = 22 - height + Math.abs(strand) * 6;
    g.strokeStyle = appearance.stem; g.lineWidth = plant.species === 'algae' ? 4 : 2;
    g.beginPath(); g.moveTo(x, 22); g.quadraticCurveTo(x + strand * 7 + sway, 0, x + sway, top); g.stroke();
    if (plant.species === 'algae') continue;
    for (let y = 14; y > top + 3; y -= 9) {
      g.strokeStyle = appearance.leaf; g.fillStyle = appearance.youngLeaf;
      if (plant.species === 'hornwort') {
        g.lineWidth = 1.4;
        for (let angle = 0; angle < 5; angle++) {
          const dx = Math.cos(angle * Math.PI / 2) * 10;
          g.beginPath(); g.moveTo(x + sway / 2, y); g.lineTo(x + dx + sway, y - 7); g.stroke();
          g.beginPath(); g.moveTo(x + dx * .65 + sway, y - 5); g.lineTo(x + dx * .85 + sway - 2, y - 9); g.stroke();
        }
      } else for (const side of [-1, 1]) {
        g.beginPath(); g.ellipse(x + side * 5 + sway / 2, y - 2, 7, 3, side * -.6, 0, Math.PI * 2); g.fill();
      }
    }
  }
}

export function drawWaterFish(g: CanvasRenderingContext2D, species: string, now: number, night: boolean): void {
  const neon = species === 'neon_tetra', cory = species === 'corydoras';
  const tail = Math.sin(now / 220) * 2, length = species === 'perch' ? 24 : neon ? 17 : 18;
  const color = species === 'goldfish' ? '#f3a545' : species === 'perch' ? '#718f78' : cory ? '#d4c09a' : neon ? '#8dcbd0' : '#b9b3e5';
  g.fillStyle = color;
  g.beginPath(); g.moveTo(-length + 3, 0); g.lineTo(-length - 12, -10 + tail); g.lineTo(-length - 12, 10 + tail); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(0, 0, length, cory ? 9 : neon ? 7 : 11, 0, 0, Math.PI * 2); g.fill();
  if (neon) {
    g.strokeStyle = night ? '#66e5f4' : '#228fae'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-13, -2); g.lineTo(11, -2); g.stroke();
    g.strokeStyle = '#ce5965'; g.beginPath(); g.moveTo(-14, 3); g.lineTo(1, 3); g.stroke();
  } else if (cory) {
    g.fillStyle = '#706655';
    for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(-9 + i * 4, i % 2 ? 3 : -2, 2.5, 2, .2, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = '#e9dfc7'; g.lineWidth = 1;
    for (const dy of [3, 7]) { g.beginPath(); g.moveTo(14, 3); g.quadraticCurveTo(22, dy, 23, dy + 4); g.stroke(); }
    g.fillStyle = '#a79776'; g.beginPath(); g.moveTo(-5, -6); g.lineTo(-1, -16); g.lineTo(6, -5); g.fill();
  } else if (species === 'perch') {
    g.strokeStyle = '#425f59'; g.lineWidth = 2;
    for (const x of [-10, -3, 4]) { g.beginPath(); g.moveTo(x, -8); g.lineTo(x - 2, 7); g.stroke(); }
  } else if (species === 'goldfish') {
    g.fillStyle = '#ffd285'; g.beginPath(); g.ellipse(-1, 5, 8, 3, .25, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = '#172e38'; g.beginPath(); g.arc(neon ? 11 : 10, -3, 2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ffffffba'; g.beginPath(); g.arc(neon ? 11.5 : 10.5, -3.5, .6, 0, Math.PI * 2); g.fill();
}
