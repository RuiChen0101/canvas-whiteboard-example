import { Size, ZERO_SIZE, scaleSize } from './size';
import { BoundingBox, ZERO_BOX } from './bounding-box';
import { Point, addPoints, scalePoint, diffPoints, ORIGIN } from './point';

type CameraControlProp = {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    cameraBound: Size;
}

class CameraControl {
    private readonly ZOOM_SENSITIVITY: number = 200;

    private _context: CanvasRenderingContext2D;
    private _canvas: HTMLCanvasElement;
    private _cameraBound: Size;

    private _viewport: Point = ORIGIN;
    private _canvasSize: Size = ZERO_SIZE;
    private _viewSize: Size = ZERO_SIZE;
    private _scale: number = 1;

    private _boundTensionVector: Point = ORIGIN;
    private _scaleTension: number = 0;

    public set canvasSize(size: Size) {
        this._canvasSize = size;
        this._viewSize = scaleSize(size, this._scale);
    }

    public get viewport(): Point { return this._viewport; }
    public get viewSize(): Size { return this._viewSize; }
    public get scale(): number { return this._scale; }

    constructor(prop: CameraControlProp) {
        this._context = prop.context;
        this._canvas = prop.canvas;
        this._cameraBound = prop.cameraBound;
    }

    public toLocalPoint(p: Point): Point {
        return addPoints(scalePoint(p, this._scale), this._viewport);
    }

    public moveCamera(delta: Point): void {
        const viewportDiff = addPoints(this._boundTensionVector, scalePoint(delta, this._scale));
        // const viewportDiff = scalePoint(delta, this._scale);

        console.log(viewportDiff);
        const newViewport = diffPoints(this._viewport, viewportDiff);

        this._context.translate(viewportDiff.x, viewportDiff.y);

        this._viewport = newViewport;
        this._updateBoundTensionVector();
        // console.log(this._boundTensionVector);
    }

    public zoom(zoomCenter: Point, delta: number): void {
        const zoom = 1 - delta / this.ZOOM_SENSITIVITY;
        const mousePos = diffPoints({ x: zoomCenter.x, y: zoomCenter.y }, { x: this._canvas.offsetLeft, y: this._canvas.offsetTop });
        const viewportDelta = {
            x: (mousePos.x / this._scale) * (1 - 1 / zoom),
            y: (mousePos.y / this._scale) * (1 - 1 / zoom)
        };
        const newViewport = addPoints(
            this._viewport,
            viewportDelta
        );

        this._context.translate(this._viewport.x, this._viewport.y);
        this._context.scale(zoom, zoom);
        this._context.translate(-newViewport.x, -newViewport.y);

        this._viewport = newViewport;
        this._scale = this._scale * zoom;
        this._viewSize = scaleSize(this._canvasSize, this._scale);

        const viewportDiff = scalePoint(
            ORIGIN,
            this._scale
        );
        this._context.translate(viewportDiff.x, viewportDiff.y);
        this._viewport = diffPoints(this._viewport, viewportDiff);
    }

    public zoomTo(topLeft: Point, size: Size): void {
        this._canvas.width = this._canvas.width;
        const scale = Math.max(this._canvas.width / size.w, this._canvas.height / size.h);

        const translateX = topLeft.x * scale;
        const translateY = topLeft.y * scale;

        this._context.translate(-translateX, -translateY);
        this._context.scale(scale, scale);

        this._viewport = topLeft;
        this._scale = scale;
        this._viewSize = scaleSize(this._canvasSize, this._scale);
    }

    private _updateBoundTensionVector(): void {
        this._boundTensionVector = {
            x: this._viewport.x < 0 ? this._viewport.x : (this._viewport.x + this._viewSize.w <= this._cameraBound.w ? 0 : this._viewport.x + this._viewSize.w - this._cameraBound.w),
            y: this._viewport.y < 0 ? this._viewport.y : (this._viewport.y + this._viewSize.h <= this._cameraBound.h ? 0 : this._viewport.y + this._viewSize.h - this._cameraBound.h),
        }
        console.log(this._boundTensionVector)
    }
}

export default CameraControl;