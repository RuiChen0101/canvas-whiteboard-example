import Item from '../item/item';
import { Point } from '../util/point'
import { InteractorContext } from './item-interactor';

interface InteractStrategy {
    interactBody(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void;
}

export default InteractStrategy;