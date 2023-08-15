import Item from '../item/item';
import { Point, diffPoints, addPoints } from '../util/point';
import { InteractorContext } from './item-interactor';

interface MoveStrategy {
    move(ctx: InteractorContext, items: Item[], pos: Point): void
}

class FreeMoveStrategy implements MoveStrategy {
    move(ctx: InteractorContext, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, ctx.lastPos);
        for (const i of items) {
            i.setPos(addPoints(i.pos, delta));
        }
    }
}

export default MoveStrategy;
export {
    FreeMoveStrategy
}