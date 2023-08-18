import Shape from './shape';
import { ORIGIN, Point } from '../util/point';

type CircleProp = {
    pos?: Point;
    color?: string;
    radius?: number;
    borderWidth?: number;
    borderColor?: string;
}

class Circle implements Shape {
    private _pos: Point;
    private _color: string;
    private _radius: number;
    private _borderWidth: number;
    private _borderColor: string;

    constructor(prop?: CircleProp) {
        this._pos = prop?.pos ?? ORIGIN;
        this._color = prop?.color ?? "transparent";
        this._radius = prop?.radius ?? 0;
        this._borderWidth = prop?.borderWidth ?? 0;
        this._borderColor = prop?.borderColor ?? "#000";
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.lineWidth = this._borderWidth;
        context.fillStyle = this._color;
        context.strokeStyle = this._borderColor;
        context.arc(this._pos.x, this._pos.y, this._radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();
    }
}

export default Circle;
export type { CircleProp };