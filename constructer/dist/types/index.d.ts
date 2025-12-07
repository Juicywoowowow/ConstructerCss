export interface Layer {
    id: string;
    zIndex: number;
    element: SVGElement | HTMLElement;
}
export interface Scene {
    id: string;
    container: HTMLElement;
    layers: Layer[];
}
export interface AnimationStep {
    percent: number;
    properties: Record<string, string | number>;
}
export interface AnimationSequence {
    name: string;
    duration: number;
    easing: string;
    steps: AnimationStep[];
}
export interface SVGPathOptions {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
}
export interface ConstructerConfig {
    autoHydrate?: boolean;
    sceneSelector?: string;
    layerSelector?: string;
}
