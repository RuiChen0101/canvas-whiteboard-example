import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import { ItemBase, ItemState, TextEditableItem } from './item';
import { measureTextHeight, measureTextWidth } from '../util/font-metric';

interface DescriptionProps {
    id: string;
    pos: Point;
    rotate: number;
    text: string;
}

interface DescriptionState extends ItemState {
    text: string;
    isEditing: boolean;
}

class Description extends ItemBase<DescriptionState> implements TextEditableItem {
    public get textEditable(): boolean { return true; }
    public get text(): string { return this._state.text; }
    public set text(value: string) {
        this._state.text = value;
        console.log(value);
        this.size = { w: measureTextWidth(value, 'serif', 16), h: measureTextHeight(value, 16, 1.2) }
    }

    get isEditing(): boolean {
        return this._state.isEditing;
    }

    set isEditing(b: boolean) {
        this._state.isEditing = b;
    }

    constructor(prop: DescriptionProps) {
        super({
            ...prop,
            size: { w: measureTextWidth(prop.text, 'serif', 16), h: measureTextHeight(prop.text, 16, 1.2) },
            isEditing: false,
        });
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;
export type { DescriptionState };