type Size = {
    w: number;
    h: number;
}

const ZERO_SIZE: Size = Object.freeze({ w: 0, h: 0 });

const scaleSize = (s: Size, scale: number): Size => {
    return { w: s.w / scale, h: s.h / scale };
}

export type { Size };
export {
    ZERO_SIZE,
    scaleSize,
}