import { Size } from '../util/size';
import { Point } from '../util/point';
import Item, { ItemBase } from './item';
import Visitor from '../visitor/visitor';

type ObstacleProp = {
    id: string,
    pos: Point,
    size: Size,
    rotate: number
}

class Obstacle extends ItemBase implements Item {

    constructor(prop: ObstacleProp) {
        super(prop.id, prop.pos, prop.size, prop.rotate);
    }

    visit(visitor: Visitor): void {

    }
}

export default Obstacle;