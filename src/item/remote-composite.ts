import { ORIGIN, Point } from '../util/point';
import { ZERO_SIZE } from '../util/size';
import Visitor from '../visitor/visitor';
import Item, { ItemBase, ItemRecord, ItemState } from './item';
import MoveStrategy, { NoMoveStrategy } from '../interactor/strategy/move-strategy';
import ResizeStrategy, { NoResizeStrategy } from '../interactor/strategy/resize-strategy';
import RotateStrategy, { NoRotateStrategy } from '../interactor/strategy/rotate-strategy';
import IndicatorStrategy, { NoIndicatorStrategy } from '../interactor/strategy/indicator-strategy';
import ItemFactory from './item-factory';

interface RemoteCompositeProps {
    id: string;
    url: string;
}

interface RemoteCompositeState extends ItemState {
    url: string;
    items: Item[];
}

class RemoteComposite extends ItemBase<RemoteCompositeState> implements Item {
    get items(): Item[] { return this._state.items; }

    get moveStrategy(): MoveStrategy {
        return new NoMoveStrategy();
    }

    get resizeStrategy(): ResizeStrategy {
        return new NoResizeStrategy();
    }

    get rotateStrategy(): RotateStrategy {
        return new NoRotateStrategy();
    }

    get indicatorStrategy(): IndicatorStrategy {
        return new NoIndicatorStrategy();
    }

    constructor(prop: RemoteCompositeProps);
    constructor(state: RemoteCompositeState);

    constructor(argv: RemoteCompositeProps | RemoteCompositeState) {
        if ('items' in argv) {
            super(argv)
        } else {
            super({ ...argv, items: [], pos: ORIGIN, size: ZERO_SIZE, rotate: 0 });
        }
    }

    async load(): Promise<void> {
        const res = await fetch(this._state.url);
        const data: ItemRecord[] = await res.json();
        if (data.length === 0) return;

        const items: Item[] = [];
        const p1: Point = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
        const p2: Point = { x: 0, y: 0 };

        const factor = new ItemFactory();
        for (const d of data) {
            const i = factor.buildWithRecord(d);
            const [iP1, iP2] = i.boundingBox;
            p1.x = Math.min(p1.x, iP1.x);
            p1.y = Math.min(p1.y, iP1.y);
            p2.x = Math.max(p2.x, iP2.x);
            p2.y = Math.max(p2.y, iP2.y);
            items.push(factor.buildWithRecord(d));
        }

        const topLeft = { x: p1.x, y: p1.y };
        const bottomRight = { x: p2.x, y: p2.y };
        const size = { w: bottomRight.x - topLeft.x, h: bottomRight.y - topLeft.y };

        this._state.items = items;
        this._state.pos = topLeft;
        this._state.size = size;
    }

    visit(visitor: Visitor): void {
        visitor.visitRemoteComposite(this);
    }
}

export default RemoteComposite;