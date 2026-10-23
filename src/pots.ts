import type { Position } from './types.js';

const finishes: Record<string, { body: string; rim: string; motif: string }> = {
  clay: { body: '#bc7350', rim: '#e3a47a', motif: 'lines' },
  porcelain: { body: '#79aaa0', rim: '#b8d8c8', motif: 'leaf' },
  spring: { body: '#b4b968', rim: '#e1df9a', motif: 'sun' },
  slow: { body: '#b99bba', rim: '#dfc4dc', motif: 'rings' },
  still: { body: '#819eb7', rim: '#c1dce2', motif: 'pause' },
  reservoir: { body: '#5c9da8', rim: '#9dcdd0', motif: 'drop' },
  drainage: { body: '#b59a72', rim: '#dfc6a0', motif: 'dots' },
  shade: { body: '#647e69', rim: '#b0bea0', motif: 'leaf' },
  sun: { body: '#d2a75a', rim: '#f1d596', motif: 'sun' },
  healing: { body: '#ad7c8c', rim: '#e2b7bc', motif: 'cross' },
};
/** The scene supplies the pot kind; its game effects belong to the caller. */
export function drawPot(g: CanvasRenderingContext2D, pot: Position & { kind: string }, x: number, y: number, scale: number, night: boolean): void {
  const f = finishes[pot.kind]; if (!f) return;
  g.save(); g.translate(x, y); g.scale(scale, scale);
  g.fillStyle = '#222a252b'; g.beginPath(); g.ellipse(0, 10, 24, 7, 0, 0, Math.PI * 2); g.fill();
  g.globalAlpha = night ? .8 : 1;
  g.fillStyle = f.body; g.beginPath(); g.moveTo(-23, -4); g.lineTo(-17, 20); g.quadraticCurveTo(0, 27, 17, 20); g.lineTo(23, -4); g.closePath(); g.fill();
  g.fillStyle = f.rim; g.beginPath(); g.roundRect(-26, -9, 52, 11, 4); g.fill();
  g.fillStyle = '#594637'; g.beginPath(); g.ellipse(0, -6, 21, 3.5, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = f.rim; g.fillStyle = f.rim; g.lineWidth = 2; g.lineCap = 'round';
  g.translate(0, 11); g.beginPath();
  switch (f.motif) {
    case 'pause': g.moveTo(-4, -5); g.lineTo(-4, 5); g.moveTo(4, -5); g.lineTo(4, 5); break;
    case 'cross': g.moveTo(-5, 0); g.lineTo(5, 0); g.moveTo(0, -5); g.lineTo(0, 5); break;
    case 'leaf': g.moveTo(-6, 4); g.quadraticCurveTo(-7, -8, 7, -5); g.quadraticCurveTo(8, 5, -6, 4); g.moveTo(-5, 3); g.lineTo(4, -3); break;
    case 'drop': g.moveTo(0, -7); g.bezierCurveTo(-11, 3, -3, 8, 0, 6); g.bezierCurveTo(5, 6, 8, 1, 0, -7); break;
    case 'sun': g.arc(0, 0, 4, 0, Math.PI * 2); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.moveTo(Math.cos(a) * 7, Math.sin(a) * 7); g.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); } break;
    case 'rings': g.ellipse(0, 0, 8, 3, -.5, 0, Math.PI * 2); g.moveTo(4, 0); g.ellipse(0, 0, 4, 6, -.5, 0, Math.PI * 2); break;
    case 'dots': for (const dx of [-8, 0, 8]) { g.moveTo(dx + 1.5, 0); g.arc(dx, 0, 1.5, 0, Math.PI * 2); } break;
    default: g.moveTo(-13, -2); g.lineTo(13, -2); g.moveTo(-11, 4); g.lineTo(11, 4);
  }
  g.stroke(); g.restore();
}
