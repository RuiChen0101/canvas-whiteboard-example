import { Size, ZERO_SIZE, scaleSize } from './size';
import { Point, addPoints, downScalePoint, diffPoints, ORIGIN, isParallel, isSameDirection, upScalePoint } from './point';

type CameraControlProp = {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    cameraBound: Size;
}

interface CameraState {
    viewport: Point;
    viewSize: Size;
    scale: number;
}

class CameraControl {
    private readonly ZOOM_SENSITIVITY: number = 500;
    private readonly OUTBOUND_ZOOM_FRICTION: number = 90; // higher = more friction
    private readonly OUTBOUND_ZOOM_ELASTIC: number = 50; // higher = more elastic
    private readonly OUTBOUND_MOVE_FRICTION: number = 20; // higher = less friction
    private readonly OUTBOUND_MOVE_ELASTIC: number = 20; // higher = more elastic

    private _context: CanvasRenderingContext2D;
    private _canvas: HTMLCanvasElement;
    private _cameraBound: Size;

    private _viewport: Point = ORIGIN;
    private _canvasSize: Size = ZERO_SIZE;
    private _viewSize: Size = ZERO_SIZE;
    private _scale: number = 1;
    private _lastPos: Point = ORIGIN;

    private _boundTensionVector: Point = ORIGIN;
    private _scaleTension: number = 0;

    private _controlled: boolean = false;
    private _disabled: boolean = false;

    public set canvasSize(size: Size) {
        this._canvasSize = size;
        this._viewSize = scaleSize(size, this._scale);
        this._updateScaleTension();
    }

    public set disabled(b: boolean) {
        this._disabled = b;
    }

    public get state(): CameraState {
        return {
            viewport: this._viewport,
            viewSize: this._viewSize,
            scale: this._scale
        }
    }

    public get controlled(): boolean { return this._controlled; }

    constructor(prop: CameraControlProp) {
        this._context = prop.context;
        this._canvas = prop.canvas;
        this._cameraBound = prop.cameraBound;
    }

    public control(): void {
        this._controlled = true;
    }

    public release(): void {
        this._controlled = false;
    }

    public toLocalPoint(p: Point): Point {
        return addPoints(downScalePoint(p, this._scale), this._viewport);
    }

    public toClientPoint(p: Point): Point {
        return upScalePoint(diffPoints(p, this._viewport), this._scale);
    }

    public moveCamera(delta: Point): void {
        if (this._disabled) return;
        const viewportDiff = addPoints(downScalePoint(this._boundTensionVector, this.OUTBOUND_MOVE_FRICTION), downScalePoint(delta, this._scale));
        if (isSameDirection(viewportDiff, delta)) {
            this._viewport = diffPoints(this._viewport, viewportDiff);

            this._context.translate(viewportDiff.x, viewportDiff.y);
        }

        this._updateBoundTensionVector();
    }

    public zoom(zoomCenter: Point, delta: number): void {
        if (this._disabled) return;
        let zoom = (1 - delta / this.ZOOM_SENSITIVITY);
        if (this._scaleTension > 0.01 && delta > 0) {
            zoom = (1 - Math.max(0, delta - (this._scaleTension * this.OUTBOUND_ZOOM_FRICTION)) / this.ZOOM_SENSITIVITY);
        }
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
        this._lastPos = zoomCenter;

        const viewportDiff = downScalePoint(
            ORIGIN,
            this._scale
        );
        this._context.translate(viewportDiff.x, viewportDiff.y);
        this._viewport = diffPoints(this._viewport, viewportDiff);

        this._updateBoundTensionVector();
        this._updateScaleTension();
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

        this._updateBoundTensionVector();
        this._updateScaleTension();
    }

    public outBoundCorrection(): void {
        if (this._controlled) return;
        if (Math.abs(this._scaleTension) >= 0.001) {
            this.zoom(this._lastPos, -(this._scaleTension * this.OUTBOUND_ZOOM_ELASTIC));
        }
        if (Math.abs(this._boundTensionVector.x) >= 0.1 || Math.abs(this._boundTensionVector.y) >= 0.1) {
            const viewportDiff = downScalePoint(this._boundTensionVector, this.OUTBOUND_MOVE_ELASTIC);
            this.moveCamera(viewportDiff);
        }
    }

    private _updateBoundTensionVector(): void {
        const top = this._viewport.x < 0 ? this._viewport.x : 0;
        const left = this._viewport.y < 0 ? this._viewport.y : 0;
        const bottom = this._viewport.x + this._viewSize.w <= this._cameraBound.w ? 0 : this._viewport.x + this._viewSize.w - this._cameraBound.w;
        const right = this._viewport.y + this._viewSize.h <= this._cameraBound.h ? 0 : this._viewport.y + this._viewSize.h - this._cameraBound.h

        this._boundTensionVector = { x: top + bottom, y: left + right };
    }

    private _updateScaleTension(): void {
        const maxScale = Math.max(this._canvas.width / this._cameraBound.w, this._canvas.height / this._cameraBound.h);
        this._scaleTension = this._scale >= maxScale ? 0 : maxScale - this._scale;
    }
}

export default CameraControl;
export type { CameraState };