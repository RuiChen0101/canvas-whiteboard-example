import Booth from './booth';
import Obstacle from './obstacle';
import Description from './description';
import Item, { ItemRecord } from './item';

class ItemFactory {
    build(record: ItemRecord): Item {
        switch (record.type) {
            case 'booth':
                return new Booth({ ...record.state });
            case 'description':
                return new Description({ ...record.state });
            case 'obstacle':
                return new Obstacle({ ...record.state });
            default:
                throw `unknown item ${record.type}`;
        }
    }
}

export default ItemFactory;