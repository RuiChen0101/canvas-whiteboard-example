import { Size } from '../util/size';
import { Point } from '../util/point';
import { Quadtree } from '../quadtree';
import Visitor from '../visitor/visitor';
import ItemFactory from './item-factory';
import { DisplayFlag } from '../AppContext';
import ItemPoolMemento from './item-pool-memento';
import Item, { Collidable, ItemEvent } from './item';
import SnapshotVisitor from '../visitor/snapshot-visitor';
import { ItemInteractor } from '../interactor/item-interactor';
import MultiItemInteractor from '../interactor/multi-item-interactor';
import SingleItemInteractor from '../interactor/single-item-interactor';
import BuildSelectQuadtreeVisitor from '../visitor/build-select-quadtree-visitor';
import BuildCollideQuadtreeVisitor from '../visitor/build-collide-quadtree-visitor';

class ItemPool {
    private _selected?: ItemInteractor;
    private _items: { [key: string]: Item } = {};
    private _selectQuadtree: Quadtree<string>;
    private _collideQuadtree: Quadtree<string>;

    private _display: DisplayFlag;

    get selected(): ItemInteractor | undefined {
        return this._selected;
    }

    get items(): Item[] {
        return Object.values(this._items);
    }

    constructor(display: DisplayFlag, canvasSize: Size) {
        this._display = display;
        this._selectQuadtree = new Quadtree<string>({ width: canvasSize.w, height: canvasSize.h, });
        this._collideQuadtree = new Quadtree<string>({ width: canvasSize.w, height: canvasSize.h });
    }

    addItem(item: Item): void {
        item.on(ItemEvent.Update, this._onItemUpdate);
        this._items[item.id] = item;
        const selectVisitor = new BuildSelectQuadtreeVisitor(this._display, this._selectQuadtree);
        const collideVisitor = new BuildCollideQuadtreeVisitor(this._collideQuadtree);
        item.visit(selectVisitor);
        item.visit(collideVisitor);
        this._selectQuadtree = selectVisitor.getResult();
        this._collideQuadtree = collideVisitor.getResult();
    }

    addItems(items: Item[]): void {
        const selectVisitor = new BuildSelectQuadtreeVisitor(this._display, this._selectQuadtree);
        const collideVisitor = new BuildCollideQuadtreeVisitor(this._collideQuadtree);
        for (const item of items) {
            item.on(ItemEvent.Update, this._onItemUpdate);
            this._items[item.id] = item;
            item.visit(selectVisitor);
            item.visit(collideVisitor);
        }
        this._selectQuadtree = selectVisitor.getResult();
        this._collideQuadtree = collideVisitor.getResult();
    }

    selectItem(id: string): void {
        if (id in this._items) {
            this._selected = new SingleItemInteractor(this._items[id]);
        }
    }

    selectItems(ids: string[]): void {
        if (ids.length === 0) return;
        if (ids.length === 1) {
            this.selectItem(ids[0]);
            return;
        }
        const items: Item[] = [];
        for (const id of ids) {
            items.push(this._items[id]);
        }
        this._selected = new MultiItemInteractor(items);
    }

    selectItemByArea(pos: Point, size: Size): void {
        const objs = this._selectQuadtree.detectCollision(pos, size, 0);
        const items: Item[] = [];
        for (const o of objs) {
            items.push(this._items[o.id!]);
        }
        if (items.length === 0) {
            this.clearSelect();
        } else if (items.length === 1) {
            this._selected = new SingleItemInteractor(items[0]);
        } else {
            this._selected = new MultiItemInteractor(items);
        }
    }

    searchCollide(pos: Point, size: Size, rotate: number, excludeId?: string): Item[] {
        const objs = this._collideQuadtree.detectCollision(pos, size, rotate);
        const items: Item[] = [];
        for (const o of objs.filter((o, _) => o.id !== excludeId ?? '')) {
            items.push(this._items[o.id!]);
        }
        return items;
    }

    rebuildQuadtree(): void {
        this._selectQuadtree.clear();
        this._collideQuadtree.clear();
        const selectVisitor = new BuildSelectQuadtreeVisitor(this._display, this._selectQuadtree);
        const collideVisitor = new BuildCollideQuadtreeVisitor(this._collideQuadtree);
        this.visit(selectVisitor);
        this.visit(collideVisitor);
        this._selectQuadtree = selectVisitor.getResult();
        this._collideQuadtree = collideVisitor.getResult();
    }

    isCollide(pos: Point, size: Size, rotate: number, excludeId?: string): boolean {
        const objs = this._collideQuadtree.detectCollision(pos, size, rotate);
        return objs.filter((o, _) => o.id !== excludeId ?? '').length !== 0;
    }

    deleteSelectedItem(): void {
        if (this._selected === undefined) return;
        for (const i of this._selected.items) {
            this._items[i.id].clear();
            delete this._items[i.id];
            this._selectQuadtree.remove(i.id);
            this._collideQuadtree.remove(i.id);
        }
        this.clearSelect();
    }

    clearSelect(): void {
        this._selected = undefined;
    }

    save(): ItemPoolMemento {
        const visitor = new SnapshotVisitor();
        this.visit(visitor);
        return new ItemPoolMemento(visitor.getResult());
    }

    restore(memento: ItemPoolMemento): void {
        this.clearSelect();
        this._items = {};
        this._selectQuadtree.clear();
        this._collideQuadtree.clear();
        const factory = new ItemFactory();
        for (const s of memento.snapshots) {
            const item = factory.buildWithSnapshot(s);
            this.addItem(item);
        }
    }

    updateDisplayFlag(display: DisplayFlag) {
        this._selectQuadtree.clear();
        const selectVisitor = new BuildSelectQuadtreeVisitor(display, this._selectQuadtree);
        this.visit(selectVisitor);
        this._selectQuadtree = selectVisitor.getResult();
    }

    visit(visitor: Visitor): void {
        for (const [_, i] of Object.entries(this._items)) {
            i.visit(visitor);
        }
    }

    private _onItemUpdate = (...argv: any[]): void => {
        const id = argv[0];
        if (!(id in this._items)) return;
        const item = this._items[id];
        this._updateQuadtree(item.id);
        if ('collidable' in item) {
            (item as unknown as Collidable).setIsCollide(this.isCollide(item.pos, item.size, item.rotate, item.id));
        }
    }

    private _updateQuadtree(id: string): void {
        if (!(id in this._items)) return;
        const item = this._items[id];
        const selectVisitor = new BuildSelectQuadtreeVisitor(this._display, this._selectQuadtree);
        const collideVisitor = new BuildCollideQuadtreeVisitor(this._collideQuadtree);
        item.visit(selectVisitor);
        item.visit(collideVisitor);
        this._selectQuadtree = selectVisitor.getResult();
        this._collideQuadtree = collideVisitor.getResult();
    }
}

export default ItemPool;