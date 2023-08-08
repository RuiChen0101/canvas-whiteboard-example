import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';

interface DescriptionState extends ItemState {
    text: string;
}

class Description extends ItemBase<DescriptionState> {
    public get text(): string { return this._state.text; }
    public set text(value: string) { this._state.text = value; }

    constructor(prop: DescriptionState) {
        super(prop);
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;
export type { DescriptionState };