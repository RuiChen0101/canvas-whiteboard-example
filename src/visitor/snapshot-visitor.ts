import Box from '../item/box';
import Photo from '../item/photo';
import Obstacle from '../item/obstacle';
import { ItemSnapshot } from '../item/item';
import Description from '../item/description';
import Visitor, { VisitorBase } from './visitor';
import RemoteComposite from '../item/remote-composite';

class SnapshotVisitor extends VisitorBase implements Visitor {
    private _snapshots: Array<ItemSnapshot> = [];

    visitBox(box: Box): void {
        this._snapshots.push({ type: Box.typeId, state: box.state });
    }

    visitPhoto(photo: Photo): void {
        this._snapshots.push({ type: Photo.typeId, state: photo.state });
    }

    visitDescription(description: Description): void {
        this._snapshots.push({ type: Description.typeId, state: description.state });
    }

    visitObstacle(obstacle: Obstacle): void {
        this._snapshots.push({ type: Obstacle.typeId, state: obstacle.state });
    }

    visitRemoteComposite(remoteComposite: RemoteComposite): void {
        this._snapshots.push({ type: RemoteComposite.typeId, state: remoteComposite.state });
    }

    getResult(): any[] {
        return this._snapshots;
    }
}

export default SnapshotVisitor;