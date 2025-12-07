import * as logger from '../logger';

interface MorphOptions {
  duration?: number;
  easing?: string;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

interface Point {
  x: number;
  y: number;
}

// Convert any path to a series of points for interpolation
function pathToPoints(d: string, numPoints: number = 100): Point[] {
  // Create temporary SVG to measure path
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  document.body.appendChild(svg);
  
  const points: Point[] = [];
  const length = path.getTotalLength();
  
  for (let i = 0; i < numPoints; i++) {
    const point = path.getPointAtLength((i / (numPoints - 1)) * length);
    points.push({ x: point.x, y: point.y });
  }
  
  document.body.removeChild(svg);
  return points;
}

// Convert points back to path d string
function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';
  
  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }
  
  d += ' Z';
  return d;
}

// Interpolate between two point arrays
function lerpPoints(from: Point[], to: Point[], t: number): Point[] {
  const result: Point[] = [];
  const len = Math.min(from.length, to.length);
  
  for (let i = 0; i < len; i++) {
    result.push({
      x: from[i].x + (to[i].x - from[i].x) * t,
      y: from[i].y + (to[i].y - from[i].y) * t,
    });
  }
  
  return result;
}

// Easing functions
function ease(t: number, type: string): number {
  switch (type) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return 1 - (1 - t) * (1 - t);
    case 'ease-in-out':
    default:
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

// Morph between two paths
export function morph(
  element: SVGPathElement,
  fromD: string,
  toD: string,
  options: MorphOptions = {}
): Promise<void> {
  const { duration = 500, easing = 'ease-in-out', onUpdate, onComplete } = options;
  
  logger.log('Morph from:', fromD.substring(0, 50) + '...');
  logger.log('Morph to:', toD.substring(0, 50) + '...');
  
  // Convert paths to normalized point arrays
  const numPoints = 64;
  const fromPoints = pathToPoints(fromD, numPoints);
  const toPoints = pathToPoints(toD, numPoints);
  
  if (fromPoints.length !== toPoints.length) {
    logger.warn('Point count mismatch after normalization');
  }
  
  return new Promise(resolve => {
    const startTime = performance.now();
    
    function tick(now: number) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const t = ease(rawProgress, easing);
      
      const interpolated = lerpPoints(fromPoints, toPoints, t);
      const newD = pointsToPath(interpolated);
      
      element.setAttribute('d', newD);
      onUpdate?.(t);
      
      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Set final path exactly
        element.setAttribute('d', toD);
        onComplete?.();
        resolve();
      }
    }
    
    requestAnimationFrame(tick);
  });
}

// Morph loop between multiple paths
export function morphLoop(
  element: SVGPathElement,
  paths: string[],
  options: MorphOptions & { loop?: boolean; pauseBetween?: number } = {}
): { stop: () => void } {
  const { loop = true, pauseBetween = 500, ...morphOptions } = options;
  let running = true;
  let currentIndex = 0;
  
  async function run() {
    while (running) {
      const from = paths[currentIndex];
      const to = paths[(currentIndex + 1) % paths.length];
      
      await morph(element, from, to, morphOptions);
      
      if (pauseBetween > 0) {
        await new Promise(r => setTimeout(r, pauseBetween));
      }
      
      currentIndex = (currentIndex + 1) % paths.length;
      
      if (!loop && currentIndex === 0) break;
    }
  }
  
  run();
  
  return {
    stop: () => { running = false; }
  };
}
