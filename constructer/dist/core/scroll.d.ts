interface ScrollObserverOptions {
    threshold?: number | number[];
    rootMargin?: string;
    onEnter?: (entry: IntersectionObserverEntry) => void;
    onLeave?: (entry: IntersectionObserverEntry) => void;
    onProgress?: (progress: number, entry: IntersectionObserverEntry) => void;
}
export declare function observe(element: HTMLElement | SVGElement, options?: ScrollObserverOptions): {
    destroy: () => void;
};
export declare function scrollAnimate(element: HTMLElement | SVGElement, keyframes: Record<number, Record<string, string>>, options?: {
    start?: string;
    end?: string;
}): {
    destroy: () => void;
};
export declare function parallax(element: HTMLElement | SVGElement, speed?: number): {
    destroy: () => void;
};
export {};
