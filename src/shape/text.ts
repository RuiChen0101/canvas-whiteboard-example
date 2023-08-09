import { ORIGIN, Point } from '../util/point';
import Shape from './shape';

type TextProp = {
    width?: number;
    pos?: Point;
    text?: string;
    fontSize?: string;
    vAlign?: 'top' | 'middle' | 'bottom';
    hAlign?: 'center' | 'start' | 'end';
    font?: string;
    color?: string;
}

class Text implements Shape {
    private _width?: number;
    private _pos: Point;
    private _text: string;
    private _fontSize: string;
    private _vAlign: 'top' | 'middle' | 'bottom';
    private _hAlign: 'center' | 'start' | 'end';
    private _font: string;
    private _color: string;

    constructor(prop?: TextProp) {
        this._width = prop?.width;
        this._pos = prop?.pos ?? ORIGIN;
        this._text = prop?.text ?? "";
        this._font = prop?.font ?? "serif";
        this._fontSize = prop?.fontSize ?? "12px";
        this._vAlign = prop?.vAlign ?? 'top';
        this._hAlign = prop?.hAlign ?? 'start';
        this._color = prop?.color ?? "#000";
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.fillStyle = this._color;
        context.font = `${this._fontSize} ${this._font}`;
        context.textAlign = this._hAlign;
        context.textBaseline = this._vAlign;
        context.fillText(this._text, this._pos.x, this._pos.y, this._width);
        context.closePath();
    }
}

export default Text;
export type { TextProp };