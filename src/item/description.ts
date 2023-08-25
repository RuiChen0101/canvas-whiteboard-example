import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import { FontStyle } from '../type/font-style';
import { measureTextHeight, measureTextWidth } from '../util/font-measure';
import Item, { ItemBase, ItemEvent, ItemState, TextEditable } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/strategy/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/strategy/rotate-strategy';
import ResizeStrategy, { DiagonalResizeStrategy } from '../interactor/strategy/resize-strategy';
import TextEditStrategy, { FreeTextEditStrategy } from '../interactor/strategy/text-edit-strategy';
import IndicatorStrategy, { NoIndicatorStrategy } from '../interactor/strategy/indicator-strategy';

interface DescriptionProps {
    id: string;
    pos: Point;
    rotate: number;
    text: string;
    fontSize?: number;
}

interface DescriptionState extends ItemState {
    text: string;
    fontSize: number;
    isEditing: boolean;
}

class Description extends ItemBase<DescriptionState> implements Item, TextEditable {
    get textEditable(): boolean { return true; }
    get text(): string { return this._state.text; }
    get fontStyle(): FontStyle { return { family: "serif", size: this._state.fontSize, lineHight: 1.2 } };
    setText(value: string) { this._state.text = value; }

    public override setSize(size: Size) {
        this._state.size = size;
        this._state.fontSize = size.h / ((this._state.text.match(/\n/g) ?? []).length + 1) / 1.2;
        this._emit(ItemEvent.Update, this._state.id);
    }

    get isEditing(): boolean {
        return this._state.isEditing;
    }

    setIsEditing(b: boolean) {
        this._state.isEditing = b;
    }

    get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    get resizeStrategy(): ResizeStrategy {
        return new DiagonalResizeStrategy();
    }

    get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    get textEditStrategy(): TextEditStrategy {
        return new FreeTextEditStrategy();
    }

    get indicatorStrategy(): IndicatorStrategy {
        return new NoIndicatorStrategy();
    }

    constructor(props: DescriptionProps);
    constructor(state: DescriptionState);

    constructor(argv: DescriptionProps | DescriptionState) {
        if ('isEditing' in argv && 'fontSize' in argv) {
            super(argv);
        } else {
            const fontSize = argv.fontSize ?? 16;
            super({
                ...argv,
                size: { w: measureTextWidth(argv.text, 'serif', fontSize), h: measureTextHeight(argv.text, fontSize, 1.2) },
                isEditing: false,
                fontSize: fontSize,
            });
        }
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;
export type { DescriptionState };