import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import { Size, ZERO_SIZE } from '../util/size';
import { ORIGIN, Point, centerPoint, diffPoints } from '../util/point';
import MultiSelectInteractStrategy from './multi-select-interact-strategy';
import SingleSelectInteractStrategy from './single-select-interact-strategy';
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

    private _interactStrategy;

    private _interact: InteractingType = InteractingType.None;

    public get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    constructor(items: Item[]) {
        this._items = items;
        if (items.length === 1) {
            this._interactStrategy = new SingleSelectInteractStrategy();
        } else {
            this._interactStrategy = new MultiSelectInteractStrategy();
        }
        this._inferPosAndSize();
    }

    checkInteract(pos: Point): InteractingType {
        if (this._context.topLeft.x - this.PADDING - 6 <= pos.x && this._context.topLeft.x - this.PADDING + 6 >= pos.x && this._context.topLeft.y - this.PADDING - 6 <= pos.y && this._context.topLeft.y - this.PADDING + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (this._context.topRight.x + this.PADDING - 6 <= pos.x && this._context.topRight.x + this.PADDING + 6 >= pos.x && this._context.topRight.y - this.PADDING - 6 <= pos.y && this._context.topRight.y - this.PADDING + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (this._context.bottomLeft.x - this.PADDING - 6 <= pos.x && this._context.bottomLeft.x - this.PADDING + 6 >= pos.x && this._context.bottomLeft.y + this.PADDING - 6 <= pos.y && this._context.bottomLeft.y + this.PADDING + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (this._context.bottomRight.x + this.PADDING - 6 <= pos.x && this._context.bottomRight.x + this.PADDING + 6 >= pos.x && this._context.bottomRight.y + this.PADDING - 6 <= pos.y && this._context.bottomRight.y + this.PADDING + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (this._context.topCenter.x - 5 <= pos.x && this._context.topCenter.x + 5 >= pos.x && this._context.topCenter.y - this.PADDING - 15 <= pos.y && this._context.topCenter.y - this.PADDING - 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (this._context.topLeft.x - this.PADDING <= pos.x && this._context.topLeft.y - this.PADDING <= pos.y && this._context.bottomRight.x + this.PADDING >= pos.x && this._context.bottomRight.y + this.PADDING >= pos.y) {
            return InteractingType.Body;
        }
        return InteractingType.None;
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
                this._interactStrategy.interactBody(this._context, this._items, currentPos);
                break;
            case InteractingType.TopLeft:
                this._interactStrategy.interactTopLeft(this._context, this._items, currentPos);
                break;
            case InteractingType.TopRight:
                this._interactStrategy.interactTopRight(this._context, this._items, currentPos);
                break;
            case InteractingType.BottomLeft:
                this._interactStrategy.interactBottomLeft(this._context, this._items, currentPos);
                break;
            case InteractingType.BottomRight:
                this._interactStrategy.interactBottomRight(this._context, this._items, currentPos);
                break;
            case InteractingType.Rotate:
                this._interactStrategy.interactRotate(this._context, this._items, currentPos);
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
        return [
            new Rectangle({ pos: { x: this._context.topLeft.x - this.PADDING, y: this._context.topLeft.y - this.PADDING }, size: { w: this._context.size.w + (this.PADDING * 2), h: this._context.size.h + (this.PADDING * 2) }, borderColor: "#0d6efd" }),
            new Rectangle({ pos: { x: this._context.topLeft.x - this.PADDING - 4, y: this._context.topLeft.y - this.PADDING - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._context.topRight.x + this.PADDING - 4, y: this._context.topRight.y - this.PADDING - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._context.bottomLeft.x - this.PADDING - 4, y: this._context.bottomLeft.y + this.PADDING - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._context.bottomRight.x + this.PADDING - 4, y: this._context.bottomRight.y + this.PADDING - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Circle({ pos: { x: this._context.topCenter.x, y: this._context.topCenter.y - this.PADDING - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
        ];
    }

    private _inferPosAndSize(): void {
        if (this._items.length === 0) return;
        const p1: Point = { ...this._items[0].pos };
        const p2: Point = { x: this._items[0].pos.x + this._items[0].size.w, y: this._items[0].pos.y + this._items[0].size.h };

        for (const i of this._items) {
            p1.x = Math.min(p1.x, i.pos.x);
            p1.y = Math.min(p1.y, i.pos.y);
            p2.x = Math.max(p2.x, i.pos.x + i.size.w);
            p2.y = Math.max(p2.y, i.pos.y + i.size.h);
        }

        this._context.topLeft = { x: p1.x, y: p1.y };
        this._context.topRight = { x: p2.x, y: p1.y };
        this._context.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        this._context.bottomLeft = { x: p1.x, y: p2.y };
        this._context.bottomRight = { x: p2.x, y: p2.y };
        this._context.size = { w: this._context.bottomRight.x - this._context.topLeft.x, h: this._context.bottomRight.y - this._context.topLeft.y };
    }
}

export default ItemInteractor;
export type {
    InteractorContext,
}
export {
    InteractingType,
};