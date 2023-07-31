import Item from './item';
import { Size } from '../util/size';
import { Point } from '../util/point';
import Visitor from '../visitor/visitor';
import ItemInteractor from './item-interactor';
import { Quadtree, Rectangle } from '../quadtree';

class ItemPool {
    private _selected?: ItemInteractor;
    private _items: { [key: string]: Item } = {};
    private _quadtree: Quadtree<Rectangle<string>>;

    public get selected(): ItemInteractor | undefined {
        return this._selected;
    }

    public get items(): Item[] {
        return Object.values(this._items);
    }

    constructor(canvasSize: Size) {
        this._quadtree = new Quadtree<Rectangle<string>>({
            width: canvasSize.w,
            height: canvasSize.h,
        });
    }

    addItem(item: Item): void {
        this._items[item.id] = item;
        this._quadtree.insert(new Rectangle({
            x: item.pos.x,
            y: item.pos.y,
            width: item.size.w,
            height: item.size.h,
            data: item.id,
        }));
    }

    searchItem(pos: Point, size: Size): Item[] {
        const objs = this._quadtree.detectCollision(new Rectangle({ x: pos.x, y: pos.y, width: size.w, height: size.h, }));
        const result: Item[] = [];
        for (const o of objs) {
            result.push(this._items[o.data!]);
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

    clearSelect(): void {
        this._selected = undefined;
    }

    visit(visitor: Visitor): void {
        for (const [_, i] of Object.entries(this._items)) {
            i.visit(visitor);
        }
    }
}

export default ItemPool;