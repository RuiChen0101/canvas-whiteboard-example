import { Size } from './size';

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

const middlePoint = (p1: Point, p2: Point): Point => {
    return { x: ~~((p1.x + p2.x) / 2), y: ~~((p1.y + p2.y) / 2) };
}

const ensureTopLeftSize = (p1: Point, p2: Point): [Point, Size] => {
    const nP1 = { ...p1 };
    const nP2 = { ...p2 };

    if (nP1.x > nP2.x) {
        nP1.x = p2.x;
        nP2.x = p1.x
    }

    if (nP1.y > nP2.y) {
        nP1.y = p2.y;
        nP2.y = p1.y
    }

    return [nP1, { w: nP2.x - nP1.x, h: nP2.y - nP1.y }]
}

const isParallel = (p1: Point, p2: Point): boolean => {
    return (p1.x * p2.y - p1.y * p2.x) === 0;
}

const isSameDirection = (p1: Point, p2: Point): boolean => {
    return (p1.x * p2.x + p1.y * p2.y) >= 0;
}

const centerPoint = (p: Point, s: Size): Point => {
    return { x: p.x + ~~(s.w / 2), y: p.y + ~~(s.h / 2) };
}

const pointDistance = (p1: Point, p2: Point): number => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export type {
    Point
}

export {
    ORIGIN,
    diffPoints,
    addPoints,
    scalePoint,
    middlePoint,
    ensureTopLeftSize,
    isParallel,
    isSameDirection,
    centerPoint,
    pointDistance
}