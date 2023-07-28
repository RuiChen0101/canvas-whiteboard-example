import { Size } from '../util/size';
import { Point } from '../util/point';
import Item, { ItemBase } from './item';
import Visitor from '../visitor/visitor';

type BoothProp = {
    id: string,
    pos: Point,
    size: Size,
    rotate: number,
    name: string,
}

class Booth extends ItemBase implements Item {
    private _name: string;

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    constructor(prop: BoothProp) {
        super(prop.id, prop.pos, prop.size, prop.rotate);
        this._name = prop.name;
    }

    visit(visitor: Visitor): void {
        visitor.visitBooth(this);
    }
}

export default Booth;