import Visitor from '../visitor/visitor';
import { DEFAULT_STYLE, FontStyle } from '../type/font-style';
import Item, { Collidable, ItemBase, ItemState, TextEditable } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import ResizeStrategy, { FreeResizeStrategy } from '../interactor/resize-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import IndicatorStrategy, { SizeIndicatorStrategy } from '../interactor/indicator-strategy';
import TextEditStrategy, { BoundedTextEditStrategy } from '../interactor/text-edit-strategy';

interface BoxProps extends ItemState {
    name?: string;
}

interface BoxState extends ItemState {
    name: string;
    isCollide: boolean;
    isEditing: boolean;
}

class Box extends ItemBase<BoxState> implements Item, TextEditable, Collidable {
    get textEditable(): boolean { return true; }
    get text(): string { return this._state.name; }
    get fontStyle(): FontStyle { return DEFAULT_STYLE; }
    setText(value: string) { this._state.name = value; }

    get name(): string { return this._state.name; }
    setName(value: string) { this._state.name = value; }

    get isEditing(): boolean {
        return this._state.isEditing;
    }

    setIsEditing(b: boolean) {
        this._state.isEditing = b;
    }

    get collidable(): boolean { return true; }
    get isCollide(): boolean { return this._state.isCollide; }
    setIsCollide(b: boolean): void { this._state.isCollide = b; }

    get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    get resizeStrategy(): ResizeStrategy {
        return new FreeResizeStrategy();
    }

    get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    get textEditStrategy(): TextEditStrategy {
        return new BoundedTextEditStrategy();
    }

    get indicatorStrategy(): IndicatorStrategy {
        return new SizeIndicatorStrategy();
    }

    constructor(props: BoxProps);
    constructor(state: BoxState);

    constructor(argv: BoxProps | BoxState) {
        if ('isEditing' in argv) {
            super({ ...argv });
        } else {
            super({ ...argv, name: argv.name ?? '', isEditing: false, isCollide: false });
        }
    }

    visit(visitor: Visitor): void {
        visitor.visitBox(this);
    }
}

export default Box;
export type { BoxState };