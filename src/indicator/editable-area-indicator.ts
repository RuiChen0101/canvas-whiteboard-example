import Shape from '../shape/shape';
import { Point, centerPoint, diffPoints } from '../util/point';
import Rectangle from '../shape/rectangle';
import { Size } from '../util/size';

class EditableAreaIndicator {
    private _topLeft: Point;
    private _bottomRight: Point;
    private _size: Size;

    constructor(topLeft: Point, bottomRight: Point) {
        this._topLeft = topLeft;
        this._bottomRight = bottomRight;
        this._size = { w: bottomRight.x - topLeft.x, h: bottomRight.y - topLeft.y };
    }

    draw(): Shape[] {
        return [
            new Rectangle({ pos: this._topLeft, size: { w: 10, h: 10 } }),
            new Rectangle({ pos: { x: this._bottomRight.x - 10, y: this._topLeft.y }, size: { w: 10, h: 10 } }),
            new Rectangle({ pos: { x: this._topLeft.x, y: this._bottomRight.y - 10 }, size: { w: 10, h: 10 } }),
            new Rectangle({ pos: diffPoints(this._bottomRight, { x: 10, y: 10 }), size: { w: 10, h: 10 } }),
            new Rectangle({ pos: diffPoints(centerPoint(this._topLeft, this._size), { x: 10, y: 10 }), size: { w: 10, h: 10 } }),
            new Rectangle({ pos: this._topLeft, size: this._size }),
        ]
    }
}

export default EditableAreaIndicator;