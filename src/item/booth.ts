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
    public set text(text: string) { this._state.name = text; }
    public get text(): string { return this._state.name; }

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