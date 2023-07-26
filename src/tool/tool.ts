import Shape from '../shape/shape';
import { Point } from '../util/point';

interface Tool {
    onStart(pos: Point): void;
    onMove(pos: Point): void;
    onEnd(pos: Point): void;
    draw(): Shape[];
}

export default Tool;