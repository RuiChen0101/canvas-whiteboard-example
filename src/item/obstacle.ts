import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import ResizeStrategy, { FreeResizeStrategy } from '../interactor/resize-strategy';

interface ObstacleState extends ItemState { }

class Obstacle extends ItemBase<ObstacleState> {

    public get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    public get resizeStrategy(): ResizeStrategy {
        return new FreeResizeStrategy();
    }

    public get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    visit(visitor: Visitor): void {
        visitor.visitObstacle(this);
    }
}

export default Obstacle;
export type { ObstacleState };