import Item from '../item/item';
import { InteractorContext } from './item-interactor';
import InteractionStrategy from './interact-strategy';
import { Point, addPoints, diffPoints, upScalePoint } from '../util/point';

class MultiSelectInteractStrategy implements InteractionStrategy {
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
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.topRight);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) <= delta.y ? 1 + (delta.x / ctx.size.w) : 1 - (delta.y / ctx.size.h);
        const d = { x: ctx.bottomLeft.x - (ctx.bottomLeft.x * s), y: ctx.bottomLeft.y - (ctx.bottomLeft.y * s) };
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomLeft);
        const s = (delta.x * -(ctx.size.w / ctx.size.h)) > delta.y ? 1 - (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topRight.x - (ctx.topRight.x * s), y: ctx.topRight.y - (ctx.topRight.y * s) };
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.bottomRight);
        const s = (delta.x * (ctx.size.w / ctx.size.h)) > delta.y ? 1 + (delta.x / ctx.size.w) : 1 + (delta.y / ctx.size.h);
        const d = { x: ctx.topLeft.x - (ctx.topLeft.x * s), y: ctx.topLeft.y - (ctx.topLeft.y * s) };
        for (const i of items) {
            i.pos = addPoints(upScalePoint(i.pos, s), d);
            i.size = { w: i.size.w * s, h: i.size.h * s };
        }
    }

    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void {

    }
}

export default MultiSelectInteractStrategy;