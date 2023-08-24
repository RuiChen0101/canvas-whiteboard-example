import Item from '../../item/item';
import Shape from '../../shape/shape';
import { InteractorInfo } from '../item-interactor';
import SizeIndicator from '../../indicator/size-indicator';

interface IndicatorStrategy {
    draw(info: InteractorInfo, items: Item[]): Shape[];
}

class SizeIndicatorStrategy implements IndicatorStrategy {
    draw(info: InteractorInfo, items: Item[]): Shape[] {
        return new SizeIndicator(info.topLeft, info.size).draw()
    }
}

class NoIndicatorStrategy implements IndicatorStrategy {
    draw(info: InteractorInfo, items: Item[]): Shape[] {
        return [];
    }
}

export default IndicatorStrategy;
export {
    SizeIndicatorStrategy,
    NoIndicatorStrategy
}