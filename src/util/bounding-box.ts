type BoundingBox = {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

const ZERO_BOX = Object.freeze({ left: 0, right: 0, top: 0, bottom: 0 });

export type {
    BoundingBox
}

export {
    ZERO_BOX
}