import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rotate from '../shape/rotate';
import Rectangle from '../shape/rectangle';
import InteractorStrategy from './interactor-strategy';
import { fourCornerForRotatedRectangle, isRectangleCollide } from '../util/bounding-box';
import { ANCHOR_SIZE, InteractingType, InteractorContext, PADDING } from './item-interactor';
import { Point, addPoints, centerPoint, diffPoints, middlePoint, pointAngle, rotatePoint } from '../util/point';

class SingleSelectInteractorStrategy implements InteractorStrategy {
    drawIndicator(ctx: InteractorContext, items: Item[]): Shape[] {
        const i = items[0];
        return [
            new Rotate({
                anchor: centerPoint(i.pos, i.size), rotate: i.rotate, shapes: [
                    new Rectangle({ pos: { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING }, size: { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) }, borderColor: "#0d6efd" }),
                    new Rectangle({ pos: { x: ctx.topLeft.x - PADDING - 4, y: ctx.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.topRight.x + PADDING - 4, y: ctx.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.bottomLeft.x - PADDING - 4, y: ctx.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.bottomRight.x + PADDING - 4, y: ctx.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Circle({ pos: { x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
                ]
            })
        ];
    }

    checkInteract(ctx: InteractorContext, items: Item[], pos: Point): InteractingType {
        const p = { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING };
        const s = { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) };
        const [topLeft, topRight, bottomRight, bottomLeft] = fourCornerForRotatedRectangle(p, s, items[0].rotate);
        const topCenter = rotatePoint({ x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, centerPoint(ctx.topLeft, ctx.size), items[0].rotate);

        if (topLeft.x - 6 <= pos.x && topLeft.x + 6 >= pos.x && topLeft.y - 6 <= pos.y && topLeft.y + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (topRight.x - 6 <= pos.x && topRight.x + 6 >= pos.x && topRight.y - 6 <= pos.y && topRight.y + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (bottomLeft.x - 6 <= pos.x && bottomLeft.x + 6 >= pos.x && bottomLeft.y - 6 <= pos.y && bottomLeft.y + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (bottomRight.x - 6 <= pos.x && bottomRight.x + 6 >= pos.x && bottomRight.y - 6 <= pos.y && bottomRight.y + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (topCenter.x - 5 <= pos.x && topCenter.x + 5 >= pos.x && topCenter.y - 5 <= pos.y && topCenter.y + 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (isRectangleCollide(ctx.topLeft, ctx.size, items[0].rotate, pos, { w: 1, h: 1 }, 0)) {
            return InteractingType.Body;
        }
        return InteractingType.None;
    }

    interactBody(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
        for (const i of items) {
            i.pos = addPoints(i.pos, delta);
        }
    }

    interactTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const i = items[0];
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
        const delta = diffPoints(pos, ctx.lastPos);
        const rtl = addPoints(topLeft, delta);
        const newCenter = middlePoint(bottomRight, rtl);
        const newTopLeft = rotatePoint(rtl, newCenter, -i.rotate);
        const newBottomRight = rotatePoint(bottomRight, newCenter, -i.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        i.pos = newTopLeft;
        i.size = newSize;
    }

    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const i = items[0];
        const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
        const delta = diffPoints(pos, ctx.lastPos);
        const rtr = addPoints(topRight, delta);
        const newCenter = middlePoint(bottomLeft, rtr);
        const newTopRight = rotatePoint(rtr, newCenter, -i.rotate);
        const newBottomLeft = rotatePoint(bottomLeft, newCenter, -i.rotate);
        const newSize = { w: newTopRight.x - newBottomLeft.x, h: newBottomLeft.y - newTopRight.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        i.pos = { x: newBottomLeft.x, y: newTopRight.y }
        i.size = newSize;
    }

    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const i = items[0];
        const [_topLeft, topRight, _bottomRight, bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
        const delta = diffPoints(pos, ctx.lastPos);
        const rbl = addPoints(bottomLeft, delta);
        const newCenter = middlePoint(topRight, rbl);
        const newTopRight = rotatePoint(topRight, newCenter, -i.rotate);
        const newBottomLeft = rotatePoint(rbl, newCenter, -i.rotate);
        const newSize = { w: newTopRight.x - newBottomLeft.x, h: newBottomLeft.y - newTopRight.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        i.pos = { x: newBottomLeft.x, y: newTopRight.y }
        i.size = newSize;
    }

    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const i = items[0];
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(i.pos, i.size, i.rotate);
        const delta = diffPoints(pos, ctx.lastPos);
        const rbr = addPoints(bottomRight, delta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -i.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -i.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        i.pos = newTopLeft;
        i.size = newSize;
    }

    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void {
        const center = centerPoint(ctx.topLeft, ctx.size);
        const v1 = { x: 0, y: 1 }
        const v2 = diffPoints(center, pos);

        const degree = pointAngle(v1, v2);
        const i = items[0];
        i.rotate = degree;
    }

    inferPosAndSize(ctx: InteractorContext, items: Item[]): InteractorContext {
        if (items.length === 0) return ctx;
        const newCtx = { ...ctx };
        const i = items[0];
        const p1 = i.pos;
        const p2 = { x: i.pos.x + i.size.w, y: i.pos.y + i.size.h };

        newCtx.topLeft = { x: p1.x, y: p1.y };
        newCtx.topRight = { x: p2.x, y: p1.y };
        newCtx.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        newCtx.bottomLeft = { x: p1.x, y: p2.y };
        newCtx.bottomRight = { x: p2.x, y: p2.y };
        newCtx.size = { ...i.size };

        return newCtx;
    }
}

export default SingleSelectInteractorStrategy;