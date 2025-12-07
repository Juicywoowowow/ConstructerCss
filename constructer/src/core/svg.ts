import { SVGPathOptions } from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSVG(width: number, height: number): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  return svg;
}

export function createPath(d: string, options: SVGPathOptions = {}): SVGPathElement {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  
  if (options.fill) path.setAttribute('fill', options.fill);
  if (options.stroke) path.setAttribute('stroke', options.stroke);
  if (options.strokeWidth) path.setAttribute('stroke-width', String(options.strokeWidth));
  if (options.opacity !== undefined) path.setAttribute('opacity', String(options.opacity));
  
  return path;
}

export function createGroup(): SVGGElement {
  return document.createElementNS(SVG_NS, 'g');
}

export function createDefs(): SVGDefsElement {
  return document.createElementNS(SVG_NS, 'defs');
}

export function createLinearGradient(
  id: string,
  stops: Array<{ offset: number; color: string; opacity?: number }>
): SVGLinearGradientElement {
  const gradient = document.createElementNS(SVG_NS, 'linearGradient');
  gradient.setAttribute('id', id);
  
  stops.forEach(stop => {
    const stopEl = document.createElementNS(SVG_NS, 'stop');
    stopEl.setAttribute('offset', `${stop.offset}%`);
    stopEl.setAttribute('stop-color', stop.color);
    if (stop.opacity !== undefined) {
      stopEl.setAttribute('stop-opacity', String(stop.opacity));
    }
    gradient.appendChild(stopEl);
  });
  
  return gradient;
}

export function createFilter(id: string): SVGFilterElement {
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.setAttribute('id', id);
  return filter;
}

export function createBlur(stdDeviation: number): SVGFEGaussianBlurElement {
  const blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
  blur.setAttribute('stdDeviation', String(stdDeviation));
  return blur;
}
