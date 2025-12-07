import { createPath } from './svg';
import { SVGPathOptions } from '../types';
import * as logger from '../logger';

export class PathBuilder {
  private commands: string[] = [];
  
  moveTo(x: number, y: number): this {
    this.commands.push(`M${x} ${y}`);
    return this;
  }
  
  lineTo(x: number, y: number): this {
    this.commands.push(`L${x} ${y}`);
    return this;
  }
  
  horizontalTo(x: number): this {
    this.commands.push(`H${x}`);
    return this;
  }
  
  verticalTo(y: number): this {
    this.commands.push(`V${y}`);
    return this;
  }
  
  curveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): this {
    this.commands.push(`C${cx1} ${cy1} ${cx2} ${cy2} ${x} ${y}`);
    return this;
  }
  
  smoothCurveTo(cx: number, cy: number, x: number, y: number): this {
    this.commands.push(`S${cx} ${cy} ${x} ${y}`);
    return this;
  }
  
  quadraticTo(cx: number, cy: number, x: number, y: number): this {
    this.commands.push(`Q${cx} ${cy} ${x} ${y}`);
    return this;
  }
  
  arc(rx: number, ry: number, rotation: number, largeArc: boolean, sweep: boolean, x: number, y: number): this {
    this.commands.push(`A${rx} ${ry} ${rotation} ${largeArc ? 1 : 0} ${sweep ? 1 : 0} ${x} ${y}`);
    return this;
  }
  
  close(): this {
    this.commands.push('Z');
    return this;
  }
  
  // Shapes
  polygon(points: Array<[number, number]>): this {
    if (points.length < 3) return this;
    this.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i][0], points[i][1]);
    }
    return this.close();
  }
  
  circle(cx: number, cy: number, r: number): this {
    return this
      .moveTo(cx - r, cy)
      .arc(r, r, 0, true, true, cx + r, cy)
      .arc(r, r, 0, true, true, cx - r, cy);
  }
  
  rect(x: number, y: number, width: number, height: number, rx: number = 0): this {
    if (rx > 0) {
      return this
        .moveTo(x + rx, y)
        .horizontalTo(x + width - rx)
        .arc(rx, rx, 0, false, true, x + width, y + rx)
        .verticalTo(y + height - rx)
        .arc(rx, rx, 0, false, true, x + width - rx, y + height)
        .horizontalTo(x + rx)
        .arc(rx, rx, 0, false, true, x, y + height - rx)
        .verticalTo(y + rx)
        .arc(rx, rx, 0, false, true, x + rx, y);
    }
    return this.polygon([[x, y], [x + width, y], [x + width, y + height], [x, y + height]]);
  }
  
  star(cx: number, cy: number, outerR: number, innerR: number, points: number = 5): this {
    const step = Math.PI / points;
    const coords: Array<[number, number]> = [];
    
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      coords.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    
    return this.polygon(coords);
  }
  
  // Output
  toString(): string {
    return this.commands.join(' ');
  }
  
  build(options: SVGPathOptions = {}): SVGPathElement {
    const d = this.toString();
    logger.log('PathBuilder generated:', d);
    return createPath(d, options);
  }
  
  clear(): this {
    this.commands = [];
    return this;
  }
}

export function path(): PathBuilder {
  return new PathBuilder();
}
