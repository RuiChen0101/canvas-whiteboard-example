import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import { Size, ZERO_SIZE } from '../util/size';
import { ORIGIN, Point, centerPoint, diffPoints } from '../util/point';
import MultiSelectInteractStrategy from './multi-select-interactor-strategy';
import SingleSelectInteractStrategy from './single-select-interactor-strategy';
import Rotate from '../shape/rotate';

enum InteractingType {
    Body,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    Rotate,
    None
}

interface InteractorContext {
    topLeft: Point;
    topCenter: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
    size: Size;
    lastPos: Point;
}

const PADDING: number = 10;
const ANCHOR_SIZE: Size = Object.freeze({ w: 8, h: 8 });

class ItemInteractor {
    private readonly PADDING: number = 10;
    private readonly ANCHOR_SIZE: Size = Object.freeze({ w: 8, h: 8 });

    private _items: Item[] = [];

    private _context: InteractorContext = {
        topLeft: ORIGIN,
        topCenter: ORIGIN,
        topRight: ORIGIN,
        bottomLeft: ORIGIN,
        bottomRight: ORIGIN,
        size: ZERO_SIZE,
        lastPos: ORIGIN,
    };

    private _strategy;

    private _interact: InteractingType = InteractingType.None;

    public get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    constructor(items: Item[]) {
        this._items = items;
        if (items.length === 1) {
            this._strategy = new SingleSelectInteractStrategy();
        } else {
            this._strategy = new MultiSelectInteractStrategy();
        }
        this._inferPosAndSize();
    }

    checkInteract(pos: Point): InteractingType {
        return this._strategy.checkInteract(this._context, this._items, pos);
    }

    onStart(pos: Point): void {
        const interact = this.checkInteract(pos);
        if (interact === InteractingType.None) return;
        this._interact = interact;
        this._context.lastPos = pos;
    }

    onMove(pos: Point): void {
        if (this._interact === InteractingType.None) return;

        const lastPos = this._context.lastPos;
        const currentPos = { ...pos };

        const delta = diffPoints(currentPos, lastPos);
        switch (this._interact) {
            case InteractingType.Body:
                this._strategy.interactBody(this._context, this._items, currentPos);
                break;
            case InteractingType.TopLeft:
                this._strategy.interactTopLeft(this._context, this._items, currentPos);
                break;
            case InteractingType.TopRight:
                this._strategy.interactTopRight(this._context, this._items, currentPos);
                break;
            case InteractingType.BottomLeft:
                this._strategy.interactBottomLeft(this._context, this._items, currentPos);
                break;
            case InteractingType.BottomRight:
                this._strategy.interactBottomRight(this._context, this._items, currentPos);
                break;
            case InteractingType.Rotate:
                this._strategy.interactRotate(this._context, this._items, currentPos);
                break;
        }
        this._context.lastPos = currentPos;

        this._inferPosAndSize();
    }

    onEnd(pos: Point): void {
        if (this._interact === InteractingType.None) return;

        this._interact = InteractingType.None;
        this._context.lastPos = pos;
    }

    draw(): Shape[] {
        return this._strategy.drawIndicator(this._context, this._items);
    }

    private _inferPosAndSize(): void {
        this._context = this._strategy.inferPosAndSize(this._context, this._items);
    }
}

export default ItemInteractor;
export type {
    InteractorContext,
}
export {
    InteractingType,
    PADDING,
    ANCHOR_SIZE,
};