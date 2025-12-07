export declare class Timeline {
    private entries;
    private duration;
    private isPlaying;
    private currentTime;
    add(element: HTMLElement | SVGElement, keyframes: Record<number, Record<string, string | number>>, duration: number, options?: {
        offset?: number;
        easing?: string;
        iterations?: number;
        fill?: string;
    }): this;
    stagger(elements: NodeListOf<Element> | HTMLElement[] | SVGElement[], keyframes: Record<number, Record<string, string | number>>, duration: number, staggerDelay: number, options?: {
        easing?: string;
        iterations?: number;
        fill?: string;
    }): this;
    play(): Promise<void>;
    reset(): this;
    getDuration(): number;
    clear(): this;
}
export declare function timeline(): Timeline;
