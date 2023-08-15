import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import { ItemBase, ItemEvent, ItemState, TextEditableItem } from './item';
import { measureTextHeight, measureTextWidth } from '../util/font-matric';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import ResizeStrategy, { DiagonalResizeStrategy, NoResizeStrategy } from '../interactor/resize-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import TextEditStrategy, { FreeTextEditStrategy } from '../interactor/text-edit-strategy';
import { FontStyle } from '../type/font-style';

interface DescriptionProps {
    id: string;
    pos: Point;
    rotate: number;
    text: string;
}

interface DescriptionState extends ItemState {
    text: string;
    fontSize: number;
    isEditing: boolean;
}

class Description extends ItemBase<DescriptionState> implements TextEditableItem {
    public get textEditable(): boolean { return true; }
    public get text(): string { return this._state.text; }
    public get fontStyle(): FontStyle { return { family: "serif", size: this._state.fontSize, lineHight: 1.2 } };
    public setText(value: string) { this._state.text = value; }

    public override setSize(size: Size) {
        this._state.size = size;
        this._state.fontSize = size.h / ((this._state.text.match(/\n/g) ?? []).length + 1) / 1.2;
        this._emit(ItemEvent.Resize, this._state.id);
    }

    public get isEditing(): boolean {
        return this._state.isEditing;
    }

    public setIsEditing(b: boolean) {
        this._state.isEditing = b;
    }

    public get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    public get resizeStrategy(): ResizeStrategy {
        return new DiagonalResizeStrategy();
    }

    public get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    public get textEditStrategy(): TextEditStrategy {
        return new FreeTextEditStrategy();
    }

    constructor(prop: DescriptionProps) {
        super({
            ...prop,
            size: { w: measureTextWidth(prop.text, 'serif', 16), h: measureTextHeight(prop.text, 16, 1.2) },
            isEditing: false,
            fontSize: 16,
        });
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;
export type { DescriptionState };