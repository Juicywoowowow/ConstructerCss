type EventCallback = (...args: unknown[]) => void;

const listeners: Map<string, Set<EventCallback>> = new Map();

export function on(event: string, callback: EventCallback): void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)!.add(callback);
}

export function off(event: string, callback: EventCallback): void {
  listeners.get(event)?.delete(callback);
}

export function emit(event: string, ...args: unknown[]): void {
  listeners.get(event)?.forEach(cb => cb(...args));
}

export function once(event: string, callback: EventCallback): void {
  const wrapper = (...args: unknown[]) => {
    off(event, wrapper);
    callback(...args);
  };
  on(event, wrapper);
}

export function clear(event?: string): void {
  if (event) {
    listeners.delete(event);
  } else {
    listeners.clear();
  }
}

// Built-in events
export const Events = {
  SCENE_CREATED: 'scene:created',
  SCENE_DESTROYED: 'scene:destroyed',
  LAYER_ADDED: 'layer:added',
  ANIMATION_START: 'animation:start',
  ANIMATION_END: 'animation:end',
  TIMELINE_PLAY: 'timeline:play',
  TIMELINE_COMPLETE: 'timeline:complete',
} as const;
