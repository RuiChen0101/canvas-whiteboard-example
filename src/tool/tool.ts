import Shape from '../shape/shape';
import { Point } from '../util/point';

interface Tool {
    get cursor(): string;
    get isStatic(): boolean;
    onStart(pos: Point): void;
    onMove(pos: Point): void;
    onEnd(pos: Point): void;
    draw(): Shape[];
}

export default Tool;