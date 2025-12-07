interface TextPathOptions {
    fontSize?: string;
    fontFamily?: string;
    fill?: string;
    startOffset?: string;
    textAnchor?: 'start' | 'middle' | 'end';
    letterSpacing?: string;
}
export declare function createTextPath(svg: SVGSVGElement, pathD: string, text: string, options?: TextPathOptions): {
    text: SVGTextElement;
    path: SVGPathElement;
};
export declare function animateTextPath(textPath: SVGTextPathElement, options?: {
    duration?: number;
    from?: string;
    to?: string;
    loop?: boolean;
}): {
    stop: () => void;
};
export declare function circularText(svg: SVGSVGElement, text: string, cx: number, cy: number, radius: number, options?: TextPathOptions): {
    text: SVGTextElement;
    path: SVGPathElement;
};
export declare function wavyText(svg: SVGSVGElement, text: string, startX: number, startY: number, width: number, amplitude?: number, frequency?: number, options?: TextPathOptions): {
    text: SVGTextElement;
    path: SVGPathElement;
};
export {};
