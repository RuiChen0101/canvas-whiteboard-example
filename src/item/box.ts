import Visitor from '../visitor/visitor';
import { DEFAULT_STYLE, FontStyle } from '../type/font-style';
import { ItemBase, ItemState, TextEditableItem } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import ResizeStrategy, { FreeResizeStrategy } from '../interactor/resize-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import TextEditStrategy, { BoundedTextEditStrategy } from '../interactor/text-edit-strategy';

interface BoxProps extends ItemState {
    name: string;
}

interface BoxState extends ItemState {
    name: string;
    isEditing: boolean;
}

class Box extends ItemBase<BoxState> implements TextEditableItem {
    public get textEditable(): boolean { return true; }
    public get text(): string { return this._state.name; }
    public get fontStyle(): FontStyle { return DEFAULT_STYLE; }
    public setText(value: string) { this._state.name = value; }

    public get name(): string { return this._state.name; }
    public setName(value: string) { this._state.name = value; }

    get isEditing(): boolean {
        return this._state.isEditing;
    }

    setIsEditing(b: boolean) {
        this._state.isEditing = b;
    }

    public get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    public get resizeStrategy(): ResizeStrategy {
        return new FreeResizeStrategy();
    }

    public get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    public get textEditStrategy(): TextEditStrategy {
        return new BoundedTextEditStrategy();
    }

    constructor(props: BoxProps);
    constructor(state: BoxState);

    constructor(argv: BoxProps | BoxState) {
        if ('isEditing' in argv) {
            super({ ...argv });
        } else {
            super({ ...argv, isEditing: false });
        }
    }

    visit(visitor: Visitor): void {
        visitor.visitBox(this);
    }
}

export default Box;
export type { BoxState };