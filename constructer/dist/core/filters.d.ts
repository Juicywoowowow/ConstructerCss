export declare function blur(amount: number): {
    id: string;
    filter: SVGFilterElement;
};
export declare function dropShadow(dx?: number, dy?: number, blur?: number, color?: string): {
    id: string;
    filter: SVGFilterElement;
};
export declare function glow(amount?: number, color?: string): {
    id: string;
    filter: SVGFilterElement;
};
export declare function colorMatrix(matrix: number[]): {
    id: string;
    filter: SVGFilterElement;
};
export declare const matrices: {
    grayscale: number[];
    sepia: number[];
    invert: number[];
};
export declare function applyFilter(element: SVGElement, filterId: string): void;
export declare function addFilterToSVG(svg: SVGSVGElement, filter: SVGFilterElement): void;
