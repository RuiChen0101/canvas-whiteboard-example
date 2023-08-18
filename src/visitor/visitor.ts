import Box from '../item/box';
import Photo from '../item/photo';
import Obstacle from '../item/obstacle';
import Description from '../item/description';

interface Visitor {
    visitBox(box: Box): void
    visitPhoto(photo: Photo): void
    visitObstacle(obstacle: Obstacle): void
    visitDescription(description: Description): void
}

abstract class VisitorBase implements Visitor {
    visitBox(box: Box): void { }
    visitPhoto(photo: Photo): void { }
    visitObstacle(obstacle: Obstacle): void { }
    visitDescription(description: Description): void { }
}

export default Visitor;
export { VisitorBase };