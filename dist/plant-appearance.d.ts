export interface PlantCondition {
    health?: number;
    dry?: boolean;
    leafDamage?: number;
}
export interface PlantAppearance {
    leaf: string;
    youngLeaf: string;
    stem: string;
    vein: string;
    wilt: number;
    damage: number;
    spots: number;
}
/** Missing condition fields preserve the healthy appearance of older display snapshots. */
export declare function plantAppearance(plant: PlantCondition, night?: boolean): PlantAppearance;
/** Holes reveal the scene behind a leaf; no background-colored paint or extra canvas is used. */
export declare function drawLeaf(g: CanvasRenderingContext2D, appearance: PlantAppearance, x: number, y: number, rx: number, ry: number, angle: number, index: number, shape?: 'oval' | 'pointed'): void;
