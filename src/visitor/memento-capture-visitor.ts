import Box from '../item/box';
import Visitor from './visitor';
import Obstacle from '../item/obstacle';
import { ItemRecord } from '../item/item';
import Description from '../item/description';

class MementoCaptureVisitor implements Visitor {
    private _records: ItemRecord[] = [];

    visitBox(box: Box): void {
        this._records.push({
            type: 'box',
            state: box.state
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