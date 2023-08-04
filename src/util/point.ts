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

const downScalePoint = (p1: Point, scale: number): Point => {
    return { x: p1.x / scale, y: p1.y / scale };
}

const upScalePoint = (p1: Point, scale: number): Point => {
    return { x: p1.x * scale, y: p1.y * scale };
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
    return { x: p.x + (s.w / 2), y: p.y + (s.h / 2) };
}

const rotatePoint = (p: Point, anchor: Point, degree: number): Point => {
    const angleRad = degree * (Math.PI / 180);

    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const op = diffPoints(p, anchor);

    return {
        x: op.x * cosA - op.y * sinA + anchor.x,
        y: op.x * sinA + op.y * cosA + anchor.y
    }
}

const pointDistance = (p1: Point, p2: Point): number => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

const pointAngle = (p1: Point, p2: Point): number => {
    const degree = (Math.acos(((p1.x * p2.x) + (p1.y * p2.y)) / (Math.hypot(p1.x, p1.y) * Math.hypot(p2.x, p2.y))) * 180) / Math.PI;
    return (p1.x * p2.y - p1.y * p2.x) >= 0 ? degree : -degree;
}

const pointLength = (p: Point): number => {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

export type {
    Point
}

export {
    ORIGIN,
    diffPoints,
    addPoints,
    downScalePoint,
    upScalePoint,
    middlePoint,
    ensureTopLeftSize,
    isParallel,
    isSameDirection,
    centerPoint,
    rotatePoint,
    pointDistance,
    pointAngle,
    pointLength
}