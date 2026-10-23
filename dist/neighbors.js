import { drawMeadowPlant } from './pollinators.js';
import { plantAppearance, drawLeaf } from './plant-appearance.js';
/** Distinct silhouettes stay inside a land cell's existing resident scale. */
export function drawNeighborPlant(g, plant, x, base, night, flowersOnly = false) {
    if (drawMeadowPlant(g, plant, x, base, night, flowersOnly))
        return true;
    if (plant.species !== 'sunflower' && plant.species !== 'mint')
        return false;
    const height = 13 + plant.stage * 20;
    g.save();
    g.translate(x, base);
    g.lineCap = 'round';
    const appearance = plantAppearance(plant, night);
    const stem = appearance.stem;
    g.strokeStyle = stem;
    g.lineWidth = 3 + plant.stage;
    if (plant.species === 'sunflower') {
        if (!flowersOnly) {
            g.beginPath();
            g.moveTo(0, 0);
            g.quadraticCurveTo(-4, -height * .5, 0, -height);
            g.stroke();
            for (let i = 0; i <= plant.stage; i++) {
                const side = i % 2 ? -1 : 1, cy = -10 - i * 15;
                drawLeaf(g, appearance, side * 17, cy - 5 + appearance.wilt * 5, 19, 11, -side * (.35 - appearance.wilt * .7), i, 'pointed');
            }
        }
        if (plant.seedHead) {
            g.save();
            g.translate(3, -height + 2);
            g.rotate(.18);
            g.fillStyle = '#ad8744';
            g.beginPath();
            g.arc(0, 0, 19, 0, Math.PI * 2);
            g.fill();
            g.fillStyle = night ? '#544737' : '#6e5036';
            g.beginPath();
            g.arc(0, 0, 15, 0, Math.PI * 2);
            g.fill();
            for (let i = 0; i < 21; i++) {
                const a = i * 2.39996, r = Math.sqrt(i / 21) * 12;
                g.save();
                g.translate(Math.cos(a) * r, Math.sin(a) * r);
                g.rotate(a);
                g.fillStyle = i % 3 ? '#d5bd80' : '#f0dca8';
                g.beginPath();
                g.ellipse(0, 0, 1.5, 2.3, 0, 0, Math.PI * 2);
                g.fill();
                g.restore();
            }
            g.restore();
        }
        else if (plant.flower) {
            g.save();
            g.translate(0, -height);
            if (plant.flower === 'bud') {
                g.fillStyle = '#82a44f';
                g.beginPath();
                g.ellipse(0, 0, 9, 12, -.15, 0, Math.PI * 2);
                g.fill();
                g.strokeStyle = '#b5c878';
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(0, 9);
                g.lineTo(0, -10);
                g.stroke();
            }
            else {
                for (let ring = 0; ring < 2; ring++)
                    for (let i = 0; i < 13; i++) {
                        const a = i * Math.PI * 2 / 13 + ring * .2;
                        g.fillStyle = night ? ['#bea552', '#d2b963'][ring] : ['#e7ab3b', '#f5ca59'][ring];
                        g.beginPath();
                        g.ellipse(Math.cos(a) * 17, Math.sin(a) * 17, 12 - ring * 2, 4.7, a, 0, Math.PI * 2);
                        g.fill();
                    }
                g.fillStyle = '#705036';
                g.beginPath();
                g.arc(0, 0, 12, 0, Math.PI * 2);
                g.fill();
                g.fillStyle = '#b58c50';
                for (let i = 0; i < 13; i++) {
                    const a = i * 2.39996, r = Math.sqrt(i / 13) * 8;
                    g.beginPath();
                    g.arc(Math.cos(a) * r, Math.sin(a) * r, 1, 0, Math.PI * 2);
                    g.fill();
                }
            }
            g.restore();
        }
    }
    else {
        for (const side of plant.stage > 1 ? [-1, 0, 1] : [0]) {
            const top = -height * (side ? .78 : 1), endX = side * 15;
            if (!flowersOnly) {
                g.strokeStyle = stem;
                g.lineWidth = 2.5;
                g.beginPath();
                g.moveTo(0, 0);
                g.quadraticCurveTo(endX, top * .4, endX, top);
                g.stroke();
                for (let level = 0; level <= plant.stage; level++)
                    for (const direction of [-1, 1]) {
                        const cy = -8 + top * (.18 + level * .2), cx = endX * Math.min(1, cy / top * 1.3);
                        const tipX = cx + direction * (13 + plant.stage * 1.5), tipY = cy - 9;
                        drawLeaf(g, appearance, (cx + tipX) / 2, (cy + tipY) / 2 + appearance.wilt * 4, 10 + plant.stage, 6, -direction * (.4 - appearance.wilt * .8), level + (side + 1) * 4 + (direction + 1) / 2, 'pointed');
                    }
            }
            if (plant.flower)
                for (let i = 0; i < 4; i++)
                    for (const direction of [-1, 1]) {
                        g.fillStyle = plant.flower === 'bud' ? '#a79cc1' : night ? '#b8abc9' : '#d4bde5';
                        g.beginPath();
                        g.ellipse(endX + direction * 4, top - i * 5, 3, plant.flower === 'bud' ? 3 : 2, direction * .4, 0, Math.PI * 2);
                        g.fill();
                    }
        }
    }
    g.restore();
    return true;
}
export function drawLadybug(g, x, y, night) {
    g.save();
    g.translate(x, y);
    g.strokeStyle = '#393c37';
    g.lineWidth = 1.5;
    g.lineCap = 'round';
    for (const side of [-1, 1])
        for (const dy of [-5, 0, 5]) {
            g.beginPath();
            g.moveTo(side * 7, dy);
            g.lineTo(side * 12, dy + 3);
            g.stroke();
        }
    g.fillStyle = '#343d36';
    g.beginPath();
    g.ellipse(0, -7, 6, 5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = night ? '#b75642' : '#dc6551';
    g.beginPath();
    g.ellipse(0, 1, 10, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#813f35';
    g.lineWidth = 1.3;
    g.beginPath();
    g.moveTo(0, -8);
    g.lineTo(0, 10);
    g.stroke();
    g.fillStyle = '#343d36';
    for (const [dx, dy, r] of [[-4, -2, 2], [4, -2, 2], [-5, 4, 2.2], [5, 4, 2.2], [0, 7, 1.6]]) {
        g.beginPath();
        g.arc(dx, dy, r, 0, Math.PI * 2);
        g.fill();
    }
    g.fillStyle = '#fff0d3';
    g.beginPath();
    g.ellipse(-4, -4, 2, 3, .6, 0, Math.PI * 2);
    g.fill();
    for (const dx of [-2.5, 2.5]) {
        g.beginPath();
        g.arc(dx, -9, 1.2, 0, Math.PI * 2);
        g.fill();
    }
    g.restore();
}
