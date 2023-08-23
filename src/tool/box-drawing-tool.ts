import Tool from './tool';
import Box from '../item/box';
import Shape from '../shape/shape';
import Random from '../util/random';
import AppContext from '../AppContext';
import ItemPool from '../item/item-pool';
import Rectangle from '../shape/rectangle';
import SizeIndicator from '../indicator/size-indicator';
import { ORIGIN, Point, ensureTopLeftSize } from '../util/point';

class BoxDrawingTool implements Tool {
    private _endPos: Point = ORIGIN;
    private _startPos: Point = ORIGIN;
    private _activate: boolean = false;
    private _random: Random = new Random();

    private _ctx: AppContext;

    private _itemPool: ItemPool;

    get cursor(): string {
        return 'crosshair';
    }

    get isStatic(): boolean {
        return false;
    }

    constructor(ctx: AppContext, itemPool: ItemPool) {
        this._ctx = ctx;
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
        if (this._checkOutBound()) return;
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const id = this._random.nanoid8();
        this._itemPool.addItem(new Box({ id: id, pos: topLeft, size: size, rotate: 0 }));
        this._itemPool.selectItem(id);
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const color: string | undefined = this._checkOutBound() ? "#dc3545" : undefined;
        return [
            ...(new SizeIndicator(topLeft, size).draw()),
            new Rectangle({ pos: topLeft, size: size, borderColor: color })
        ];
    }

    private _checkOutBound(): boolean {
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const bottomRight = { x: topLeft.x + size.w, y: topLeft.y + size.h };
        return this._ctx.editableTopLeftPos.x > topLeft.x || this._ctx.editableTopLeftPos.y > topLeft.y || this._ctx.editableBottomRightPos.x < bottomRight.x || this._ctx.editableBottomRightPos.y < bottomRight.y;
    }
}

export default BoxDrawingTool;