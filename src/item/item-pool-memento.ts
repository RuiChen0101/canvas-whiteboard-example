import { ItemMemento } from './item';

class ItemPoolMemento {
    private _records: Readonly<ItemMemento[]>;
    get records(): Readonly<ItemMemento[]> { return this._records };

    constructor(records: ItemMemento[]) {
        this._records = Object.freeze(records);
    }
}

export default ItemPoolMemento;