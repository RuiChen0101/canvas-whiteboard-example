import { ItemRecord } from './item';

class ItemPoolMemento {
    private _records: Readonly<ItemRecord[]>;
    get records(): Readonly<ItemRecord[]> { return this._records };

    constructor(records: ItemRecord[]) {
        this._records = Object.freeze(records);
    }
}

export default ItemPoolMemento;