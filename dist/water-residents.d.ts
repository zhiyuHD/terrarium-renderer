interface WaterPlant {
    species: string;
    stage: number;
    health?: number;
    flower?: 'bud' | 'bloom';
}
/** Water plants share health colors while retaining distinct silhouettes. */
export declare function drawWaterPlant(g: CanvasRenderingContext2D, plant: WaterPlant, now: number, night: boolean): void;
export declare function drawWaterFish(g: CanvasRenderingContext2D, species: string, now: number, night: boolean): void;
export {};
