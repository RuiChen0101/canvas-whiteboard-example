import { ORIGIN, Point } from '../util/point';
import Shape from './shape';

type TextProp = {
    width?: number;
    pos?: Point;
    text?: string;
    fontSize?: string;
    font?: string;
}

class Text implements Shape {
    private _width?: number;
    private _pos: Point;
    private _text: string;
    private _fontSize: string;
    private _font: string;

    constructor(prop?: TextProp) {
        this._width = prop?.width;
        this._pos = prop?.pos ?? ORIGIN;
        this._text = prop?.text ?? "";
        this._font = prop?.font ?? "serif";
        this._fontSize = prop?.fontSize ?? "12px";
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.font = `${this._fontSize} ${this._font}`;
        context.fillText(this._text, this._pos.x, this._pos.y, this._width);
        context.closePath();
    }
}

export default Text;
export type { TextProp };