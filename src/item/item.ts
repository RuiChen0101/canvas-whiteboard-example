import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import { FontStyle } from '../type/font-style';
import MoveStrategy from '../interactor/move-strategy';
import ResizeStrategy from '../interactor/resize-strategy';
import RotateStrategy from '../interactor/rotate-strategy';
import TextEditStrategy from '../interactor/text-edit-strategy';
import EventNotifier, { EventNotifierBase } from '../util/event';
import { boundingBoxForRotatedRectangle } from '../util/bounding-box';

enum ItemEvent {
    Update = 'update'
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
    setId(id: string): void;
    get pos(): Point;
    setPos(pos: Point): void;
    get size(): Size;
    setSize(size: Size): void;
    get rotate(): number;
    setRotate(value: number): void;
    get boundingBox(): [Point, Point];
    get moveStrategy(): MoveStrategy;
    get resizeStrategy(): ResizeStrategy;
    get rotateStrategy(): RotateStrategy;
    visit(visitor: Visitor): void;
}

interface Collidable {
    get collidable(): boolean;
    get isCollide(): boolean;
    setIsCollide(b: boolean): void;
}

interface TextEditable {
    get textEditable(): boolean;
    get isEditing(): boolean;
    setIsEditing(b: boolean): void;
    setText(value: string): void;
    get text(): string;
    get fontStyle(): FontStyle;
    get textEditStrategy(): TextEditStrategy;
}

interface TextEditableItem extends Item, TextEditable { }

abstract class ItemBase<State extends ItemState> extends EventNotifierBase implements Item {
    protected _state: State;

    get state(): Readonly<State> { return { ...this._state } }

    get id(): string { return this._state.id; }
    setId(id: string) { this._state.id = id; }

    get pos(): Point { return this._state.pos; }
    setPos(pos: Point) {
        this._state.pos = pos;
        this._emit(ItemEvent.Update, this._state.id);
    }

    get size(): Size { return this._state.size; }
    setSize(size: Size) {
        this._state.size = size;
        this._emit(ItemEvent.Update, this._state.id);
    }

    get rotate(): number { return this._state.rotate; }
    setRotate(value: number) {
        this._state.rotate = value;
        this._emit(ItemEvent.Update, this._state.id);
    }

    get boundingBox(): [Point, Point] {
        return boundingBoxForRotatedRectangle(this._state.pos, this._state.size, this._state.rotate);
    }

    abstract get moveStrategy(): MoveStrategy;
    abstract get resizeStrategy(): ResizeStrategy;
    abstract get rotateStrategy(): RotateStrategy;

    constructor(state: State) {
        super();
        this._state = state;
    }

    abstract visit(visitor: Visitor): void;
}

export default Item;
export type { Collidable, TextEditable, TextEditableItem, ItemRecord, ItemState };
export {
    ItemBase,
    ItemEvent,
};