import Box from './box';
import Photo from './photo';
import Obstacle from './obstacle';
import Description from './description';
import RemoteComposite from './remote-composite';
import Item, { ItemSnapshot, ItemRecord } from './item';

class ItemFactory {
    buildWithSnapshot(snapshot: ItemSnapshot): Item {
        switch (snapshot.type) {
            case Box.typeId:
                return new Box({ ...snapshot.state });
            case Photo.typeId:
                return new Photo({ ...snapshot.state });
            case Description.typeId:
                return new Description({ ...snapshot.state });
            case Obstacle.typeId:
                return new Obstacle({ ...snapshot.state });
            case RemoteComposite.typeId:
                return new RemoteComposite({ ...snapshot.state });
            default:
                throw new Error(`unknown item ${snapshot.type}`);
        }
    }

    buildWithRecord(record: ItemRecord): Item {
        switch (record.type) {
            case Box.typeId:
                return new Box({ ...record.data });
            case Photo.typeId:
                return new Photo({ ...record.data });
            case Description.typeId:
                return new Description({ ...record.data });
            case Obstacle.typeId:
                return new Obstacle({ ...record.data });
            case RemoteComposite.typeId:
                return new RemoteComposite({ ...record.data });
            default:
                throw new Error(`unknown item ${record.type}`);
        }
    }
}

export default ItemFactory;