import { ORIGIN, Point } from '../util/point';
import Shape from './shape';

type TextProp = {
    width?: number;
    pos?: Point;
    text?: string;
    fontSize?: number;
    lineHeight?: number;
    vAlign?: 'top' | 'middle' | 'bottom';
    hAlign?: 'center' | 'start' | 'end';
    font?: string;
    color?: string;
}

class Text implements Shape {
    private _width?: number;
    private _pos: Point;
    private _text: string;
    private _fontSize: number;
    private _lineHeight: number;
    private _vAlign: 'top' | 'middle' | 'bottom';
    private _hAlign: 'center' | 'start' | 'end';
    private _font: string;
    private _color: string;

    constructor(prop?: TextProp) {
        this._width = prop?.width;
        this._pos = prop?.pos ?? ORIGIN;
        this._text = prop?.text ?? "";
        this._font = prop?.font ?? "serif";
        this._fontSize = prop?.fontSize ?? 16;
        this._lineHeight = prop?.lineHeight ?? 1.2;
        this._vAlign = prop?.vAlign ?? 'top';
        this._hAlign = prop?.hAlign ?? 'start';
        this._color = prop?.color ?? "#000";
    }

    private _textHeight = (): number => {
        const lineCount = (this._text.match(/\n/g) ?? []).length + 1;
        return this._fontSize + (this._fontSize * this._lineHeight * (lineCount - 1));
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.fillStyle = this._color;
        context.font = `${this._fontSize}px ${this._font}`;
        context.textAlign = this._hAlign;
        context.textBaseline = this._vAlign;
        let topStart = this._pos.y;
        if (this._vAlign === 'middle') {
            topStart = topStart - (this._textHeight() / 2) + (this._fontSize * this._lineHeight / 2);
        }
        const lines = this._text.split(/\n/g);
        const height = this._lineHeight * this._fontSize
        context.fillText(lines[0], this._pos.x, topStart, this._width);
        for (let i = 1; i < lines.length; i++) {
            context.fillText(lines[i], this._pos.x, topStart + (height * i), this._width);
        }
        context.closePath();
    }
}

export default Text;
export type { TextProp };