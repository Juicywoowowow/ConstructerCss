const SVG_NS = 'http://www.w3.org/2000/svg';

let filterCounter = 0;

function createFilterElement(id: string): SVGFilterElement {
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.setAttribute('id', id);
  return filter;
}

function getOrCreateDefs(svg: SVGSVGElement): SVGDefsElement {
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.prepend(defs);
  }
  return defs;
}

export function blur(amount: number): { id: string; filter: SVGFilterElement } {
  const id = `c-blur-${filterCounter++}`;
  const filter = createFilterElement(id);
  
  const feBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
  feBlur.setAttribute('stdDeviation', String(amount));
  feBlur.setAttribute('in', 'SourceGraphic');
  filter.appendChild(feBlur);
  
  return { id, filter };
}

export function dropShadow(
  dx: number = 2,
  dy: number = 2,
  blur: number = 4,
  color: string = 'rgba(0,0,0,0.5)'
): { id: string; filter: SVGFilterElement } {
  const id = `c-shadow-${filterCounter++}`;
  const filter = createFilterElement(id);
  
  const feDropShadow = document.createElementNS(SVG_NS, 'feDropShadow');
  feDropShadow.setAttribute('dx', String(dx));
  feDropShadow.setAttribute('dy', String(dy));
  feDropShadow.setAttribute('stdDeviation', String(blur));
  feDropShadow.setAttribute('flood-color', color);
  filter.appendChild(feDropShadow);
  
  return { id, filter };
}

export function glow(amount: number = 4, color: string = '#fff'): { id: string; filter: SVGFilterElement } {
  const id = `c-glow-${filterCounter++}`;
  const filter = createFilterElement(id);
  
  // Blur the source
  const feBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
  feBlur.setAttribute('stdDeviation', String(amount));
  feBlur.setAttribute('in', 'SourceGraphic');
  feBlur.setAttribute('result', 'blur');
  filter.appendChild(feBlur);
  
  // Colorize
  const feFlood = document.createElementNS(SVG_NS, 'feFlood');
  feFlood.setAttribute('flood-color', color);
  feFlood.setAttribute('result', 'color');
  filter.appendChild(feFlood);
  
  // Composite
  const feComposite = document.createElementNS(SVG_NS, 'feComposite');
  feComposite.setAttribute('in', 'color');
  feComposite.setAttribute('in2', 'blur');
  feComposite.setAttribute('operator', 'in');
  feComposite.setAttribute('result', 'glow');
  filter.appendChild(feComposite);
  
  // Merge with original
  const feMerge = document.createElementNS(SVG_NS, 'feMerge');
  const feMergeGlow = document.createElementNS(SVG_NS, 'feMergeNode');
  feMergeGlow.setAttribute('in', 'glow');
  const feMergeSource = document.createElementNS(SVG_NS, 'feMergeNode');
  feMergeSource.setAttribute('in', 'SourceGraphic');
  feMerge.appendChild(feMergeGlow);
  feMerge.appendChild(feMergeSource);
  filter.appendChild(feMerge);
  
  return { id, filter };
}

export function colorMatrix(matrix: number[]): { id: string; filter: SVGFilterElement } {
  const id = `c-matrix-${filterCounter++}`;
  const filter = createFilterElement(id);
  
  const feMatrix = document.createElementNS(SVG_NS, 'feColorMatrix');
  feMatrix.setAttribute('type', 'matrix');
  feMatrix.setAttribute('values', matrix.join(' '));
  filter.appendChild(feMatrix);
  
  return { id, filter };
}

// Preset matrices
export const matrices = {
  grayscale: [
    0.33, 0.33, 0.33, 0, 0,
    0.33, 0.33, 0.33, 0, 0,
    0.33, 0.33, 0.33, 0, 0,
    0, 0, 0, 1, 0
  ],
  sepia: [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
    0, 0, 0, 1, 0
  ],
  invert: [
    -1, 0, 0, 0, 1,
    0, -1, 0, 0, 1,
    0, 0, -1, 0, 1,
    0, 0, 0, 1, 0
  ],
};

export function applyFilter(element: SVGElement, filterId: string): void {
  element.setAttribute('filter', `url(#${filterId})`);
}

export function addFilterToSVG(svg: SVGSVGElement, filter: SVGFilterElement): void {
  const defs = getOrCreateDefs(svg);
  defs.appendChild(filter);
}
