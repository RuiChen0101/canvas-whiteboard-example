import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';

interface BoothState extends ItemState {
    name: string;
}

class Booth extends ItemBase<BoothState> {
    public get name(): string { return this._state.name; }
    public set name(value: string) { this._state.name = value; }

    visit(visitor: Visitor): void {
        visitor.visitBooth(this);
    }
}

export default Booth;
export type { BoothState };