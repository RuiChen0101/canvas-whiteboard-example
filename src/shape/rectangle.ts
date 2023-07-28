import Shape from './shape';
import { ORIGIN, Point } from '../util/point';
import { ZERO_SIZE, Size } from '../util/size';

type RectangleProp = {
    pos?: Point;
    size?: Size;
    color?: string;
    radius?: number;
    borderWidth?: number;
    borderColor?: string;
}

class Rectangle implements Shape {
    private _pos: Point;
    private _size: Size;
    private _color: string;
    private _radius: number;
    private _borderWidth: number;
    private _borderColor: string;

    constructor(prop?: RectangleProp) {
        this._pos = prop?.pos ?? ORIGIN;
        this._size = prop?.size ?? ZERO_SIZE;
        this._color = prop?.color ?? "transparent";
        this._radius = prop?.radius ?? 0;
        this._borderWidth = prop?.borderWidth ?? 1;
        this._borderColor = prop?.borderColor ?? "#000";
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.lineWidth = this._borderWidth;
        context.fillStyle = this._color;
        context.strokeStyle = this._borderColor;
        context.roundRect(this._pos.x, this._pos.y, this._size.w, this._size.h, this._radius);
        context.fill();
        context.stroke();
        context.closePath();
    }
}

export default Rectangle;
export type { RectangleProp };