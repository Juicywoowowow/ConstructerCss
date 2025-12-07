import { Scene, Layer } from '../types';
export declare function createScene(container: HTMLElement): Scene;
export declare function addLayer(scene: Scene, element: SVGElement | HTMLElement, zIndex?: number): Layer;
export declare function getScene(id: string): Scene | undefined;
export declare function getAllScenes(): Scene[];
export declare function removeScene(id: string): boolean;
export declare function clearScenes(): void;
