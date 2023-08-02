import Item from '../item/item';
import InteractionStrategy from './interact-strategy';
import { InteractorContext } from './item-interactor';
import { Point, addPoints, diffPoints } from '../util/point';

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
}

export default SingleSelectInteractStrategy;