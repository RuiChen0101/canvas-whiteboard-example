import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rotate from '../shape/rotate';
import AppContext from '../AppContext';
import Rectangle from '../shape/rectangle';
import MoveStrategy from './move-strategy';
import { Size, ZERO_SIZE } from '../util/size';
import ResizeStrategy from './resize-strategy';
import RotateStrategy from './rotate-strategy';
import { FontStyle } from '../type/font-style';
import TextEditStrategy from './text-edit-strategy';
import Item, { TextEditableItem } from '../item/item';
import { ORIGIN, Point, centerPoint, rotatePoint } from '../util/point';
import { fourCornerForRotatedRectangle, isRectangleCollide } from '../util/bounding-box';
import { ANCHOR_SIZE, InteractingType, InteractorInfo, ItemInteractor, PADDING } from './item-interactor';
import IndicatorStrategy from './indicator-strategy';

class SingleItemInteractor implements ItemInteractor {
    private _item: Item;

    private _info: InteractorInfo = {
        topLeft: ORIGIN,
        topCenter: ORIGIN,
        topRight: ORIGIN,
        bottomLeft: ORIGIN,
        bottomRight: ORIGIN,
        size: ZERO_SIZE,
        lastPos: ORIGIN,
    };

    private _moveStrategy: MoveStrategy;
    private _resizeStrategy: ResizeStrategy;
    private _rotateStrategy: RotateStrategy;
    private _textEditStrategy?: TextEditStrategy;
    private _indicatorStrategy: IndicatorStrategy;

    private _interact: InteractingType = InteractingType.None;

    private _stillStatic: boolean = true;

    private _invalid: boolean = false;

    get items(): Item[] {
        return [this._item];
    }

    get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    get stillStatic(): boolean {
        return this._stillStatic;
    }

    constructor(item: Item) {
        this._item = item;
        this._moveStrategy = item.moveStrategy;
        this._resizeStrategy = item.resizeStrategy;
        this._rotateStrategy = item.rotateStrategy;
        this._indicatorStrategy = item.indicatorStrategy;
        if (!('textEditable' in this._item)) {
            this._textEditStrategy = (this._item as TextEditableItem).textEditStrategy;
        }
        this._inferPosAndSize();
    }

    checkInteract(pos: Point, doubleClick: boolean = false): InteractingType {
        const info = this._info;
        const p = { x: info.topLeft.x - PADDING, y: info.topLeft.y - PADDING };
        const s = { w: info.size.w + (PADDING * 2), h: info.size.h + (PADDING * 2) };
        const [topLeft, topRight, bottomRight, bottomLeft] = fourCornerForRotatedRectangle(p, s, this._item.rotate);
        const topCenter = rotatePoint({ x: info.topCenter.x, y: info.topCenter.y - PADDING - 10 }, centerPoint(info.topLeft, info.size), this._item.rotate);

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
        if (isRectangleCollide(info.topLeft, info.size, this._item.rotate, pos, { w: 1, h: 1 }, 0)) {
            if (doubleClick && this._textEditStrategy !== undefined) {
                return InteractingType.Text;
            }
            return InteractingType.Body;
        }
        return InteractingType.None;
    }

    onTextEditStart(): [string, Point, Size, number, FontStyle, string] {
        if (this._textEditStrategy === undefined) throw 'selected item dose not support text edit';
        this._stillStatic = true;
        this._interact = InteractingType.Text;
        return this._textEditStrategy.startEdit(this._info, this._item as TextEditableItem);
    }

    onTextEdit(ctx: AppContext, text: string): [Point, Size, number] {
        if (this._textEditStrategy === undefined) throw 'selected item dose not support text edit';
        this._stillStatic = false;
        const [pos, size, rotate] = this._textEditStrategy.onEdit(this._info, this._item as TextEditableItem, text);
        this._inferPosAndSize();
        this._checkOutBound(ctx);
        return [pos, size, rotate];
    }

    onTextEditEnd(text: string): boolean {
        if (this._textEditStrategy === undefined) throw 'selected item dose not support text edit';
        this._stillStatic = false;
        this._textEditStrategy.endEdit(this._info, this._item as TextEditableItem, text);
        this._interact = InteractingType.None;
        this._inferPosAndSize();
        return this._invalid;
    }

    onDragStart(pos: Point): void {
        const interact = this.checkInteract(pos);
        if (interact === InteractingType.None) return;
        this._stillStatic = true;
        this._interact = interact;
        this._info.lastPos = pos;
    }

    onDragMove(ctx: AppContext, pos: Point): void {
        if (this._interact === InteractingType.None) return;
        this._stillStatic = false;
        switch (this._interact) {
            case InteractingType.Body:
                this._moveStrategy.move(this._info, [this._item], pos);
                break;
            case InteractingType.TopLeft:
                this._resizeStrategy.resizeTopLeft(this._info, [this._item], pos);
                break;
            case InteractingType.TopRight:
                this._resizeStrategy.resizeTopRight(this._info, [this._item], pos);
                break;
            case InteractingType.BottomLeft:
                this._resizeStrategy.resizeBottomLeft(this._info, [this._item], pos);
                break;
            case InteractingType.BottomRight:
                this._resizeStrategy.resizeBottomRight(this._info, [this._item], pos);
                break;
            case InteractingType.Rotate:
                this._rotateStrategy.rotate(this._info, [this._item], pos);
                break;
        }
        this._info.lastPos = pos;

        this._inferPosAndSize();
        this._checkOutBound(ctx);
    }

    onDragEnd(pos: Point): boolean {
        if (this._interact === InteractingType.None) return false;
        this._stillStatic = false;
        this._interact = InteractingType.None;
        this._info.lastPos = pos;
        return this._invalid;
    }

    draw(): Shape[] {
        const info = this._info;
        const i = this._item;
        const borderColor: string = this._invalid ? "#dc3545" : "#0d6efd";
        return [
            new Rotate({
                anchor: centerPoint(i.pos, i.size), rotate: i.rotate, shapes: [
                    ...(this._indicatorStrategy.draw(info, [this._item])),
                    new Rectangle({ pos: { x: info.topLeft.x - PADDING, y: info.topLeft.y - PADDING }, size: { w: info.size.w + (PADDING * 2), h: info.size.h + (PADDING * 2) }, borderColor: borderColor }),
                    new Rectangle({ pos: { x: info.topLeft.x - PADDING - 4, y: info.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
                    new Rectangle({ pos: { x: info.topRight.x + PADDING - 4, y: info.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
                    new Rectangle({ pos: { x: info.bottomLeft.x - PADDING - 4, y: info.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
                    new Rectangle({ pos: { x: info.bottomRight.x + PADDING - 4, y: info.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
                    new Circle({ pos: { x: info.topCenter.x, y: info.topCenter.y - PADDING - 10 }, radius: 5, borderColor: borderColor, color: "#fff" })
                ]
            })
        ];
    }

    private _inferPosAndSize(): void {
        const p1 = this._item.pos;
        const p2 = { x: this._item.pos.x + this._item.size.w, y: this._item.pos.y + this._item.size.h };

        this._info.topLeft = { x: p1.x, y: p1.y };
        this._info.topRight = { x: p2.x, y: p1.y };
        this._info.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        this._info.bottomLeft = { x: p1.x, y: p2.y };
        this._info.bottomRight = { x: p2.x, y: p2.y };
        this._info.size = { ...this._item.size };
    }

    private _checkOutBound(ctx: AppContext): void {
        const info = this._info;
        const p = { x: info.topLeft.x, y: info.topLeft.y };
        const s = { w: info.size.w, h: info.size.h };
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(p, s, this._item.rotate);

        this._invalid = ctx.editableTopLeftPos.x > topLeft.x || ctx.editableTopLeftPos.y > topLeft.y || ctx.editableBottomRightPos.x < bottomRight.x || ctx.editableBottomRightPos.y < bottomRight.y;
    }
}

export default SingleItemInteractor;