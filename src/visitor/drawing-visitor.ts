import Text from '../shape/text';
import Booth from '../item/booth';
import Table from '../item/table';
import Shape from '../shape/shape';
import Rotate from '../shape/rotate';
import Rectangle from '../shape/rectangle';
import { centerPoint } from '../util/point';
import Visitor, { VisitorBase } from './visitor';

class DrawingVisitor extends VisitorBase implements Visitor {
    private _shapes: Shape[] = [];

    visitTable(table: Table): void {
        const shapes = [
            new Rectangle({ pos: table.pos, size: table.size })
        ]
        if (table.rotate !== 0) {
            this._shapes.push(new Rotate({ shapes: shapes, rotate: table.rotate, anchor: centerPoint(table.pos, table.size) }));
        } else {
            this._shapes.push(...shapes);
        }
    }

    visitBooth(booth: Booth): void {
        const shapes = [
            new Rectangle({ pos: booth.pos, size: booth.size }),
            new Text({ text: booth.name, pos: centerPoint(booth.pos, booth.size) })
        ];
        if (booth.rotate !== 0) {
            this._shapes.push(new Rotate({ shapes: shapes, rotate: booth.rotate, anchor: centerPoint(booth.pos, booth.size) }));
        } else {
            this._shapes.push(...shapes);
        }
    }

    getResult(): Shape[] {
        return this._shapes;
    }
}

export default DrawingVisitor;