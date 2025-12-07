import { SVGPathOptions } from '../types';
export declare class PathBuilder {
    private commands;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    horizontalTo(x: number): this;
    verticalTo(y: number): this;
    curveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): this;
    smoothCurveTo(cx: number, cy: number, x: number, y: number): this;
    quadraticTo(cx: number, cy: number, x: number, y: number): this;
    arc(rx: number, ry: number, rotation: number, largeArc: boolean, sweep: boolean, x: number, y: number): this;
    close(): this;
    polygon(points: Array<[number, number]>): this;
    circle(cx: number, cy: number, r: number): this;
    rect(x: number, y: number, width: number, height: number, rx?: number): this;
    star(cx: number, cy: number, outerR: number, innerR: number, points?: number): this;
    toString(): string;
    build(options?: SVGPathOptions): SVGPathElement;
    clear(): this;
}
export declare function path(): PathBuilder;
