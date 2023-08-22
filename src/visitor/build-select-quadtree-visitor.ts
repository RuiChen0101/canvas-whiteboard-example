import Box from '../item/box';
import Photo from '../item/photo';
import { Quadtree } from '../quadtree';
import Obstacle from '../item/obstacle';
import { DisplayFlag } from '../AppContext';
import Description from '../item/description';
import Visitor, { VisitorBase } from './visitor';

class BuildSelectQuadtreeVisitor extends VisitorBase implements Visitor {
    private _display: DisplayFlag;
    private _quadtree: Quadtree<string>;

    constructor(display: DisplayFlag, quadtree: Quadtree<string>) {
        super();
        this._display = display;
        this._quadtree = quadtree;
    }

    visitBox(box: Box): void {
        this._quadtree.insert(box.id, box.pos, box.size, box.rotate);
    }

    visitDescription(description: Description): void {
        if (!this._display.showText) return;
        this._quadtree.insert(description.id, description.pos, description.size, description.rotate);
    }

    visitObstacle(obstacle: Obstacle): void {
        if (!this._display.showObstacle) return;
        this._quadtree.insert(obstacle.id, obstacle.pos, obstacle.size, obstacle.rotate);
    }

    visitPhoto(photo: Photo): void {
        this._quadtree.insert(photo.id, photo.pos, photo.size, photo.rotate);
    }

    getResult(): Quadtree<string> {
        return this._quadtree;
    }
}

export default BuildSelectQuadtreeVisitor;