import Visitor from './visitor';
import Booth from '../item/booth';
import Obstacle from '../item/obstacle';
import Description from '../item/description';
import { ItemRecord } from '../item/item';

class MementoCaptureVisitor implements Visitor {
    private _records: ItemRecord[] = [];

    visitBooth(booth: Booth): void {
        this._records.push({
            type: 'booth',
            state: booth.state
        });
    }

    visitDescription(description: Description): void {
        this._records.push({
            type: 'description',
            state: description.state
        });
    }

    visitObstacle(obstacle: Obstacle): void {
        this._records.push({
            type: 'obstacle',
            state: obstacle.state
        });
    }

    getResult(): any[] {
        return this._records;
    }
}

export default MementoCaptureVisitor;