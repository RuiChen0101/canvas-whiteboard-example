import Visitor from '../visitor/visitor';
import Item, { ItemBase, ItemState } from './item';

interface ObstacleState extends ItemState { }

class Obstacle extends ItemBase<ObstacleState> {

    visit(visitor: Visitor): void {
        visitor.visitObstacle(this);
    }
}

export default Obstacle;
export type { ObstacleState };