const SVG_NS = 'http://www.w3.org/2000/svg';

let textPathCounter = 0;

interface TextPathOptions {
  fontSize?: string;
  fontFamily?: string;
  fill?: string;
  startOffset?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  letterSpacing?: string;
}

// Create text that follows a path
export function createTextPath(
  svg: SVGSVGElement,
  pathD: string,
  text: string,
  options: TextPathOptions = {}
): { text: SVGTextElement; path: SVGPathElement } {
  const {
    fontSize = '14px',
    fontFamily = 'inherit',
    fill = '#fff',
    startOffset = '0%',
    textAnchor = 'start',
    letterSpacing = 'normal',
  } = options;
  
  const pathId = `c-textpath-${textPathCounter++}`;
  
  // Create defs if needed
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.prepend(defs);
  }
  
  // Create the path (hidden, just for text to follow)
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('id', pathId);
  path.setAttribute('d', pathD);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'none');
  defs.appendChild(path);
  
  // Create text element
  const textEl = document.createElementNS(SVG_NS, 'text');
  textEl.setAttribute('font-size', fontSize);
  textEl.setAttribute('font-family', fontFamily);
  textEl.setAttribute('fill', fill);
  textEl.setAttribute('letter-spacing', letterSpacing);
  
  // Create textPath
  const textPath = document.createElementNS(SVG_NS, 'textPath');
  textPath.setAttribute('href', `#${pathId}`);
  textPath.setAttribute('startOffset', startOffset);
  textPath.setAttribute('text-anchor', textAnchor);
  textPath.textContent = text;
  
  textEl.appendChild(textPath);
  svg.appendChild(textEl);
  
  return { text: textEl, path };
}

// Animate text along path
export function animateTextPath(
  textPath: SVGTextPathElement,
  options: { duration?: number; from?: string; to?: string; loop?: boolean } = {}
): { stop: () => void } {
  const { duration = 5000, from = '0%', to = '100%', loop = true } = options;
  
  let running = true;
  let startTime = performance.now();
  
  function tick(now: number) {
    if (!running) return;
    
    const elapsed = now - startTime;
    let progress = (elapsed % duration) / duration;
    
    if (!loop && elapsed >= duration) {
      textPath.setAttribute('startOffset', to);
      return;
    }
    
    const fromNum = parseFloat(from);
    const toNum = parseFloat(to);
    const current = fromNum + (toNum - fromNum) * progress;
    
    textPath.setAttribute('startOffset', `${current}%`);
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
  
  return {
    stop: () => { running = false; }
  };
}

// Create circular text
export function circularText(
  svg: SVGSVGElement,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  options: TextPathOptions = {}
): { text: SVGTextElement; path: SVGPathElement } {
  // Create a circular path
  const pathD = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`;
  
  return createTextPath(svg, pathD, text, {
    textAnchor: 'middle',
    startOffset: '25%', // Start at top of circle
    ...options,
  });
}

// Create wavy text
export function wavyText(
  svg: SVGSVGElement,
  text: string,
  startX: number,
  startY: number,
  width: number,
  amplitude: number = 20,
  frequency: number = 2,
  options: TextPathOptions = {}
): { text: SVGTextElement; path: SVGPathElement } {
  // Generate wavy path
  const points: string[] = [`M${startX} ${startY}`];
  const segments = 20;
  
  for (let i = 1; i <= segments; i++) {
    const x = startX + (width / segments) * i;
    const y = startY + Math.sin((i / segments) * Math.PI * frequency * 2) * amplitude;
    points.push(`L${x} ${y}`);
  }
  
  return createTextPath(svg, points.join(' '), text, options);
}
