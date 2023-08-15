import Box from '../item/box';
import Text from '../shape/text';
import Shape from '../shape/shape';
import Rotate from '../shape/rotate';
import Obstacle from '../item/obstacle';
import Rectangle from '../shape/rectangle';
import Description from '../item/description';
import Visitor, { VisitorBase } from './visitor';
import { Point, centerPoint } from '../util/point';

class DrawingVisitor extends VisitorBase implements Visitor {
    private _shapes: Shape[] = [];

    visitBox(box: Box): void {
        const shapes: Shape[] = [
            new Rectangle({ pos: box.pos, size: box.size }),
        ];
        if (!box.isEditing) {
            shapes.push(new Text({ text: box.name, pos: centerPoint(box.pos, box.size), vAlign: 'middle', hAlign: 'center' }));
        }
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(box.pos, box.size), box.rotate));
    }

    visitDescription(description: Description): void {
        const shapes: Shape[] = [];
        if (!description.isEditing) {
            shapes.push(new Text({
                text: description.text,
                pos: description.pos,
                fontSize: description.fontStyle.size,
                fontFamily: description.fontStyle.family,
                lineHeight: description.fontStyle.lineHight,
            }));
        }
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(description.pos, description.size), description.rotate));
    }

    visitObstacle(obstacle: Obstacle): void {
        const shapes: Shape[] = [
            new Rectangle({ pos: obstacle.pos, size: obstacle.size, color: "#000" }),
        ];
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(obstacle.pos, obstacle.size), obstacle.rotate));
    }

    _decoWithRotate(shapes: Shape[], anchor: Point, rotate: number): Shape[] {
        if (rotate === 0) {
            return shapes;
        } else {
            return [new Rotate({ shapes: shapes, rotate: rotate, anchor: anchor })];
        }
    }

    getResult(): Shape[] {
        return this._shapes;
    }
}

export default DrawingVisitor;