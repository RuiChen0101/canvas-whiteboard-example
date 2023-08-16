import Tool from './tool';
import Shape from '../shape/shape';
import Random from '../util/random';
import ItemPool from '../item/item-pool';
import Rectangle from '../shape/rectangle';
import { ORIGIN, Point, ensureTopLeftSize } from '../util/point';
import Booth from '../item/box';

class BoxDrawingTool implements Tool {
    private _startPos: Point = ORIGIN;
    private _endPos: Point = ORIGIN;
    private _activate: boolean = false;
    private _random: Random = new Random();

    private _itemPool: ItemPool;

    get cursor(): string {
        return 'crosshair';
    }

    get isStatic(): boolean {
        return false;
    }

    constructor(itemPool: ItemPool) {
        this._itemPool = itemPool;
    }

    onStart(pos: Point): void {
        this._startPos = pos;
        this._endPos = pos;
        this._activate = true;
    }

    onMove(pos: Point): void {
        this._activate = true;
        this._endPos = pos;
    }

    onEnd(pos: Point): void {
        this._activate = false;
        this._endPos = pos;
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const id = this._random.nanoid8();
        this._itemPool.addItem(new Booth({ id: id, pos: topLeft, size: size, rotate: 0, name: '' }));
        this._itemPool.selectItem(id);
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        return [
            new Rectangle({ pos: topLeft, size: size })
        ];
    }
}

export default BoxDrawingTool;