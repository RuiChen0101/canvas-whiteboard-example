import Box from '../item/box';
import Obstacle from '../item/obstacle';
import Description from '../item/description';

interface Visitor {
    visitBox(box: Box): void
    visitObstacle(obstacle: Obstacle): void
    visitDescription(description: Description): void
}

abstract class VisitorBase implements Visitor {
    visitBox(box: Box): void { }
    visitObstacle(obstacle: Obstacle): void { }
    visitDescription(description: Description): void { }
}

export default Visitor;
export { VisitorBase };