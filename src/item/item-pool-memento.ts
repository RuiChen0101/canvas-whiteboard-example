import { ItemSnapshot } from './item';

class ItemPoolMemento {
    private _snapshots: Readonly<ItemSnapshot[]>;
    get snapshots(): Readonly<ItemSnapshot[]> { return this._snapshots };

    constructor(snapshots: ItemSnapshot[]) {
        this._snapshots = Object.freeze(snapshots);
    }
}

export default ItemPoolMemento;