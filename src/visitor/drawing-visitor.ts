import Text from '../shape/text';
import Booth from '../item/booth';
import Shape from '../shape/shape';
import Rotate from '../shape/rotate';
import Rectangle from '../shape/rectangle';
import { Point, centerPoint } from '../util/point';
import Visitor, { VisitorBase } from './visitor';
import Description from '../item/description';

class DrawingVisitor extends VisitorBase implements Visitor {
    private _shapes: Shape[] = [];

    visitBooth(booth: Booth): void {
        const shapes: Shape[] = [
            new Rectangle({ pos: booth.pos, size: booth.size }),
        ];
        if (!booth.isEditing) {
            shapes.push(new Text({ text: booth.name, pos: centerPoint(booth.pos, booth.size) }));
        }
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(booth.pos, booth.size), booth.rotate));
    }

    visitDescription(description: Description): void {
        const shapes: Shape[] = []
        if (!description.isEditing) {
            shapes.push(new Text({ text: description.text, pos: description.pos }));
        }
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(description.pos, description.size), description.rotate));
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