import Item from '../item/item';
import { InteractorContext } from './item-interactor';
import { fourCornerForRotatedRectangle } from '../util/bounding-box';
import { ORIGIN, Point, addPoints, centerPoint, diffPoints, middlePoint, rotatePoint, upScalePoint } from '../util/point';

interface ResizeStrategy {
    resizeTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    resizeTopRight(ctx: InteractorContext, items: Item[], pos: Point): void;
    resizeBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    resizeBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void;
}

class FreeResizeStrategy {
    resizeTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
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

    resizeTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
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

    resizeBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
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

    resizeBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
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
    resizeTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.topLeft);
        const s = (delta.x * (ctx.size.w / ctx.size.h)) <= delta.y ? 1 - (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
        const d = { x: ctx.bottomRight.x - (ctx.bottomRight.x * s), y: ctx.bottomRight.y - (ctx.bottomRight.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.topRight);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) <= delta.y ? 1 + (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
        const d = { x: ctx.bottomLeft.x - (ctx.bottomLeft.x * s), y: ctx.bottomLeft.y - (ctx.bottomLeft.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomLeft);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) > delta.y ? 1 - (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topRight.x - (ctx.topRight.x * s), y: ctx.topRight.y - (ctx.topRight.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomRight);
        const s = (delta.x * (ctx.size.w / ctx.size.h)) > delta.y ? 1 + (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topLeft.x - (ctx.topLeft.x * s), y: ctx.topLeft.y - (ctx.topLeft.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }
}

// currently for single item select only
class DiagonalResizeStrategy implements ResizeStrategy {
    resizeTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        for (const i of items) {
            const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, topLeft), ORIGIN, -i.rotate);
            const s = (delta.x * (ctx.size.w / ctx.size.h)) <= delta.y ? 1 - (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
            const d = { x: bottomRight.x - (bottomRight.x * s), y: bottomRight.y - (bottomRight.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, topRight), ORIGIN, -i.rotate);
            const s = (delta.x * -(ctx.size.w / ctx.size.h)) <= delta.y ? 1 + (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
            const d = { x: bottomLeft.x - (bottomLeft.x * s), y: bottomLeft.y - (bottomLeft.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        for (const i of items) {
            const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
            const delta = rotatePoint(diffPoints(pos, bottomLeft), ORIGIN, -i.rotate);
            const s = (delta.x * -(ctx.size.w / ctx.size.h)) > delta.y ? 1 - (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
            const d = { x: topRight.x - (topRight.x * s), y: topRight.y - (topRight.y * s) };
            if (i.size.w * s < 5 || i.size.h * s < 5) return;
            i.setPos(addPoints(upScalePoint(i.pos, s), d));
            i.setSize({ w: i.size.w * s, h: i.size.h * s });
        }
    }

    resizeBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
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
    resizeTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void { }
    resizeTopRight(ctx: InteractorContext, items: Item[], pos: Point): void { }
    resizeBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void { }
    resizeBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void { }
}

export default ResizeStrategy;
export {
    FreeResizeStrategy,
    GroupResizeStrategy,
    DiagonalResizeStrategy,
    NoResizeStrategy
}