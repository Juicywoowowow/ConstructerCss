import * as scene from './core/scene';
import * as svg from './core/svg';
import * as animation from './core/animation';
import * as filters from './core/filters';
import * as events from './core/events';
import * as morph from './core/morph';
import * as scroll from './core/scroll';
import * as textPath from './core/text-path';
import * as input from './core/input';
import { path, PathBuilder } from './core/path-builder';
import { timeline, Timeline } from './core/timeline';
import { ConstructerConfig } from './types';

export * from './types';
export { scene, svg, animation, filters, events, morph, scroll, textPath, input, path, PathBuilder, timeline, Timeline };

const defaultConfig: ConstructerConfig = {
  autoHydrate: true,
  sceneSelector: '[data-c-scene]',
  layerSelector: '[data-c-layer]',
};

let config: ConstructerConfig = { ...defaultConfig };

function hydrate(): void {
  const sceneContainers = document.querySelectorAll<HTMLElement>(config.sceneSelector!);
  
  sceneContainers.forEach(container => {
    const sceneInstance = scene.createScene(container);
    
    const layers = container.querySelectorAll<HTMLElement>(config.layerSelector!);
    layers.forEach(layerEl => {
      const z = parseInt(layerEl.dataset.cZ || '0', 10);
      scene.addLayer(sceneInstance, layerEl, z);
    });
  });
}

function configure(userConfig: Partial<ConstructerConfig>): void {
  config = { ...config, ...userConfig };
}

function init(): void {
  if (config.autoHydrate) {
    hydrate();
  }
}

// Auto-init on DOMContentLoaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

const Constructer = {
  hydrate,
  configure,
  init,
  scene,
  svg,
  animation,
  filters,
  events,
  morph,
  scroll,
  textPath,
  input,
  path,
  timeline,
};

export default Constructer;
