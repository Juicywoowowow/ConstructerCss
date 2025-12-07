import { AnimationSequence } from '../types';
import { createSequence, addStep, applyAnimation, injectKeyframes } from './animation';

interface TimelineEntry {
  element: HTMLElement | SVGElement;
  sequence: AnimationSequence;
  startTime: number;
  options: { iterations?: number; fill?: string };
}

export class Timeline {
  private entries: TimelineEntry[] = [];
  private duration: number = 0;
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  
  add(
    element: HTMLElement | SVGElement,
    keyframes: Record<number, Record<string, string | number>>,
    duration: number,
    options: { offset?: number; easing?: string; iterations?: number; fill?: string } = {}
  ): this {
    const { offset = this.duration, easing = 'ease', iterations = 1, fill = 'forwards' } = options;
    
    const name = `tl-${Date.now()}-${this.entries.length}`;
    const sequence = createSequence(name, duration, easing);
    
    Object.entries(keyframes).forEach(([percent, props]) => {
      addStep(sequence, parseInt(percent, 10), props);
    });
    
    this.entries.push({
      element,
      sequence,
      startTime: offset,
      options: { iterations, fill },
    });
    
    this.duration = Math.max(this.duration, offset + duration);
    return this;
  }
  
  stagger(
    elements: NodeListOf<Element> | HTMLElement[] | SVGElement[],
    keyframes: Record<number, Record<string, string | number>>,
    duration: number,
    staggerDelay: number,
    options: { easing?: string; iterations?: number; fill?: string } = {}
  ): this {
    const els = Array.from(elements) as (HTMLElement | SVGElement)[];
    els.forEach((el, i) => {
      this.add(el, keyframes, duration, { ...options, offset: this.duration + i * staggerDelay });
    });
    return this;
  }
  
  play(): Promise<void> {
    if (this.isPlaying) return Promise.resolve();
    this.isPlaying = true;
    
    return new Promise(resolve => {
      this.entries.forEach(entry => {
        injectKeyframes(entry.sequence);
        
        setTimeout(() => {
          applyAnimation(entry.element, entry.sequence, {
            delay: 0,
            iterations: entry.options.iterations,
            fill: entry.options.fill,
          });
        }, entry.startTime);
      });
      
      setTimeout(() => {
        this.isPlaying = false;
        resolve();
      }, this.duration);
    });
  }
  
  reset(): this {
    this.entries.forEach(entry => {
      entry.element.style.animation = 'none';
      void (entry.element as HTMLElement).offsetHeight; // Force reflow
    });
    this.currentTime = 0;
    this.isPlaying = false;
    return this;
  }
  
  getDuration(): number {
    return this.duration;
  }
  
  clear(): this {
    this.entries = [];
    this.duration = 0;
    this.currentTime = 0;
    this.isPlaying = false;
    return this;
  }
}

export function timeline(): Timeline {
  return new Timeline();
}
