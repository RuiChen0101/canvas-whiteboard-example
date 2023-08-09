import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';

interface DescriptionProps {
    id: string;
    pos: Point;
    rotate: number;
    text: string;
}

interface DescriptionState extends ItemState {
    text: string;
}

class Description extends ItemBase<DescriptionState> {
    public get text(): string { return this._state.text; }
    public set text(value: string) { this._state.text = value; }

    constructor(prop: DescriptionProps) {
        super({ ...prop, size: { w: 100, h: 100 } });
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;
export type { DescriptionState };