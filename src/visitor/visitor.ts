import Booth from '../item/booth';
import Description from '../item/description';
import Obstacle from '../item/obstacle';
import Table from '../item/table';

interface Visitor {
    visitTable(table: Table): void
    visitBooth(booth: Booth): void
    visitObstacle(obstacle: Obstacle): void
    visitDescription(description: Description): void
}

abstract class VisitorBase implements Visitor {
    visitTable(table: Table): void { }
    visitBooth(booth: Booth): void { }
    visitObstacle(obstacle: Obstacle): void { }
    visitDescription(description: Description): void { }
}

export default Visitor;
export { VisitorBase };