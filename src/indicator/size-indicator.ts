import Text from '../shape/text';
import Shape from '../shape/shape';
import { Size } from '../util/size';
import Rotate from '../shape/rotate';
import { Point } from '../util/point';

class SizeIndicator {
    private _pos: Point;
    private _size: Size;

    constructor(pos: Point, size: Size) {
        this._pos = pos;
        this._size = size;
    }

    draw(): Shape[] {
        const width = this._size.w.toFixed(1);
        const hight = this._size.h.toFixed(1);
        const topCenter: Point = { x: this._pos.x + (this._size.w / 2), y: this._pos.y - 12 };
        const leftCenter: Point = { x: this._pos.x - 12, y: this._pos.y + (this._size.h / 2) };
        return [
            new Text({ pos: topCenter, text: `${width}px`, vAlign: 'middle', hAlign: 'center', color: '#0d6efd' }),
            new Rotate({
                anchor: leftCenter, rotate: 270, shapes: [
                    new Text({ pos: leftCenter, text: `${hight}px`, vAlign: 'middle', hAlign: 'center', color: '#0d6efd' })
                ]
            })
        ]
    }
}

export default SizeIndicator;