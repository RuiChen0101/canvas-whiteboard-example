import { ORIGIN, Point } from '../util/point';
import Shape from './shape';

type RotateProp = {
    rotate?: number;
    anchor?: Point;
    shapes?: Shape[];
}

class Rotate implements Shape {
    private _rotate: number;
    private _anchor: Point;
    private _shapes: Shape[];

    constructor(prop?: RotateProp) {
        this._rotate = prop?.rotate ?? 0;
        this._anchor = prop?.anchor ?? ORIGIN;
        this._shapes = prop?.shapes ?? [];
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this._anchor.x, this._anchor.y);
        context.rotate((this._rotate * Math.PI) / 180);
        context.translate(-this._anchor.x, -this._anchor.y);
        for (const s of this._shapes) {
            s.draw(canvas, context);
        }
        context.restore();
    }
}

export default Rotate;
export type {
    RotateProp
}