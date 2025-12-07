import * as logger from '../logger';
import { emit } from './events';

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

// Track mouse/touch input on an element
export function trackInput(element: HTMLElement | SVGElement, options: InputOptions = {}): { destroy: () => void } {
  const state: DragState = {
    isDragging: false,
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  };
  
  let lastTime = 0;
  let lastPoint: Point = { x: 0, y: 0 };
  
  function getPoint(e: MouseEvent | Touch): Point {
    const rect = element.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
  
  function updateVelocity(point: Point, time: number) {
    const dt = time - lastTime;
    if (dt > 0) {
      state.velocity = {
        x: (point.x - lastPoint.x) / dt * 16, // normalize to ~60fps
        y: (point.y - lastPoint.y) / dt * 16,
      };
    }
    lastPoint = point;
    lastTime = time;
  }
  
  function onStart(e: MouseEvent | TouchEvent) {
    const point = 'touches' in e ? getPoint(e.touches[0]) : getPoint(e);
    
    state.isDragging = true;
    state.start = point;
    state.current = point;
    state.delta = { x: 0, y: 0 };
    state.velocity = { x: 0, y: 0 };
    lastPoint = point;
    lastTime = performance.now();
    
    logger.log('Input drag start:', point);
    options.onDragStart?.(state);
    emit('input:dragstart', state);
  }
  
  function onMove(e: MouseEvent | TouchEvent) {
    const point = 'touches' in e ? getPoint(e.touches[0]) : getPoint(e);
    const time = performance.now();
    
    if (state.isDragging) {
      state.current = point;
      state.delta = {
        x: point.x - state.start.x,
        y: point.y - state.start.y,
      };
      updateVelocity(point, time);
      
      options.onDrag?.(state);
      emit('input:drag', state);
    } else {
      options.onHover?.(point);
      emit('input:hover', point);
    }
  }
  
  function onEnd() {
    if (state.isDragging) {
      state.isDragging = false;
      logger.log('Input drag end, velocity:', state.velocity);
      options.onDragEnd?.(state);
      emit('input:dragend', state);
    }
  }
  
  // Mouse events
  element.addEventListener('mousedown', onStart as EventListener);
  window.addEventListener('mousemove', onMove as EventListener);
  window.addEventListener('mouseup', onEnd);
  
  // Touch events
  element.addEventListener('touchstart', onStart as EventListener, { passive: true });
  window.addEventListener('touchmove', onMove as EventListener, { passive: true });
  window.addEventListener('touchend', onEnd);
  
  return {
    destroy: () => {
      element.removeEventListener('mousedown', onStart as EventListener);
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onEnd);
      element.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onEnd);
    }
  };
}

// Fluid drag effect - deforms a path based on drag
export function fluidDrag(
  pathElement: SVGPathElement,
  options: { strength?: number; decay?: number } = {}
): { destroy: () => void } {
  const { strength = 0.3, decay = 0.92 } = options;
  const originalD = pathElement.getAttribute('d') || '';
  
  let offset = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };
  let animating = false;
  
  function animate() {
    if (!animating) return;
    
    // Apply velocity
    offset.x += velocity.x;
    offset.y += velocity.y;
    
    // Decay
    velocity.x *= decay;
    velocity.y *= decay;
    offset.x *= decay;
    offset.y *= decay;
    
    // Apply transform
    pathElement.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    
    // Stop when settled
    if (Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01 && 
        Math.abs(offset.x) < 0.01 && Math.abs(offset.y) < 0.01) {
      pathElement.style.transform = '';
      animating = false;
      return;
    }
    
    requestAnimationFrame(animate);
  }
  
  const tracker = trackInput(pathElement, {
    onDrag: (state) => {
      offset.x = state.delta.x * strength;
      offset.y = state.delta.y * strength;
      pathElement.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    },
    onDragEnd: (state) => {
      velocity.x = state.velocity.x * strength * 0.5;
      velocity.y = state.velocity.y * strength * 0.5;
      animating = true;
      animate();
    }
  });
  
  return tracker;
}
