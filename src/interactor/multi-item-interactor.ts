import Item from '../item/item';
import Shape from '../shape/shape';
import Circle from '../shape/circle';
import Rectangle from '../shape/rectangle';
import { ORIGIN, Point } from '../util/point';
import { Size, ZERO_SIZE } from '../util/size';
import { FontStyle } from '../type/font-style';
import MoveStrategy, { FreeMoveStrategy } from './move-strategy';
import RotateStrategy, { FreeRotateStrategy } from './rotate-strategy';
import ResizeStrategy, { GroupResizeStrategy } from './resize-strategy';
import { ANCHOR_SIZE, InteractingType, InteractorInfo, ItemInteractor, PADDING } from './item-interactor';
import AppContext from '../AppContext';

class MultiItemInteractor implements ItemInteractor {
    private _items: Item[] = [];

    private _info: InteractorInfo = {
        topLeft: ORIGIN,
        topCenter: ORIGIN,
        topRight: ORIGIN,
        bottomLeft: ORIGIN,
        bottomRight: ORIGIN,
        size: ZERO_SIZE,
        lastPos: ORIGIN,
    };

    private _resizeStrategy: ResizeStrategy = new GroupResizeStrategy();
    private _rotateStrategy: RotateStrategy = new FreeRotateStrategy();
    private _moveStrategy: MoveStrategy = new FreeMoveStrategy();

    private _interact: InteractingType = InteractingType.None;

    private _stillStatic: boolean = true;

    private _invalid: boolean = false;

    get items(): Item[] {
        return this._items;
    }

    get isInteracting(): boolean {
        return this._interact !== InteractingType.None;
    }

    get stillStatic(): boolean {
        return this._stillStatic;
    }

    constructor(items: Item[]) {
        this._items = items;
        this._inferPosAndSize();
    }

    checkInteract(pos: Point, doubleClick: boolean = false): InteractingType {
        const info = this._info;
        if (info.topLeft.x - PADDING - 6 <= pos.x && info.topLeft.x - PADDING + 6 >= pos.x && info.topLeft.y - PADDING - 6 <= pos.y && info.topLeft.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopLeft;
        }
        if (info.topRight.x + PADDING - 6 <= pos.x && info.topRight.x + PADDING + 6 >= pos.x && info.topRight.y - PADDING - 6 <= pos.y && info.topRight.y - PADDING + 6 >= pos.y) {
            return InteractingType.TopRight;
        }
        if (info.bottomLeft.x - PADDING - 6 <= pos.x && info.bottomLeft.x - PADDING + 6 >= pos.x && info.bottomLeft.y + PADDING - 6 <= pos.y && info.bottomLeft.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomLeft;
        }
        if (info.bottomRight.x + PADDING - 6 <= pos.x && info.bottomRight.x + PADDING + 6 >= pos.x && info.bottomRight.y + PADDING - 6 <= pos.y && info.bottomRight.y + PADDING + 6 >= pos.y) {
            return InteractingType.BottomRight;
        }
        if (info.topCenter.x - 5 <= pos.x && info.topCenter.x + 5 >= pos.x && info.topCenter.y - PADDING - 15 <= pos.y && info.topCenter.y - PADDING - 5 >= pos.y) {
            return InteractingType.Rotate;
        }
        if (info.topLeft.x - PADDING <= pos.x && info.topLeft.y - PADDING <= pos.y && info.bottomRight.x + PADDING >= pos.x && info.bottomRight.y + PADDING >= pos.y) {
            return InteractingType.Body;
        }
        return InteractingType.None;
    }

    onTextEditStart(): [string, Point, Size, number, FontStyle, string] {
        throw `cannot edit text when multiple item selected`;
    }

    onTextEdit(ctx: AppContext, text: string): [Point, Size, number] {
        throw `cannot edit text when multiple item selected`;
    }

    onTextEditEnd(text: string): boolean {
        throw `cannot edit text when multiple item selected`;
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
                this._moveStrategy.move(this._info, this._items, pos);
                break;
            case InteractingType.TopLeft:
                this._resizeStrategy.resizeTopLeft(this._info, this._items, pos);
                break;
            case InteractingType.TopRight:
                this._resizeStrategy.resizeTopRight(this._info, this._items, pos);
                break;
            case InteractingType.BottomLeft:
                this._resizeStrategy.resizeBottomLeft(this._info, this._items, pos);
                break;
            case InteractingType.BottomRight:
                this._resizeStrategy.resizeBottomRight(this._info, this._items, pos);
                break;
            case InteractingType.Rotate:
                this._rotateStrategy.rotate(this._info, this._items, pos);
                break;
        }
        this._info.lastPos = { ...pos };

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
        const ctx = this._info;
        const borderColor: string = this._invalid ? "#dc3545" : "#0d6efd";
        return [
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING, y: ctx.topLeft.y - PADDING }, size: { w: ctx.size.w + (PADDING * 2), h: ctx.size.h + (PADDING * 2) }, borderColor: borderColor }),
            new Rectangle({ pos: { x: ctx.topLeft.x - PADDING - 4, y: ctx.topLeft.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
            new Rectangle({ pos: { x: ctx.topRight.x + PADDING - 4, y: ctx.topRight.y - PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomLeft.x - PADDING - 4, y: ctx.bottomLeft.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
            new Rectangle({ pos: { x: ctx.bottomRight.x + PADDING - 4, y: ctx.bottomRight.y + PADDING - 4 }, size: ANCHOR_SIZE, borderColor: borderColor, color: "#fff" }),
            new Circle({ pos: { x: ctx.topCenter.x, y: ctx.topCenter.y - PADDING - 10 }, radius: 5, borderColor: borderColor, color: "#fff" })
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

        this._info.topLeft = { x: p1.x, y: p1.y };
        this._info.topRight = { x: p2.x, y: p1.y };
        this._info.topCenter = { x: (p1.x + p2.x) / 2, y: p1.y };
        this._info.bottomLeft = { x: p1.x, y: p2.y };
        this._info.bottomRight = { x: p2.x, y: p2.y };
        this._info.size = { w: this._info.bottomRight.x - this._info.topLeft.x, h: this._info.bottomRight.y - this._info.topLeft.y };
    }

    private _checkOutBound(ctx: AppContext): void {
        const info = this._info;

        this._invalid = ctx.editableTopLeftPos.x > info.topLeft.x || ctx.editableTopLeftPos.y > info.topLeft.y || ctx.editableBottomRightPos.x < info.bottomRight.x || ctx.editableBottomRightPos.y < info.bottomRight.y;
    }
}

export default MultiItemInteractor;