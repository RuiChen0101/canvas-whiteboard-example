import Item from '../item/item';
import { Point } from '../util/point'
import { InteractingType, InteractorContext } from './item-interactor';

interface InteractorStrategy {
    drawIndicator(ctx: InteractorContext, items: Item[]): void;
    checkInteract(ctx: InteractorContext, items: Item[], pos: Point): InteractingType;
    interactBody(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactTopLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactTopRight(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactBottomLeft(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactBottomRight(ctx: InteractorContext, items: Item[], pos: Point): void;
    interactRotate(ctx: InteractorContext, items: Item[], pos: Point): void;
    inferPosAndSize(ctx: InteractorContext, items: Item[]): InteractorContext;
}

export default InteractorStrategy;