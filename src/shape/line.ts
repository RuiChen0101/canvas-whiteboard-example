import Shape from './shape';
import { ORIGIN, Point } from '../util/point';

type LineProp = {
    start?: Point;
    end?: Point;
    color?: string;
    width?: number;
}

class Line implements Shape {
    private _start: Point;
    private _end: Point;
    private _color: string;
    private _width: number;

    constructor(prop?: LineProp) {
        this._start = prop?.start ?? ORIGIN;
        this._end = prop?.end ?? ORIGIN;
        this._color = prop?.color ?? "#000";
        this._width = prop?.width ?? 0;
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.strokeStyle = this._color;
        context.lineWidth = this._width;
        context.moveTo(this._start.x, this._start.y);
        context.lineTo(this._end.x, this._end.y);
        context.stroke();
        context.closePath();
    }
}

export default Line;
export type { LineProp };