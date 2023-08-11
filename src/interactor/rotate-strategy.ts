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

        const degree = pointAngle(v1, v2);
        for (const i of items) {
            i.pos = diffPoints(rotatePoint(centerPoint(i.pos, i.size), center, degree), { x: i.size.w / 2, y: i.size.h / 2 });
            i.rotate = i.rotate + degree;
        }
    }
}

export default RotateStrategy;
export {
    FreeRotateStrategy
}