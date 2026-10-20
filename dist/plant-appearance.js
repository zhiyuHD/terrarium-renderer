function blend(from, to, amount) {
    const color = (hex, offset) => Number.parseInt(hex.slice(offset, offset + 2), 16);
    return '#' + [1, 3, 5].map(offset => Math.round(color(from, offset) * (1 - amount) + color(to, offset) * amount).toString(16).padStart(2, '0')).join('');
}
/** Missing condition fields preserve the healthy appearance of older display snapshots. */
export function plantAppearance(plant, night = false) {
    const stress = 1 - (plant.health ?? 100) / 100;
    const yellow = Math.min(1, stress / .65), brown = Math.max(0, (stress - .6) / .4);
    const age = (healthy, faded) => blend(blend(healthy, faded, yellow), '#826345', brown);
    return {
        leaf: age(night ? '#527d59' : '#65a96a', night ? '#a49b55' : '#c6b258'),
        youngLeaf: age(night ? '#65936a' : '#85bf7e', night ? '#b1a569' : '#d2c47d'),
        stem: age(night ? '#456743' : '#417e4c', '#94834e'),
        vein: age(night ? '#88aa7d' : '#c0d69b', '#e3d0a0'),
        wilt: Math.min(1, (plant.dry ? .55 : 0) + stress * .5),
        damage: plant.leafDamage ?? 0,
        spots: stress > .2 ? Math.min(4, Math.ceil((stress - .2) * 5)) : 0,
    };
}
/** Holes reveal the scene behind a leaf; no background-colored paint or extra canvas is used. */
export function drawLeaf(g, appearance, x, y, rx, ry, angle, index, shape = 'oval') {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    const outline = () => {
        g.beginPath();
        if (shape === 'oval')
            g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        else {
            g.moveTo(-rx, 0);
            g.bezierCurveTo(-rx * .4, -ry * 1.4, rx * .65, -ry, rx, 0);
            g.quadraticCurveTo(-rx * .1, ry * 1.45, -rx, 0);
            g.closePath();
        }
    };
    outline();
    const holes = Math.max(0, Math.min(3, Math.ceil(appearance.damage / 30) - index % 3));
    if (holes) {
        g.clip();
        outline();
        for (let i = 0; i < holes; i++) {
            const hx = rx * [-.25, .22, .82][i], hy = ry * [.16, -.2, .25][i];
            const radius = Math.min(rx, ry) * (.2 + appearance.damage / 700);
            g.moveTo(hx + radius, hy);
            g.arc(hx, hy, radius, 0, Math.PI * 2);
        }
    }
    g.fillStyle = index % 2 ? appearance.leaf : appearance.youngLeaf;
    g.fill('evenodd');
    if (holes || appearance.spots)
        g.clip('evenodd');
    g.strokeStyle = appearance.vein;
    g.lineWidth = .8;
    g.beginPath();
    g.moveTo(-rx * .7, 0);
    g.quadraticCurveTo(0, -ry * .12, rx * .65, 0);
    g.stroke();
    for (let i = 0; i < appearance.spots; i++) {
        g.fillStyle = i % 2 ? '#8e794b' : '#d3bb68';
        g.beginPath();
        g.ellipse(rx * [-.38, .35, -.05, .5][i], ry * [.35, -.3, -.45, .25][i], Math.max(1, rx * .12), Math.max(.8, ry * .18), i * .7, 0, Math.PI * 2);
        g.fill();
    }
    g.restore();
}
