import { Size } from '../util/size';
import { Point } from '../util/point';
import Item, { ItemBase } from './item';
import Visitor from '../visitor/visitor';

type TableProp = {
    id: string,
    pos: Point,
    size: Size,
    rotate: number,
}

class Table extends ItemBase implements Item {

    constructor(prop: TableProp) {
        super(prop.id, prop.pos, prop.size, prop.rotate);
    }

    visit(visitor: Visitor): void {
        visitor.visitTable(this);
    }
}

export default Table;