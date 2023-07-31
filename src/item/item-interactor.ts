import Item from './item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import { Size, ZERO_SIZE } from '../util/size';
import { ORIGIN, Point, addPoints, diffPoints } from '../util/point';

class ItemInteractor {
    private readonly PADDING = 10;
    private readonly ANCHOR_SIZE: Size = Object.freeze({ w: 8, h: 8 });

    private _items: Item[] = [];

    private _topLeft: Point = ORIGIN;
    private _topCenter: Point = ORIGIN;
    private _topRight: Point = ORIGIN;
    private _bottomLeft: Point = ORIGIN;
    private _bottomRight: Point = ORIGIN;

    private _size: Size = ZERO_SIZE;

    private _lastPos: Point = ORIGIN;
    private _interact: string = "none";

    public get isInteracting(): boolean {
        return this._interact !== "none";
    }

    constructor(items: Item[]) {
        this._items = items;
        this._inferPosAndSize();
    }

    checkInteract(pos: Point): string {
        if (this._topLeft.x - 6 <= pos.x && this._topLeft.x + 6 >= pos.x && this._topLeft.y - 6 <= pos.y && this._topLeft.y + 6 >= pos.y) {
            return "topLeft";
        }
        if (this._topRight.x - 6 <= pos.x && this._topRight.x + 6 >= pos.x && this._topRight.y - 6 <= pos.y && this._topRight.y + 6 >= pos.y) {
            return "topRight";
        }
        if (this._bottomLeft.x - 6 <= pos.x && this._bottomLeft.x + 6 >= pos.x && this._bottomLeft.y - 6 <= pos.y && this._bottomLeft.y + 6 >= pos.y) {
            return "bottomLeft";
        }
        if (this._bottomRight.x - 6 <= pos.x && this._bottomRight.x + 6 >= pos.x && this._bottomRight.y - 6 <= pos.y && this._bottomRight.y + 6 >= pos.y) {
            return "bottomRight";
        }
        if (this._topCenter.x - 5 <= pos.x && this._topCenter.x + 5 >= pos.x && this._topCenter.y - 15 <= pos.y && this._topCenter.y - 5 >= pos.y) {
            return "rotate";
        }
        if (this._topLeft.x <= pos.x && this._topLeft.y <= pos.y && this._bottomRight.x >= pos.x && this._bottomRight.y >= pos.y) {
            return "body";
        }
        return "none";
    }

    onStart(pos: Point): void {
        const interact = this.checkInteract(pos);
        if (interact === "none") return;
        this._interact = interact;
        this._lastPos = pos;
    }

    onMove(pos: Point): void {
        const lastPos = this._lastPos;
        const currentPos = { x: pos.x, y: pos.y };
        this._lastPos = currentPos;

        const delta = diffPoints(currentPos, lastPos);
        for (const i of this._items) {
            i.pos = addPoints(i.pos, delta);
        }

        this._inferPosAndSize();
    }

    onEnd(pos: Point): void {
        this._interact = "none";
        this._lastPos = pos;
    }

    draw(): Shape[] {
        return [
            new Rectangle({ pos: this._topLeft, size: this._size, borderColor: "#0d6efd" }),
            new Rectangle({ pos: { x: this._topLeft.x - 4, y: this._topLeft.y - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._topRight.x - 4, y: this._topRight.y - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._bottomLeft.x - 4, y: this._bottomLeft.y - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: this._bottomRight.x - 4, y: this._bottomRight.y - 4 }, size: this.ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Circle({ pos: { x: this._topCenter.x, y: this._topCenter.y - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
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

        this._topLeft = { x: p1.x - this.PADDING, y: p1.y - this.PADDING };
        this._topRight = { x: p2.x + this.PADDING, y: p1.y - this.PADDING };
        this._topCenter = { x: (p1.x + p2.x) / 2, y: p1.y - this.PADDING };
        this._bottomLeft = { x: p1.x - this.PADDING, y: p2.y + this.PADDING };
        this._bottomRight = { x: p2.x + this.PADDING, y: p2.y + this.PADDING };
        this._size = { w: this._bottomRight.x - this._topLeft.x, h: this._bottomRight.y - this._topLeft.y };
    }
}

export default ItemInteractor;