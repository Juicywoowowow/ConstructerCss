import { Scene, Layer } from '../types';

const scenes: Map<string, Scene> = new Map();

export function createScene(container: HTMLElement): Scene {
  const id = container.dataset.cScene || `scene-${scenes.size}`;
  
  const scene: Scene = {
    id,
    container,
    layers: [],
  };
  
  scenes.set(id, scene);
  return scene;
}

export function addLayer(scene: Scene, element: SVGElement | HTMLElement, zIndex: number = 0): Layer {
  const layer: Layer = {
    id: `${scene.id}-layer-${scene.layers.length}`,
    zIndex,
    element,
  };
  
  element.style.position = 'absolute';
  element.style.zIndex = String(zIndex);
  
  scene.layers.push(layer);
  scene.layers.sort((a, b) => a.zIndex - b.zIndex);
  
  scene.container.appendChild(element);
  return layer;
}

export function getScene(id: string): Scene | undefined {
  return scenes.get(id);
}

export function getAllScenes(): Scene[] {
  return Array.from(scenes.values());
}

export function removeScene(id: string): boolean {
  const scene = scenes.get(id);
  if (scene) {
    scene.layers.forEach(layer => layer.element.remove());
    scenes.delete(id);
    return true;
  }
  return false;
}

export function clearScenes(): void {
  scenes.forEach(scene => {
    scene.layers.forEach(layer => layer.element.remove());
  });
  scenes.clear();
}
