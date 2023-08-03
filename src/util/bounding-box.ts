import { Size } from './size';
import { Point, centerPoint } from './point';

const boundingBoxForRotatedRectangle = (pos: Point, size: Size, rotate: number): [Point, Point] => {
    const [p1, p2, p3, p4] = fourPointForRotatedRectangle(pos, size, rotate);

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

const fourPointForRotatedRectangle = (pos: Point, size: Size, rotate: number): [Point, Point, Point, Point] => {
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
        bottomLeft,
        bottomRight
    ]
}

export {
    boundingBoxForRotatedRectangle,
    fourPointForRotatedRectangle
}