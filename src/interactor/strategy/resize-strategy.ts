import Item from '../../item/item';
import { InteractorInfo } from '../item-interactor';
import { fourCornerForRotatedRectangle } from '../../util/bounding-box';
import { ORIGIN, Point, addPoints, diffPoints, middlePoint, rotatePoint, upScalePoint } from '../../util/point';

interface ResizeStrategy {
    resizeTopLeft(info: InteractorInfo, items: Item[], pos: Point): void;
    resizeTopRight(info: InteractorInfo, items: Item[], pos: Point): void;
    resizeBottomLeft(info: InteractorInfo, items: Item[], pos: Point): void;
    resizeBottomRight(info: InteractorInfo, items: Item[], pos: Point): void;
}

class FreeResizeStrategy {
    resizeTopLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.lastPos);
        for (const i of items) {
            const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const rtl = addPoints(topLeft, delta);
            const newCenter = middlePoint(bottomRight, rtl);
            const newTopLeft = rotatePoint(rtl, newCenter, -i.rotate);
            const newBottomRight = rotatePoint(bottomRight, newCenter, -i.rotate);
            const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
            if (newSize.w <= 1 || newSize.h <= 1) return;
            i.setPos(newTopLeft);
            i.setSize(newSize);
        }
    }

    resizeTopRight(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.lastPos);
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const rtr = addPoints(topRight, delta);
            const newCenter = middlePoint(bottomLeft, rtr);
            const newTopRight = rotatePoint(rtr, newCenter, -i.rotate);
            const newBottomLeft = rotatePoint(bottomLeft, newCenter, -i.rotate);
            const newSize = { w: newTopRight.x - newBottomLeft.x, h: newBottomLeft.y - newTopRight.y };
            if (newSize.w <= 1 || newSize.h <= 1) return;
            i.setPos({ x: newBottomLeft.x, y: newTopRight.y });
            i.setSize(newSize);
        }
    }

    resizeBottomLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.lastPos);
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const rbl = addPoints(bottomLeft, delta);
            const newCenter = middlePoint(topRight, rbl);
            const newTopRight = rotatePoint(topRight, newCenter, -i.rotate);
            const newBottomLeft = rotatePoint(rbl, newCenter, -i.rotate);
            const newSize = { w: newTopRight.x - newBottomLeft.x, h: newBottomLeft.y - newTopRight.y };
            if (newSize.w <= 1 || newSize.h <= 1) return;
            i.setPos({ x: newBottomLeft.x, y: newTopRight.y });
            i.setSize(newSize);
        }
    }

    resizeBottomRight(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.lastPos);
        for (const i of items) {
            const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const rbr = addPoints(bottomRight, delta);
            const newCenter = middlePoint(topLeft, rbr);
            const newTopLeft = rotatePoint(topLeft, newCenter, -i.rotate);
            const newBottomRight = rotatePoint(rbr, newCenter, -i.rotate);
            const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
            if (newSize.w <= 1 || newSize.h <= 1) return;
            i.setPos(newTopLeft);
            i.setSize(newSize);
        }
    }
}

class GroupResizeStrategy implements ResizeStrategy {
    resizeTopLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.topLeft);
        const s = (delta.x * (info.size.w / info.size.h)) <= delta.y ? 1 - (delta.x / info.size.w) : 1 - (delta.y / info.size.h);
        const d = { x: info.bottomRight.x - (info.bottomRight.x * s), y: info.bottomRight.y - (info.bottomRight.y * s) };
        if (info.size.w * s < 5 || info.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeTopRight(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.topRight);
        const s = (delta.x * -(info.size.w / info.size.h)) <= delta.y ? 1 + (delta.x / info.size.w) : 1 - (delta.y / info.size.h);
        const d = { x: info.bottomLeft.x - (info.bottomLeft.x * s), y: info.bottomLeft.y - (info.bottomLeft.y * s) };
        if (info.size.w * s < 5 || info.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.bottomLeft);
        const s = (delta.x * -(info.size.w / info.size.h)) > delta.y ? 1 - (delta.x / info.size.w) : 1 + (delta.y / info.size.h);
        const d = { x: info.topRight.x - (info.topRight.x * s), y: info.topRight.y - (info.topRight.y * s) };
        if (info.size.w * s < 5 || info.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomRight(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.bottomRight);
        const s = (delta.x * (info.size.w / info.size.h)) > delta.y ? 1 + (delta.x / info.size.w) : 1 + (delta.y / info.size.h);
        const d = { x: info.topLeft.x - (info.topLeft.x * s), y: info.topLeft.y - (info.topLeft.y * s) };
        if (info.size.w * s < 5 || info.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }
}

// currently for single item select only
class DiagonalResizeStrategy implements ResizeStrategy {
    resizeTopLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        for (const i of items) {
            const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, topLeft), ORIGIN, -i.rotate);
            const s = (delta.x * (info.size.w / info.size.h)) <= delta.y ? 1 - (delta.x / info.size.w) : 1 - (delta.y / info.size.h);
            const d = { x: bottomRight.x - (bottomRight.x * s), y: bottomRight.y - (bottomRight.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeTopRight(info: InteractorInfo, items: Item[], pos: Point): void {
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, topRight), ORIGIN, -i.rotate);
            const s = (delta.x * -(info.size.w / info.size.h)) <= delta.y ? 1 + (delta.x / info.size.w) : 1 - (delta.y / info.size.h);
            const d = { x: bottomLeft.x - (bottomLeft.x * s), y: bottomLeft.y - (bottomLeft.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomLeft(info: InteractorInfo, items: Item[], pos: Point): void {
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, bottomLeft), ORIGIN, -i.rotate);
            const s = (delta.x * -(info.size.w / info.size.h)) > delta.y ? 1 - (delta.x / info.size.w) : 1 + (delta.y / info.size.h);
            const d = { x: topRight.x - (topRight.x * s), y: topRight.y - (topRight.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomRight(info: InteractorInfo, items: Item[], pos: Point): void {
        for (const i of items) {
            const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, bottomRight), ORIGIN, -i.rotate);
            const s = (delta.x * (i.size.w / i.size.h)) > delta.y ? 1 + (delta.x / i.size.w) : 1 + (delta.y / i.size.h);
            const d = { x: topLeft.x - (topLeft.x * s), y: topLeft.y - (topLeft.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }
}

class NoResizeStrategy implements ResizeStrategy {
    resizeTopLeft(info: InteractorInfo, items: Item[], pos: Point): void { }
    resizeTopRight(info: InteractorInfo, items: Item[], pos: Point): void { }
    resizeBottomLeft(info: InteractorInfo, items: Item[], pos: Point): void { }
    resizeBottomRight(info: InteractorInfo, items: Item[], pos: Point): void { }
}

export default ResizeStrategy;
export {
    FreeResizeStrategy,
    GroupResizeStrategy,
    DiagonalResizeStrategy,
    NoResizeStrategy
}