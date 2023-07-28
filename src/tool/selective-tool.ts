import Tool from './tool';
import Shape from '../shape/shape';
import { ORIGIN, Point } from '../util/point';
import Rectangle from '../shape/rectangle';

class SelectiveTool implements Tool {
    private _startPos: Point = ORIGIN;
    private _endPos: Point = ORIGIN;
    private _activate: boolean = false;

    onStart(pos: Point): void {
        this._activate = true;
        this._startPos = pos;
        this._endPos = pos;
    }

    onMove(pos: Point): void {
        this._activate = true;
        this._endPos = pos;
    }

    onEnd(pos: Point): void {
        this._activate = false;
        this._endPos = pos;
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        return [
            new Rectangle({ pos: this._startPos, size: { w: this._endPos.x - this._startPos.x, h: this._endPos.y - this._startPos.y }, borderColor: "#0d6efd", color: "#0d6efd1a" })
        ];
    }
}

export default SelectiveTool;