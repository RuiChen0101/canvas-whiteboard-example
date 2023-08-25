import Box from '../item/box';
import Photo from '../item/photo';
import Obstacle from '../item/obstacle';
import { ItemSnapshot } from '../item/item';
import Description from '../item/description';
import Visitor, { VisitorBase } from './visitor';

class MementoCaptureVisitor extends VisitorBase implements Visitor {
    private _records: Array<ItemSnapshot> = [];

    visitBox(box: Box): void {
        this._records.push({ type: 'box', state: box.state });
    }

    visitPhoto(photo: Photo): void {
        this._records.push({ type: 'photo', state: photo.state });
    }

    visitDescription(description: Description): void {
        this._records.push({ type: 'description', state: description.state });
    }

    visitObstacle(obstacle: Obstacle): void {
        this._records.push({ type: 'obstacle', state: obstacle.state });
    }

    getResult(): any[] {
        return this._records;
    }
}

export default MementoCaptureVisitor;