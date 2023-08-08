import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import EventNotifier, { EventNotifierBase } from '../util/event';
import { boundingBoxForRotatedRectangle } from '../util/bounding-box';

enum ItemEvent {
    Resize = 'resize',
    Reposition = 'reposition'
}

interface ItemRecord {
    type: string;
    state: any;
}

interface ItemState {
    id: string;
    pos: Point;
    size: Size;
    rotate: number;
}

interface Item extends EventNotifier {
    get state(): Readonly<any>;
    get id(): string;
    set id(id: string);
    get pos(): Point;
    set pos(pos: Point);
    get size(): Size;
    set size(size: Size);
    get rotate(): number;
    set rotate(value: number);
    get boundingBox(): [Point, Point];
    visit(visitor: Visitor): void;
}

abstract class ItemBase<State extends ItemState> extends EventNotifierBase implements Item {
    protected _state: State;

    public get state(): Readonly<any> { return { ...this._state } }

    public get id(): string { return this._state.id; }
    public set id(id: string) { this._state.id = id; }

    public get pos(): Point { return this._state.pos; }
    public set pos(pos: Point) {
        this._state.pos = pos;
        this._emit(ItemEvent.Reposition, this._state.id);
    }

    public get size(): Size { return this._state.size; }
    public set size(size: Size) {
        this._state.size = size;
        this._emit(ItemEvent.Resize, this._state.id);
    }

    public get rotate(): number { return this._state.rotate; }
    public set rotate(value: number) {
        this._state.rotate = value;
        this._emit(ItemEvent.Resize, this._state.id);
    }

    public get boundingBox(): [Point, Point] {
        return boundingBoxForRotatedRectangle(this._state.pos, this._state.size, this._state.rotate);
    }

    constructor(state: State) {
        super();
        this._state = state;
    }

    abstract visit(visitor: Visitor): void;
}

export default Item;
export type { ItemRecord, ItemState };
export {
    ItemBase,
    ItemEvent,
};