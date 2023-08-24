import Tool from './tool';
import Line from '../shape/line';
import Text from '../shape/text';
import Shape from '../shape/shape';
import Rotate from '../shape/rotate';
import { ORIGIN, Point, addPoints, diffPoints, middlePoint, pointAngle, pointDistance } from '../util/point';

class MeasureTool implements Tool {
    private _startPos: Point = ORIGIN;
    private _angle: number = 0;
    private _distance: number = 0;
    private _activate: boolean = false;

    get cursor(): string {
        return 'crosshair';
    }

    get isStatic(): boolean {
        return true;
    }

    onStart(pos: Point): void {
        this._startPos = pos;
        this._angle = 0;
        this._distance = 0;
        this._activate = true;
    }

    onMove(pos: Point): void {
        this._activate = true;
        this._distance = pointDistance(pos, this._startPos);
        this._angle = pointAngle({ x: 1, y: 0 }, diffPoints(pos, this._startPos));
    }

    onEnd(pos: Point): void {
        this._activate = false;
        this._distance = pointDistance(pos, this._startPos);
        this._angle = pointAngle({ x: 1, y: 0 }, diffPoints(pos, this._startPos));
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        const endPoint = addPoints(this._startPos, { x: this._distance, y: 0 });
        const middle = middlePoint(this._startPos, endPoint);

        return [
            new Rotate({
                anchor: this._startPos, rotate: this._angle, shapes: [
                    new Text({ text: `${this._distance.toFixed(2)}px`, pos: { x: middle.x, y: middle.y - 12 }, vAlign: 'middle', hAlign: 'center', color: '#0d6efd' }),
                    new Line({ start: this._startPos, end: endPoint, color: '#0d6efd' }),
                    new Line({ start: { x: this._startPos.x, y: this._startPos.y - 10 }, end: { x: this._startPos.x, y: this._startPos.y + 10 }, color: '#0d6efd' }),
                    new Line({ start: { x: endPoint.x, y: endPoint.y - 10 }, end: { x: endPoint.x, y: endPoint.y + 10 }, color: '#0d6efd' }),
                ]
            })
        ]
    }
}

export default MeasureTool;