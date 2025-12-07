import { SVGPathOptions } from '../types';
export declare function createSVG(width: number, height: number): SVGSVGElement;
export declare function createPath(d: string, options?: SVGPathOptions): SVGPathElement;
export declare function createGroup(): SVGGElement;
export declare function createDefs(): SVGDefsElement;
export declare function createLinearGradient(id: string, stops: Array<{
    offset: number;
    color: string;
    opacity?: number;
}>): SVGLinearGradientElement;
export declare function createFilter(id: string): SVGFilterElement;
export declare function createBlur(stdDeviation: number): SVGFEGaussianBlurElement;
