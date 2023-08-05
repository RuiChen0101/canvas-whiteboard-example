import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import InteractorStrategy from './interactor-strategy';
import { ANCHOR_SIZE, InteractingType, InteractorContext, PADDING } from './item-interactor';
import { Point, addPoints, centerPoint, diffPoints, pointAngle, rotatePoint, upScalePoint } from '../util/point';

class MultiSelectInteractorStrategy implements InteractorStrategy {
    drawIndicator(ctx: InteractorContext, items: Item[]): Shape[] {
        return [
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING }, size: { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) }, borderColor: "#0d6efd" }),
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING - 4, y: ctx.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.topRight.x + PADDING - 4, y: ctx.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomLeft.x - PADDING - 4, y: ctx.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomRight.x + PADDING - 4, y: ctx.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Circle({ pos: { x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
        ];
    }

    checkInteract(ctx: InteractorContext, items: Item[], pos: Point): InteractingType {
        if (ctx.topLeft.x - PADDING - 6 <= pos.x && ctx.topLeft.x - PADDING + 6 >= pos.x && ctx.topLeft.y - PADDING - 6 <= pos.y && ctx.topLeft.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (ctx.topRight.x + PADDING - 6 <= pos.x && ctx.topRight.x + PADDING + 6 >= pos.x && ctx.topRight.y - PADDING - 6 <= pos.y && ctx.topRight.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (ctx.bottomLeft.x - PADDING - 6 <= pos.x && ctx.bottomLeft.x - PADDING + 6 >= pos.x && ctx.bottomLeft.y + PADDING - 6 <= pos.y && ctx.bottomLeft.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (ctx.bottomRight.x + PADDING - 6 <= pos.x && ctx.bottomRight.x + PADDING + 6 >= pos.x && ctx.bottomRight.y + PADDING - 6 <= pos.y && ctx.bottomRight.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (ctx.topCenter.x - 5 <= pos.x && ctx.topCenter.x + 5 >= pos.x && ctx.topCenter.y - PADDING - 15 <= pos.y && ctx.topCenter.y - PADDING - 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (ctx.topLeft.x - PADDING <= pos.x && ctx.topLeft.y - PADDING <= pos.y && ctx.bottomRight.x + PADDING >= pos.x && ctx.bottomRight.y + PADDING >= pos.y) {
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
        const delta = diffPoints(pos, ctx.topLeft);
        const s = (delta.x * (ctx.size.w / ctx.size.h)) <= delta.y ? 1 - (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
        const d = { x: ctx.bottomRight.x - (ctx.bottomRight.x * s), y: ctx.bottomRight.y - (ctx.bottomRight.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.topRight);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) <= delta.y ? 1 + (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
        const d = { x: ctx.bottomLeft.x - (ctx.bottomLeft.x * s), y: ctx.bottomLeft.y - (ctx.bottomLeft.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomLeft);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) > delta.y ? 1 - (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topRight.x - (ctx.topRight.x * s), y: ctx.topRight.y - (ctx.topRight.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomRight);
        const s = (delta.x * (ctx.size.w / ctx.size.h)) > delta.y ? 1 + (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topLeft.x - (ctx.topLeft.x * s), y: ctx.topLeft.y - (ctx.topLeft.y * s) };
        if (ctx.size.w * s < 5 || ctx.size.h * s < 5) return;
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void {
        const center = centerPoint(ctx.topLeft, ctx.size);
        const v1 = diffPoints(center, ctx.lastPos);
        const v2 = diffPoints(center, pos);

        const degree = pointAngle(v1, v2);

        for (const i of items) {
            i.pos = diffPoints(rotatePoint(centerPoint(i.pos, i.size), center, degree), { x: i.size.w / 2, y: i.size.h / 2 });
            i.rotate = i.rotate + degree;
        }
    }

    inferPosAndSize(ctx: InteractorContext, items: Item[]): InteractorContext {
        if (items.length === 0) return ctx;
        const newCtx = { ...ctx };
        const [p1, p2] = items[0].boundingBox

        for (const i of items) {
            const [iP1, iP2] = i.boundingBox;
            p1.x = Math.min(p1.x, iP1.x);
            p1.y = Math.min(p1.y, iP1.y);
            p2.x = Math.max(p2.x, iP2.x);
            p2.y = Math.max(p2.y, iP2.y);
        }

        newCtx.topLeft = { x: p1.x, y: p1.y };
        newCtx.topRight = { x: p2.x, y: p1.y };
        newCtx.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        newCtx.bottomLeft = { x: p1.x, y: p2.y };
        newCtx.bottomRight = { x: p2.x, y: p2.y };
        newCtx.size = { w: newCtx.bottomRight.x - newCtx.topLeft.x, h: newCtx.bottomRight.y - newCtx.topLeft.y };

        return newCtx;
    }
}

export default MultiSelectInteractorStrategy;