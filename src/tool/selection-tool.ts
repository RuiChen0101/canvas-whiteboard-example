import Tool from './tool';
import Shape from '../shape/shape';
import Rectangle from '../shape/rectangle';
import { ORIGIN, Point, ensureTopLeftSize } from '../util/point';
import ItemPool from '../item/item-pool';
import { ZERO_SIZE } from '../util/size';

class SelectionTool implements Tool {
    private _startPos: Point = ORIGIN;
    private _endPos: Point = ORIGIN;
    private _activate: boolean = false;

    private _itemPool: ItemPool;

    constructor(itemPool: ItemPool) {
        this._itemPool = itemPool;
    }

    onStart(pos: Point): void {
        this._activate = true;
        this._startPos = pos;
        this._endPos = pos;
        this._itemPool.selectItem(this._startPos, ZERO_SIZE);
    }

    onMove(pos: Point): void {
        this._activate = true;
        this._endPos = pos;
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        this._itemPool.selectItem(topLeft, size);
    }

    onEnd(pos: Point): void {
        this._activate = false;
        this._endPos = pos;
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        this._itemPool.selectItem(topLeft, size);
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        return [
            new Rectangle({ pos: topLeft, size: size, borderColor: "#0d6efd", color: "#0d6efd1a" })
        ];
    }
}

export default SelectionTool;