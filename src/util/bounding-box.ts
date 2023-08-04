import { Size } from './size';
import { Point, centerPoint } from './point';

const isRectangleCollide = (pos1: Point, size1: Size, rotate1: number, pos2: Point, size2: Size, rotate2: number): boolean => {
    const corner1 = fourCornerForRotatedRectangle(pos1, size1, rotate1);
    const corner2 = fourCornerForRotatedRectangle(pos2, size2, rotate2);

    function getAxes(points: Point[]): Point[] {
        const axes = [];
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            const axis = { x: edge.y, y: -edge.x }; // Perpendicular vector
            const length = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
            axes.push({ x: axis.x / length, y: axis.y / length }); // Normalize
        }
        return axes;
    }

    function projectPointsOntoAxis(points: Point[], axis: Point): [number, number] {
        const minMax = { min: Infinity, max: -Infinity };
        for (let i = 0; i < points.length; i++) {
            const projected = points[i].x * axis.x + points[i].y * axis.y;
            minMax.min = Math.min(minMax.min, projected);
            minMax.max = Math.max(minMax.max, projected);
        }
        return [minMax.max, minMax.min];
    }

    function checkOverlap(proj1Max: number, proj1Min: number, proj2Max: number, proj2Min: number) {
        return proj1Max >= proj2Min && proj2Max >= proj1Min;
    }

    for (let axis of getAxes(corner1).concat(getAxes(corner2))) {
        const [proj1Max, proj1Min] = projectPointsOntoAxis(corner1, axis);
        const [proj2Max, proj2Min] = projectPointsOntoAxis(corner2, axis);

        if (!checkOverlap(proj1Max, proj1Min, proj2Max, proj2Min)) {
            return false; // Separating axis found, no collision
        }
    }

    return true;
}

const boundingBoxForRotatedRectangle = (pos: Point, size: Size, rotate: number): [Point, Point] => {
    const [p1, p2, p3, p4] = fourCornerForRotatedRectangle(pos, size, rotate);

    // Calculate bounding box coordinates
    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return [
        { x: minX, y: minY },
        { x: maxX, y: maxY },
    ]
}

const fourCornerForRotatedRectangle = (pos: Point, size: Size, rotate: number): [Point, Point, Point, Point] => {
    const angleRad = rotate * (Math.PI / 180);
    const halfWidth = size.w / 2;
    const halfHeight = size.h / 2;
    const center = centerPoint(pos, size);

    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    // Calculate rotated corner coordinates
    const topLeft = {
        x: -halfWidth * cosA + halfHeight * sinA + center.x,
        y: -halfWidth * sinA - halfHeight * cosA + center.y
    }

    const topRight = {
        x: halfWidth * cosA + halfHeight * sinA + center.x,
        y: halfWidth * sinA - halfHeight * cosA + center.y
    }

    const bottomLeft = {
        x: -halfWidth * cosA - halfHeight * sinA + center.x,
        y: -halfWidth * sinA + halfHeight * cosA + center.y
    }

    const bottomRight = {
        x: halfWidth * cosA - halfHeight * sinA + center.x,
        y: halfWidth * sinA + halfHeight * cosA + center.y
    }

    // Calculate bounding box coordinates
    return [
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
    ]
}

export {
    boundingBoxForRotatedRectangle,
    fourCornerForRotatedRectangle,
    isRectangleCollide
}