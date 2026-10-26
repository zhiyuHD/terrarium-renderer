import { plantAppearance, drawLeaf } from './plant-appearance.js';
import { plotPosition } from './geometry.js';
export function drawGardenPlant(g, p, x, base, night, flowersOnly) {
    if (flowersOnly)
        return false;
    if (!['tomato', 'strawberry', 'mushroom', 'fern', 'clover', 'moss', 'basil', 'bean'].includes(p.species))
        return false;
    const a = plantAppearance(p, night), h = 16 + p.stage * 17;
    g.save();
    g.translate(x, base);
    g.lineCap = 'round';
    g.strokeStyle = a.stem;
    g.lineWidth = 2.5;
    if (p.species === 'mushroom') {
        if (!flowersOnly)
            for (const [dx, scale] of [[-12, .65], [8, 1], [20, .5]]) {
                g.save();
                g.translate(dx, 0);
                g.scale(scale, scale);
                g.fillStyle = '#ead8b8';
                g.beginPath();
                g.roundRect(-4, -h, 8, h, 4);
                g.fill();
                g.fillStyle = (p.health ?? 100) < 40 ? '#a18b65' : '#b96f49';
                g.beginPath();
                g.ellipse(0, -h, 19, 12, 0, Math.PI, Math.PI * 2);
                g.quadraticCurveTo(0, -h + 7, -19, -h);
                g.fill();
                g.restore();
            }
    }
    else if (p.species === 'moss') {
        if (!flowersOnly)
            for (let i = 0; i < 9 + p.stage * 3; i++) {
                g.fillStyle = i % 2 ? a.leaf : a.youngLeaf;
                g.beginPath();
                g.ellipse((i % 6 - 2.5) * 8, -Math.floor(i / 6) * 6, 7, 6, 0, 0, Math.PI * 2);
                g.fill();
            }
    }
    else if (p.species === 'fern') {
        if (!flowersOnly)
            for (const side of [-1, 0, 1]) {
                const top = -h * (side ? .75 : 1), end = side * 24;
                g.beginPath();
                g.moveTo(0, 0);
                g.quadraticCurveTo(end, top * .5, end, top);
                g.stroke();
                for (let i = 1; i < 6 + p.stage; i++) {
                    const t = i / (6 + p.stage);
                    for (const d of [-1, 1])
                        drawLeaf(g, a, end * t + d * (12 * (1 - t) + 3), top * t, 12 * (1 - t) + 4, 3, -d * .5, i, 'pointed');
                }
            }
    }
    else if (p.species === 'strawberry' || p.species === 'clover') {
        for (let i = 0; i < 3 + p.stage; i++) {
            const dx = (i % 3 - 1) * 17, dy = -12 - Math.floor(i / 3) * 14;
            if (!flowersOnly) {
                g.beginPath();
                g.moveTo(0, 0);
                g.lineTo(dx, dy);
                g.stroke();
                for (const angle of [-.8, 0, .8])
                    drawLeaf(g, a, dx + Math.sin(angle) * 8, dy - 6, 8, p.species === 'clover' ? 7 : 5, angle, i);
            }
            if (p.species === 'strawberry' && p.fruitReady && i % 2 === 0) {
                g.fillStyle = '#e7685a';
                g.beginPath();
                g.moveTo(dx - 5, dy + 7);
                g.bezierCurveTo(dx - 10, dy + 14, dx, dy + 25, dx, dy + 22);
                g.bezierCurveTo(dx, dy + 25, dx + 10, dy + 14, dx + 5, dy + 7);
                g.fill();
                g.fillStyle = '#ffe2a4';
                for (const [sx, sy] of [[-2, 12], [2, 15], [0, 19]]) {
                    g.beginPath();
                    g.arc(dx + sx, dy + sy, .8, 0, Math.PI * 2);
                    g.fill();
                }
            }
        }
    }
    else {
        if (!flowersOnly) {
            g.beginPath();
            g.moveTo(0, 0);
            g.quadraticCurveTo(7, -h * .5, 0, -h);
            g.stroke();
            for (let i = 0; i < 3 + p.stage; i++) {
                const side = i % 2 ? -1 : 1;
                drawLeaf(g, a, side * 12, -8 - i * h / (4 + p.stage), p.species === 'bean' ? 14 : 11, p.species === 'basil' ? 9 : 5, -side * .5, i, p.species === 'tomato' ? 'pointed' : undefined);
            }
        }
        if (p.species === 'tomato' && p.fruitReady)
            for (const [dx, dy] of [[-9, -h * .55], [11, -h * .8], [-5, -h]]) {
                g.fillStyle = night ? '#b95c43' : '#e5654d';
                g.beginPath();
                g.arc(dx, dy, 7, 0, Math.PI * 2);
                g.fill();
                g.fillStyle = '#72914e';
                g.beginPath();
                g.ellipse(dx, dy - 6, 5, 2, 0, 0, Math.PI * 2);
                g.fill();
            }
    }
    g.restore();
    return true;
}
export function drawGardenGround(g, state, size, night) {
    for (const d of state.decorations ?? []) {
        const p = plotPosition(d.x, d.y, size);
        g.fillStyle = night ? '#787b6b' : d.kind === 'wood_path' ? '#bd976b' : '#c2c1a5';
        for (let i = 0; i < (d.kind === 'pebbles' ? 5 : 3); i++) {
            g.beginPath();
            g.ellipse(p.x + (i % 3 - 1) * 15, p.y + Math.floor(i / 3) * 8, d.kind === 'wood_path' ? 18 : 8, 4, .1 * i, 0, Math.PI * 2);
            g.fill();
        }
    }
    for (const leaf of state.litter ?? []) {
        const p = plotPosition(leaf.x, leaf.y, size);
        g.fillStyle = night ? '#9c8155' : '#c9a16a';
        for (let i = 0; i < Math.min(leaf.portions, 6); i++) {
            g.beginPath();
            g.ellipse(p.x + (i % 3 - 1) * 11, p.y + 4 + Math.floor(i / 3) * 6, 5, 2, i * .7, 0, Math.PI * 2);
            g.fill();
        }
    }
}
export function drawDecomposer(g, species, x, y, night) {
    g.save();
    g.translate(x, y);
    g.fillStyle = night ? '#b7aa8f' : '#d9c8a5';
    g.beginPath();
    g.ellipse(0, 3, 13, 4, 0, 0, Math.PI * 2);
    g.fill();
    if (species === 'snail') {
        g.fillStyle = '#b58c64';
        g.beginPath();
        g.arc(-2, -3, 8, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = '#e3c493';
        g.lineWidth = 1.5;
        g.beginPath();
        for (let i = 0; i < 45; i++) {
            const a = i * .2, r = i * .13;
            g.lineTo(-2 + Math.cos(a) * r, -3 + Math.sin(a) * r);
        }
        g.stroke();
        g.strokeStyle = '#907558';
        for (const dx of [7, 11]) {
            g.beginPath();
            g.moveTo(dx, 1);
            g.lineTo(dx + 1, -6);
            g.stroke();
        }
    }
    else {
        g.fillStyle = '#8a9b9e';
        g.beginPath();
        g.ellipse(0, -1, 11, 7, 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = '#cad2c7';
        for (let dx = -6; dx <= 6; dx += 3) {
            g.beginPath();
            g.moveTo(dx, -6);
            g.lineTo(dx, 4);
            g.stroke();
        }
    }
    g.restore();
}
