import Booth from '../item/booth';
import Obstacle from '../item/obstacle';
import Description from '../item/description';

interface Visitor {
    visitBooth(booth: Booth): void
    visitObstacle(obstacle: Obstacle): void
    visitDescription(description: Description): void
}

abstract class VisitorBase implements Visitor {
    visitBooth(booth: Booth): void { }
    visitObstacle(obstacle: Obstacle): void { }
    visitDescription(description: Description): void { }
}

export default Visitor;
export { VisitorBase };