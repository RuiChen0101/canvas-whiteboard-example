import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import Item, { ItemEvent } from './item';
import ItemInteractor from '../interactor/item-interactor';
import { Quadtree, Rectangle } from '../quadtree';

class ItemPool {
    private _selected?: ItemInteractor;
    private _items: { [key: string]: Item } = {};
    private _quadtree: Quadtree<string>;

    public get selected(): ItemInteractor | undefined {
        return this._selected;
    }

    public get items(): Item[] {
        return Object.values(this._items);
    }

    constructor(canvasSize: Size) {
        this._quadtree = new Quadtree<string>({
            width: canvasSize.w,
            height: canvasSize.h,
        });
    }

    addItem(item: Item): void {
        item.on(ItemEvent.Reposition, this._onItemUpdate);
        item.on(ItemEvent.Resize, this._onItemUpdate);
        this._items[item.id] = item;
        this._quadtree.insert(new Rectangle<string>({
            x: item.pos.x,
            y: item.pos.y,
            width: item.size.w,
            height: item.size.h,
            rotate: item.rotate,
            id: item.id,
        }));
    }

    searchItem(pos: Point, size: Size): Item[] {
        const objs = this._quadtree.detectCollision(new Rectangle<string>({ x: pos.x, y: pos.y, width: size.w, height: size.h, rotate: 0 }));
        const result: Item[] = [];
        for (const o of objs) {
            result.push(this._items[o.id!]);
        }
        return result;
    }

    selectItem(pos: Point, size: Size): void {
        const items = this.searchItem(pos, size);
        if (items.length === 0) {
            this.clearSelect();
        } else {
            this._selected = new ItemInteractor(items);
        }
    }

    deleteSelectedItem(): void {
        if (this._selected === undefined) return;
        for (const i of this._selected.items) {
            delete this._items[i.id];
            this._quadtree.remove(i.id);
        }
        this.clearSelect();
    }

    clearSelect(): void {
        this._selected = undefined;
    }

    visit(visitor: Visitor): void {
        for (const [_, i] of Object.entries(this._items)) {
            i.visit(visitor);
        }
    }

    private _onItemUpdate = (...argv: any[]): void => {
        this._updateQuadtree(argv[0]);
    }

    private _updateQuadtree(id: string): void {
        if (!(id in this._items)) return;
        const item = this._items[id];
        this._quadtree.update(id, new Rectangle<string>({
            x: item.pos.x,
            y: item.pos.y,
            width: item.size.w,
            height: item.size.h,
            rotate: item.rotate,
            id: item.id,
        }));
    }
}

export default ItemPool;