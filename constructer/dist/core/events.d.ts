type EventCallback = (...args: unknown[]) => void;
export declare function on(event: string, callback: EventCallback): void;
export declare function off(event: string, callback: EventCallback): void;
export declare function emit(event: string, ...args: unknown[]): void;
export declare function once(event: string, callback: EventCallback): void;
export declare function clear(event?: string): void;
export declare const Events: {
    readonly SCENE_CREATED: "scene:created";
    readonly SCENE_DESTROYED: "scene:destroyed";
    readonly LAYER_ADDED: "layer:added";
    readonly ANIMATION_START: "animation:start";
    readonly ANIMATION_END: "animation:end";
    readonly TIMELINE_PLAY: "timeline:play";
    readonly TIMELINE_COMPLETE: "timeline:complete";
};
export {};
