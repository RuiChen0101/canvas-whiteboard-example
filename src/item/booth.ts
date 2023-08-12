import { measureTextWidth, measureTextHeight } from '../util/font-metric';
import Visitor from '../visitor/visitor';
import { ItemBase, ItemState, TextEditableItem } from './item';

interface BoothProps extends ItemState {
    name: string;
}

interface BoothState extends ItemState {
    name: string;
    isEditing: boolean;
}

class Booth extends ItemBase<BoothState> implements TextEditableItem {
    public get textEditable(): boolean { return true; }
    public get text(): string { return this._state.name; }
    public set text(value: string) {
        this._state.name = value;
        const textSize = { w: measureTextWidth(value, 'serif', 16), h: measureTextHeight(value, 16, 1.2) };
        if (textSize.w > this._state.size.w || textSize.h > this._state.size.h) {
            this.size = { w: Math.max(textSize.w, this._state.size.w), h: Math.max(textSize.h, this._state.size.h) };
        }
    }

    public get name(): string { return this._state.name; }
    public set name(value: string) { this._state.name = value; }

    get isEditing(): boolean {
        return this._state.isEditing;
    }

    set isEditing(b: boolean) {
        this._state.isEditing = b;
    }

    constructor(prop: BoothProps) {
        super({
            ...prop,
            isEditing: false
        });
    }

    visit(visitor: Visitor): void {
        visitor.visitBooth(this);
    }
}

export default Booth;
export type { BoothState };