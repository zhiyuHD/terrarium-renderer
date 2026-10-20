export const LAND_SURFACE = { x: 84, y: 204, width: 632, height: 216 };
export const WATER_SURFACE = { x: 90, y: 128, width: 620, height: 286 };
export function cellPosition(surface, x, y, size) {
    return { x: surface.x + (x + .5) * surface.width / size, y: surface.y + (y + .5) * surface.height / size };
}
export function plotPosition(x, y, size = 5) {
    return cellPosition(LAND_SURFACE, x, y, size);
}
export function residentScale(size) {
    return 5 / size;
}
