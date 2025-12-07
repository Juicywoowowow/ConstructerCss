import { AnimationSequence } from '../types';
export declare function createSequence(name: string, duration: number, easing?: string): AnimationSequence;
export declare function addStep(sequence: AnimationSequence, percent: number, properties: Record<string, string | number>): void;
export declare function generateKeyframes(sequence: AnimationSequence): string;
export declare function injectKeyframes(sequence: AnimationSequence): void;
export declare function applyAnimation(element: HTMLElement | SVGElement, sequence: AnimationSequence, options?: {
    delay?: number;
    iterations?: number;
    fill?: string;
}): void;
export declare function getSequence(name: string): AnimationSequence | undefined;
