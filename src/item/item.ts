import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import EventNotifier, { EventNotifierBase } from '../util/event';

enum ItemEvent {
    Resize = 'resize',
    Reposition = 'reposition'
}

interface Item extends EventNotifier {
    get id(): string;
    set id(id: string);
    get pos(): Point;
    set pos(pos: Point);
    get size(): Size;
    set size(size: Size);
    get rotate(): number;
    set rotate(value: number);
    visit(visitor: Visitor): void;
}

abstract class ItemBase extends EventNotifierBase implements Item {
    private _id: string;
    private _pos: Point;
    private _size: Size;
    private _rotate: number;

    public get id(): string { return this._id; }
    public set id(id: string) { this._id = id; }

    public get pos(): Point { return this._pos; }
    public set pos(pos: Point) {
        this._pos = pos;
        this._emit(ItemEvent.Reposition, this._id);
    }

    public get size(): Size { return this._size; }
    public set size(size: Size) {
        this._size = size;
        this._emit(ItemEvent.Resize, this._id);
    }

    public get rotate(): number { return this._rotate; }
    public set rotate(value: number) { this._rotate = value; }

    constructor(id: string, pos: Point, size: Size, rotate: number) {
        super();
        this._id = id;
        this._pos = pos;
        this._size = size;
        this._rotate = rotate;
    }

    abstract visit(visitor: Visitor): void;
}

export default Item;
export {
    ItemBase,
    ItemEvent,
};