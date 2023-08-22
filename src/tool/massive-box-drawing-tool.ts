import Tool from './tool';
import Box from '../item/box';
import Shape from '../shape/shape';
import Random from '../util/random';
import AppContext, { DEFAULT_DISPLAY } from '../AppContext';
import ItemPool from '../item/item-pool';
import Rectangle from '../shape/rectangle';
import DrawingVisitor from '../visitor/drawing-visitor';
import { ORIGIN, Point, ensureTopLeftSize } from '../util/point';

class MassiveBoxDrawingTool implements Tool {
    private _startPos: Point = ORIGIN;
    private _endPos: Point = ORIGIN;
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
        const box = this._populateBox();
        const validBox: Box[] = [];
        const validIds: string[] = [];
        for (const b of box) {
            if (this._itemPool.isCollide(b.pos, b.size, b.rotate) || this._checkOutBound(b)) continue;
            validBox.push(b);
            validIds.push(b.id);
        }
        this._itemPool.addItems(validBox);
        this._itemPool.selectItems(validIds);
    }

    draw(): Shape[] {
        if (!this._activate) return [];
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const box = this._populateBox();
        const visitor = new DrawingVisitor(DEFAULT_DISPLAY, new Map());
        for (const b of box) {
            if (this._itemPool.isCollide(b.pos, b.size, b.rotate) || this._checkOutBound(b)) {
                b.setIsCollide(true);
            }
            b.visit(visitor);
        }
        return [
            ...visitor.getResult(),
            new Rectangle({ pos: topLeft, size: size })
        ];
    }

    private _populateBox(): Box[] {
        const [topLeft, size] = ensureTopLeftSize(this._startPos, this._endPos);
        const countW = Math.floor(size.w / 100);
        const countH = Math.floor(size.h / 50);
        if (countW === 0 || countH === 0) return [];
        const box: Box[] = [];
        for (let i = 0; i < countW; i++) {
            for (let j = 0; j < countH; j++) {
                box.push(new Box({ id: this._random.nanoid8(), pos: { x: topLeft.x + (105 * i), y: topLeft.y + (55 * j) }, size: { w: 100, h: 50 }, rotate: 0 }));
            }
        }
        return box;
    }

    private _checkOutBound(box: Box): boolean {
        const bottomRight = { x: box.pos.x + box.size.w, y: box.pos.y + box.size.h };
        return this._ctx.editableTopLeftPos.x > box.pos.x || this._ctx.editableTopLeftPos.y > box.pos.y || this._ctx.editableBottomRightPos.x < bottomRight.x || this._ctx.editableBottomRightPos.y < bottomRight.y;
    }
}

export default MassiveBoxDrawingTool;