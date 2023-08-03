import Item from '../item/item';
import InteractionStrategy from './interact-strategy';
import { InteractorContext } from './item-interactor';
import { Point, addPoints, centerPoint, diffPoints, pointAngle } from '../util/point';

class SingleSelectInteractStrategy implements InteractionStrategy {
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
}

export default SingleSelectInteractStrategy;