import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rotate from '../shape/rotate';
import Rectangle from '../shape/rectangle';
import InteractorStrategy from './interactor-strategy';
import { ANCHOR_SIZE, InteractingType, InteractorContext, PADDING } from './item-interactor';
import { Point, addPoints, centerPoint, diffPoints, pointAngle, rotatePoint } from '../util/point';
import { fourCornerForRotatedRectangle } from '../util/bounding-box';

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
        // console.log(topCenter, pos);


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
        if (topLeft.x <= pos.x && topLeft.y <= pos.y && bottomRight.x >= pos.x && bottomRight.y >= pos.y) {
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
        const delta = diffPoints(pos, ctx.lastPos);
        const i = items[0];
        i.pos = addPoints(i.pos, delta);
        i.size = { w: i.size.w - delta.x, h: i.size.h - delta.y };
    }

    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
        const i = items[0];
        i.pos = { x: i.pos.x, y: i.pos.y + delta.y };
        i.size = { w: i.size.w + delta.x, h: i.size.h - delta.y };
    }

    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
        const i = items[0];
        i.pos = { x: i.pos.x + delta.x, y: i.pos.y };
        i.size = { w: i.size.w - delta.x, h: i.size.h + delta.y };
    }

    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
        const i = items[0];
        i.size = { w: i.size.w + delta.x, h: i.size.h + delta.y };
    }

    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void {
        const center = centerPoint(ctx.topLeft, ctx.size);
        const v1 = diffPoints(center, ctx.topCenter);
        const v2 = diffPoints(center, pos);

        const degree = pointAngle(v1, v2);
        console.log(degree);
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