import Visitor from '../visitor/visitor';
import { ItemBase, ItemState } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/strategy/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/strategy/rotate-strategy';
import ResizeStrategy, { FreeResizeStrategy } from '../interactor/strategy/resize-strategy';
import IndicatorStrategy, { SizeIndicatorStrategy } from '../interactor/strategy/indicator-strategy';

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