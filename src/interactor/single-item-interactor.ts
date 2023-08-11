import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rotate from '../shape/rotate';
import Rectangle from '../shape/rectangle';
import { Size, ZERO_SIZE } from '../util/size';
import Item, { TextEditableItem } from '../item/item';
import MoveStrategy, { FreeMoveStrategy } from './move-strategy';
import ResizeStrategy, { FreeResizeStrategy } from './resize-strategy';
import RotateStrategy, { FreeRotateStrategy } from './rotate-strategy';
import { ORIGIN, Point, centerPoint, rotatePoint } from '../util/point';
import TextEditStrategy, { FreeTextEditStrategy } from './text-edit-strategy';
import { fourCornerForRotatedRectangle, isRectangleCollide } from '../util/bounding-box';
import { ANCHOR_SIZE, InteractingType, InteractorContext, ItemInteractor, PADDING } from './item-interactor';

class SingleItemInteractor implements ItemInteractor {
    private _item: Item;

    private _context: InteractorContext = {
        topLeft: ORIGIN,
        topCenter: ORIGIN,
        topRight: ORIGIN,
        bottomLeft: ORIGIN,
        bottomRight: ORIGIN,
        size: ZERO_SIZE,
        lastPos: ORIGIN,
    };

    private _textEditStrategy: TextEditStrategy = new FreeTextEditStrategy();
    private _resizeStrategy: ResizeStrategy = new FreeResizeStrategy();
    private _rotateStrategy: RotateStrategy = new FreeRotateStrategy();
    private _moveStrategy: MoveStrategy = new FreeMoveStrategy();

    private _interact: InteractingType = InteractingType.None;

    public get items(): Item[] {
        return [this._item];
    }

    public get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    constructor(item: Item) {
        this._item = item;
        this._inferPosAndSize();
    }

    checkInteract(pos: Point, doubleClick: boolean = false): InteractingType {
        const ctx = this._context;
        const p = { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING };
        const s = { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) };
        const [topLeft, topRight, bottomRight, bottomLeft] = fourCornerForRotatedRectangle(p, s, this._item.rotate);
        const topCenter = rotatePoint({ x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, centerPoint(ctx.topLeft, ctx.size), this._item.rotate);

        if (topLeft.x - 6 <= pos.x && topLeft.x + 6 >= pos.x && topLeft.y - 6 <= pos.y && topLeft.y + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (topRight.x - 6 <= pos.x && topRight.x + 6 >= pos.x && topRight.y - 6 <= pos.y && topRight.y + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (bottomLeft.x - 6 <= pos.x && bottomLeft.x + 6 >= pos.x && bottomLeft.y - 6 <= pos.y && bottomLeft.y + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (bottomRight.x - 6 <= pos.x && bottomRight.x + 6 >= pos.x && bottomRight.y - 6 <= pos.y && bottomRight.y + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (topCenter.x - 5 <= pos.x && topCenter.x + 5 >= pos.x && topCenter.y - 5 <= pos.y && topCenter.y + 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (isRectangleCollide(ctx.topLeft, ctx.size, this._item.rotate, pos, { w: 1, h: 1 }, 0)) {
            if (doubleClick && 'textEditable' in this._item) {
                return InteractingType.Text;
            }
            return InteractingType.Body;
        }
        return InteractingType.None;
    }

    onTextEditStart(): [string, Point, Size, number, string] {
        if (!('textEditable' in this._item)) return ['none', ORIGIN, ZERO_SIZE, 0, ''];
        this._interact = InteractingType.Text;
        return this._textEditStrategy.startEdit(this._context, this._item as TextEditableItem);
    }

    onTextEdit(text: string): void {
        this._textEditStrategy.onEdit(this._context, this._item as TextEditableItem, text);
        this._inferPosAndSize();
    }

    onTextEditEnd(text: string): void {
        this._textEditStrategy.endEdit(this._context, this._item as TextEditableItem, text);
        this._interact = InteractingType.None;
        this._inferPosAndSize();
    }

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
                this._moveStrategy.move(this._context, [this._item], pos);
                break;
            case InteractingType.TopLeft:
                this._resizeStrategy.resizeTopLeft(this._context, [this._item], pos);
                break;
            case InteractingType.TopRight:
                this._resizeStrategy.resizeTopRight(this._context, [this._item], pos);
                break;
            case InteractingType.BottomLeft:
                this._resizeStrategy.resizeBottomLeft(this._context, [this._item], pos);
                break;
            case InteractingType.BottomRight:
                this._resizeStrategy.resizeBottomRight(this._context, [this._item], pos);
                break;
            case InteractingType.Rotate:
                this._rotateStrategy.rotate(this._context, [this._item], pos);
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
        const i = this._item;
        return [
            new Rotate({
                anchor: centerPoint(i.pos, i.size), rotate: i.rotate, shapes: [
                    new Rectangle({ pos: { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING }, size: { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) }, borderColor: "#0d6efd" }),
                    new Rectangle({ pos: { x: ctx.topLeft.x - PADDING - 4, y: ctx.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.topRight.x + PADDING - 4, y: ctx.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.bottomLeft.x - PADDING - 4, y: ctx.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Rectangle({ pos: { x: ctx.bottomRight.x + PADDING - 4, y: ctx.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: "#0d6efd", color: "#fff" }),
                    new Circle({ pos: { x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, radius: 5, borderColor: "#0d6efd", color: "#fff" })
                ]
            })
        ];
    }

    private _inferPosAndSize(): void {
        const p1 = this._item.pos;
        const p2 = { x: this._item.pos.x + this._item.size.w, y: this._item.pos.y + this._item.size.h };

        this._context.topLeft = { x: p1.x, y: p1.y };
        this._context.topRight = { x: p2.x, y: p1.y };
        this._context.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        this._context.bottomLeft = { x: p1.x, y: p2.y };
        this._context.bottomRight = { x: p2.x, y: p2.y };
        this._context.size = { ...this._item.size };
    }
}

export default SingleItemInteractor;