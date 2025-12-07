 import * as logger from '../logger';
import { emit } from './events';

interface ScrollObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
  onProgress?: (progress: number, entry: IntersectionObserverEntry) => void;
}

// Observe element visibility on scroll
export function observe(
  element: HTMLElement | SVGElement,
  options: ScrollObserverOptions = {}
): { destroy: () => void } {
  const { 
    threshold = [0, 0.25, 0.5, 0.75, 1], 
    rootMargin = '0px',
    onEnter,
    onLeave,
    onProgress
  } = options;
  
  let wasIntersecting = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const progress = entry.intersectionRatio;
      
      if (entry.isIntersecting && !wasIntersecting) {
        logger.log('Scroll: element entered view');
        onEnter?.(entry);
        emit('scroll:enter', entry);
      } else if (!entry.isIntersecting && wasIntersecting) {
        logger.log('Scroll: element left view');
        onLeave?.(entry);
        emit('scroll:leave', entry);
      }
      
      wasIntersecting = entry.isIntersecting;
      
      if (entry.isIntersecting) {
        onProgress?.(progress, entry);
        emit('scroll:progress', { progress, entry });
      }
    });
  }, { threshold, rootMargin });
  
  observer.observe(element);
  
  return {
    destroy: () => observer.disconnect()
  };
}

// Scroll-linked animation
export function scrollAnimate(
  element: HTMLElement | SVGElement,
  keyframes: Record<number, Record<string, string>>,
  options: { start?: string; end?: string } = {}
): { destroy: () => void } {
  const { start = 'top bottom', end = 'bottom top' } = options;
  
  function getScrollProgress(): number {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress from 0 (element at bottom of viewport) to 1 (element at top)
    const progress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
    return Math.max(0, Math.min(1, progress));
  }
  
  function interpolateStyles(progress: number): Record<string, string> {
    const sortedKeys = Object.keys(keyframes).map(Number).sort((a, b) => a - b);
    const result: Record<string, string> = {};
    
    // Find surrounding keyframes
    let fromKey = sortedKeys[0];
    let toKey = sortedKeys[sortedKeys.length - 1];
    
    for (let i = 0; i < sortedKeys.length - 1; i++) {
      if (progress >= sortedKeys[i] / 100 && progress <= sortedKeys[i + 1] / 100) {
        fromKey = sortedKeys[i];
        toKey = sortedKeys[i + 1];
        break;
      }
    }
    
    const fromStyles = keyframes[fromKey];
    const toStyles = keyframes[toKey];
    const localProgress = (progress * 100 - fromKey) / (toKey - fromKey || 1);
    
    // Merge all properties
    const allProps = new Set([...Object.keys(fromStyles), ...Object.keys(toStyles)]);
    
    allProps.forEach(prop => {
      const from = fromStyles[prop] || toStyles[prop];
      const to = toStyles[prop] || fromStyles[prop];
      
      // Simple interpolation for numeric values
      const fromNum = parseFloat(from);
      const toNum = parseFloat(to);
      
      if (!isNaN(fromNum) && !isNaN(toNum)) {
        const unit = from.replace(/[\d.-]/g, '');
        result[prop] = `${fromNum + (toNum - fromNum) * localProgress}${unit}`;
      } else {
        result[prop] = localProgress < 0.5 ? from : to;
      }
    });
    
    return result;
  }
  
  function update() {
    const progress = getScrollProgress();
    const styles = interpolateStyles(progress);
    
    Object.entries(styles).forEach(([prop, value]) => {
      (element as HTMLElement).style.setProperty(
        prop.replace(/([A-Z])/g, '-$1').toLowerCase(),
        value
      );
    });
  }
  
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update(); // Initial call
  
  return {
    destroy: () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    }
  };
}

// Parallax effect
export function parallax(
  element: HTMLElement | SVGElement,
  speed: number = 0.5
): { destroy: () => void } {
  function update() {
    const rect = element.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const windowCenter = window.innerHeight / 2;
    const offset = (centerY - windowCenter) * speed;
    
    (element as HTMLElement).style.transform = `translateY(${offset}px)`;
  }
  
  window.addEventListener('scroll', update, { passive: true });
  update();
  
  return {
    destroy: () => {
      window.removeEventListener('scroll', update);
      (element as HTMLElement).style.transform = '';
    }
  };
}
