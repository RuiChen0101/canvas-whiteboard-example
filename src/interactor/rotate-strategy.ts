import Item from '../item/item';
import { InteractorContext } from './item-interactor';
import { Point, centerPoint, diffPoints, pointAngle, rotatePoint } from '../util/point';

interface RotateStrategy {
    rotate(ctx: InteractorContext, items: Item[], pos: Point): void
}

class FreeRotateStrategy implements RotateStrategy {
    rotate(ctx: InteractorContext, items: Item[], pos: Point): void {
        const center = centerPoint(ctx.topLeft, ctx.size);
        const v1 = diffPoints(center, ctx.lastPos);
        const v2 = diffPoints(center, pos);

        const delta = pointAngle(v1, v2);
        for (const i of items) {
            i.setPos(diffPoints(rotatePoint(centerPoint(i.pos, i.size), center, delta), { x: i.size.w / 2, y: i.size.h / 2 }));
            i.setRotate(i.rotate + delta);
        }
    }
}

export default RotateStrategy;
export {
    FreeRotateStrategy
}