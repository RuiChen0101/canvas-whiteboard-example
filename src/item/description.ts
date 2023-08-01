import { Size } from '../util/size';
import { Point } from '../util/point';
import Item, { ItemBase } from './item';
import Visitor from '../visitor/visitor';

type DescriptionProp = {
    id: string,
    pos: Point,
    size: Size,
    rotate: number,
    text: string,
}

class Description extends ItemBase implements Item {
    private _text: string;

    public get text(): string { return this._text; }
    public set text(value: string) { this._text = value; }

    constructor(prop: DescriptionProp) {
        super(prop.id, prop.pos, prop.size, prop.rotate);
        this._text = prop.text;
    }

    visit(visitor: Visitor): void {
        visitor.visitDescription(this)
    }
}

export default Description;