interface Point {
    x: number;
    y: number;
}
interface DragState {
    isDragging: boolean;
    start: Point;
    current: Point;
    delta: Point;
    velocity: Point;
}
interface InputOptions {
    onDragStart?: (state: DragState) => void;
    onDrag?: (state: DragState) => void;
    onDragEnd?: (state: DragState) => void;
    onHover?: (point: Point) => void;
}
export declare function trackInput(element: HTMLElement | SVGElement, options?: InputOptions): {
    destroy: () => void;
};
export declare function fluidDrag(pathElement: SVGPathElement, options?: {
    strength?: number;
    decay?: number;
}): {
    destroy: () => void;
};
export {};
