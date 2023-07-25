type Point = {
    x: number;
    y: number;
};

const ORIGIN = Object.freeze({ x: 0, y: 0 });

const diffPoints = (p1: Point, p2: Point): Point => {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}

const addPoints = (p1: Point, p2: Point): Point => {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}

const scalePoint = (p1: Point, scale: number): Point => {
    return { x: p1.x / scale, y: p1.y / scale };
}

export type {
    Point
}

export {
    ORIGIN,
    diffPoints,
    addPoints,
    scalePoint
}