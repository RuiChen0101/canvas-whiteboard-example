import Box from '../item/box';
import Obstacle from '../item/obstacle';
import Photo from '../item/photo';
import { Quadtree } from '../quadtree';
import Visitor, { VisitorBase } from './visitor';

class BuildCollideQuadtreeVisitor extends VisitorBase implements Visitor {
    private _quadtree: Quadtree<string>;

    constructor(quadtree: Quadtree<string>) {
        super();
        this._quadtree = quadtree;
    }

    visitBox(box: Box): void {
        this._quadtree.insert(box.id, box.pos, box.size, box.rotate);
    }

    visitPhoto(photo: Photo): void {
        this._quadtree.insert(photo.id, photo.pos, photo.size, photo.rotate);
    }

    visitObstacle(obstacle: Obstacle): void {
        this._quadtree.insert(obstacle.id, obstacle.pos, obstacle.size, obstacle.rotate);
    }

    getResult(): Quadtree<string> {
        return this._quadtree;
    }
}

export default BuildCollideQuadtreeVisitor;