import Box from './box';
import Photo from './photo';
import Obstacle from './obstacle';
import Description from './description';
import RemoteComposite from './remote-composite';
import Item, { ItemMemento, ItemRecord } from './item';

class ItemFactory {
    buildWithMemento(record: ItemMemento): Item {
        switch (record.type) {
            case 'box':
                return new Box({ ...record.state });
            case 'photo':
                return new Photo({ ...record.state });
            case 'description':
                return new Description({ ...record.state });
            case 'obstacle':
                return new Obstacle({ ...record.state });
            case 'remote-composite':
                return new RemoteComposite({ ...record.state });
            default:
                throw new Error(`unknown item ${record.type}`);
        }
    }

    buildWithRecord(record: ItemRecord): Item {
        switch (record.type) {
            case 'box':
                return new Box({ ...record.data });
            case 'photo':
                return new Photo({ ...record.data });
            case 'description':
                return new Description({ ...record.data });
            case 'obstacle':
                return new Obstacle({ ...record.data });
            case 'remote-composite':
                return new RemoteComposite({ ...record.data });
            default:
                throw new Error(`unknown item ${record.type}`);
        }
    }
}

export default ItemFactory;