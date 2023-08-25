import Box from '../item/box';
import Photo from '../item/photo';
import Obstacle from '../item/obstacle';
import Description from '../item/description';
import RemoteComposite from '../item/remote-composite';

interface Visitor {
    visitBox(box: Box): void;
    visitPhoto(photo: Photo): void;
    visitObstacle(obstacle: Obstacle): void;
    visitDescription(description: Description): void;
    visitRemoteComposite(removeComposite: RemoteComposite): void;
}

abstract class VisitorBase implements Visitor {
    visitBox(box: Box): void { }
    visitPhoto(photo: Photo): void { }
    visitObstacle(obstacle: Obstacle): void { }
    visitDescription(description: Description): void { }
    visitRemoteComposite(remoteComposite: RemoteComposite): void { }
}

export default Visitor;
export { VisitorBase };