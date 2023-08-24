import Item from '../../item/item';
import { InteractorInfo } from '../item-interactor';
import { Point, diffPoints, addPoints } from '../../util/point';

interface MoveStrategy {
    move(info: InteractorInfo, items: Item[], pos: Point): void
}

class FreeMoveStrategy implements MoveStrategy {
    move(info: InteractorInfo, items: Item[], pos: Point): void {
        const delta = diffPoints(pos, info.lastPos);
        for (const i of items) {
            i.setPos(addPoints(i.pos, delta));
        }
    }
}

export default MoveStrategy;
export {
    FreeMoveStrategy
}