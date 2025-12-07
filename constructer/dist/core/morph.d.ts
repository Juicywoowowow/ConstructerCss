interface MorphOptions {
    duration?: number;
    easing?: string;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
}
export declare function morph(element: SVGPathElement, fromD: string, toD: string, options?: MorphOptions): Promise<void>;
export declare function morphLoop(element: SVGPathElement, paths: string[], options?: MorphOptions & {
    loop?: boolean;
    pauseBetween?: number;
}): {
    stop: () => void;
};
export {};
