export declare const LAND_SURFACE: {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const WATER_SURFACE: {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function cellPosition(surface: typeof LAND_SURFACE, x: number, y: number, size: number): {
    x: number;
    y: number;
};
export declare function plotPosition(x: number, y: number, size?: number): {
    x: number;
    y: number;
};
export declare function residentScale(size: number): number;
