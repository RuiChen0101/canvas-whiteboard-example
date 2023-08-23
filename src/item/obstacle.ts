import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import ResizeStrategy, { FreeResizeStrategy } from '../interactor/resize-strategy';
import IndicatorStrategy, { SizeIndicatorStrategy } from '../interactor/indicator-strategy';

interface ObstacleState extends ItemState { }

class Obstacle extends ItemBase<ObstacleState> {

    get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    get resizeStrategy(): ResizeStrategy {
        return new FreeResizeStrategy();
    }

    get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    get indicatorStrategy(): IndicatorStrategy {
        return new SizeIndicatorStrategy();
    }

    visit(visitor: Visitor): void {
        visitor.visitObstacle(this);
    }
}

export default Obstacle;
export type { ObstacleState };