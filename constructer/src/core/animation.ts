import { AnimationSequence, AnimationStep } from '../types';

const sequences: Map<string, AnimationSequence> = new Map();

export function createSequence(
  name: string,
  duration: number,
  easing: string = 'ease'
): AnimationSequence {
  const sequence: AnimationSequence = {
    name,
    duration,
    easing,
    steps: [],
  };
  
  sequences.set(name, sequence);
  return sequence;
}

export function addStep(sequence: AnimationSequence, percent: number, properties: Record<string, string | number>): void {
  sequence.steps.push({ percent, properties });
  sequence.steps.sort((a, b) => a.percent - b.percent);
}

export function generateKeyframes(sequence: AnimationSequence): string {
  const keyframeRules = sequence.steps
    .map(step => {
      const props = Object.entries(step.properties)
        .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
        .join(' ');
      return `${step.percent}% { ${props} }`;
    })
    .join('\n  ');
  
  return `@keyframes ${sequence.name} {\n  ${keyframeRules}\n}`;
}

export function injectKeyframes(sequence: AnimationSequence): void {
  const styleId = `c-keyframes-${sequence.name}`;
  
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = generateKeyframes(sequence);
  document.head.appendChild(style);
}

export function applyAnimation(
  element: HTMLElement | SVGElement,
  sequence: AnimationSequence,
  options: { delay?: number; iterations?: number; fill?: string } = {}
): void {
  injectKeyframes(sequence);
  
  const { delay = 0, iterations = 1, fill = 'forwards' } = options;
  
  element.style.animation = `${sequence.name} ${sequence.duration}ms ${sequence.easing} ${delay}ms ${iterations} ${fill}`;
}

export function getSequence(name: string): AnimationSequence | undefined {
  return sequences.get(name);
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
