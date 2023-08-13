import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import { ORIGIN, Point } from '../util/point';
import { Size, ZERO_SIZE } from '../util/size';
import MoveStrategy, { FreeMoveStrategy } from './move-strategy';
import RotateStrategy, { FreeRotateStrategy } from './rotate-strategy';
import ResizeStrategy, { DiagonalResizeStrategy } from './resize-strategy';
import { ANCHOR_SIZE, InteractingType, InteractorContext, ItemInteractor, PADDING } from './item-interactor';

class MultiItemInteractor implements ItemInteractor {
    private _items: Item[] = [];

    private _context: InteractorContext = {
        topLeft: ORIGIN,
        topCenter: ORIGIN,
        topRight: ORIGIN,
        bottomLeft: ORIGIN,
        bottomRight: ORIGIN,
        size: ZERO_SIZE,
        lastPos: ORIGIN,
    };

    private _resizeStrategy: ResizeStrategy = new DiagonalResizeStrategy();
    private _rotateStrategy: RotateStrategy = new FreeRotateStrategy();
    private _moveStrategy: MoveStrategy = new FreeMoveStrategy();

    private _interact: InteractingType = InteractingType.None;

    public get items(): Item[] {
        return this._items;
    }

    public get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    constructor(items: Item[]) {
        this._items = items;
        this._inferPosAndSize();
    }

    checkInteract(pos: Point, doubleClick: boolean = false): InteractingType {
        const ctx = this._context;
        if (ctx.topLeft.x - PADDING - 6 <= pos.x && ctx.topLeft.x - PADDING + 6 >= pos.x && ctx.topLeft.y - PADDING - 6 <= pos.y && ctx.topLeft.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (ctx.topRight.x + PADDING - 6 <= pos.x && ctx.topRight.x + PADDING + 6 >= pos.x && ctx.topRight.y - PADDING - 6 <= pos.y && ctx.topRight.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (ctx.bottomLeft.x - PADDING - 6 <= pos.x && ctx.bottomLeft.x - PADDING + 6 >= pos.x && ctx.bottomLeft.y + PADDING - 6 <= pos.y && ctx.bottomLeft.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (ctx.bottomRight.x + PADDING - 6 <= pos.x && ctx.bottomRight.x + PADDING + 6 >= pos.x && ctx.bottomRight.y + PADDING - 6 <= pos.y && ctx.bottomRight.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (ctx.topCenter.x - 5 <= pos.x && ctx.topCenter.x + 5 >= pos.x && ctx.topCenter.y - PADDING - 15 <= pos.y && ctx.topCenter.y - PADDING - 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (ctx.topLeft.x - PADDING <= pos.x && ctx.topLeft.y - PADDING <= pos.y && ctx.bottomRight.x + PADDING >= pos.x && ctx.bottomRight.y + PADDING >= pos.y) {
            return InteractingType.Body;
        }
        return InteractingType.None;
    }

    onTextEditStart(): [string, Point, Size, number, string] {
        return ['none', ORIGIN, ZERO_SIZE, 0, ''];
    }

    onTextEdit(text: string): [Point, Size, number] { return [ORIGIN, ZERO_SIZE, 0]; }

    onTextEditEnd(text: string): void { }

    onDragStart(pos: Point): void {
        const interact = this.checkInteract(pos);
        if (interact === InteractingType.None) return;
        this._interact = interact;
        this._context.lastPos = pos;
    }

    onDragMove(pos: Point): void {
        if (this._interact === InteractingType.None) return;

        switch (this._interact) {
            case InteractingType.Body:
                this._moveStrategy.move(this._context, this._items, pos);
                break;
            case InteractingType.TopLeft:
                this._resizeStrategy.resizeTopLeft(this._context, this._items, pos);
                break;
            case InteractingType.TopRight:
                this._resizeStrategy.resizeTopRight(this._context, this._items, pos);
                break;
            case InteractingType.BottomLeft:
                this._resizeStrategy.resizeBottomLeft(this._context, this._items, pos);
                break;
            case InteractingType.BottomRight:
                this._resizeStrategy.resizeBottomRight(this._context, this._items, pos);
                break;
            case InteractingType.Rotate:
                this._rotateStrategy.rotate(this._context, this._items, pos);
                break;
        }
        this._context.lastPos = { ...pos };

        this._inferPosAndSize();
    }

    onDragEnd(pos: Point): void {
        if (this._interact === InteractingType.None) return;

        this._interact = InteractingType.None;
        this._context.lastPos = pos;
    }

    draw(): Shape[] {
        const ctx = this._context;
        return [
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING }, size: { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) }, borderColor: "#0d6efd" }),
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING - 4, y: ctx.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.topRight.x + PADDING - 4, y: ctx.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomLeft.x - PADDING - 4, y: ctx.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomRight.x + PADDING - 4, y: ctx.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
            new Circle({ pos: { x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
        ];
    }

    private _inferPosAndSize(): void {
        if (this._items.length === 0) return;
        const [p1, p2] = this._items[0].boundingBox

        for (const i of this._items) {
            const [iP1, iP2] = i.boundingBox;
            p1.x = Math.min(p1.x, iP1.x);
            p1.y = Math.min(p1.y, iP1.y);
            p2.x = Math.max(p2.x, iP2.x);
            p2.y = Math.max(p2.y, iP2.y);
        }

        this._context.topLeft = { x: p1.x, y: p1.y };
        this._context.topRight = { x: p2.x, y: p1.y };
        this._context.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        this._context.bottomLeft = { x: p1.x, y: p2.y };
        this._context.bottomRight = { x: p2.x, y: p2.y };
        this._context.size = { w: this._context.bottomRight.x - this._context.topLeft.x, h: this._context.bottomRight.y - this._context.topLeft.y };
    }
}

export default MultiItemInteractor;