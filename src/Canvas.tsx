import { Component, ReactNode, createRef } from 'react';

import './Canvas.scss';

import Shape from './shape/shape';
import { Size } from './util/size';
import Rectangle from './shape/rectangle';
import CameraControl, { CameraState } from './util/camera-control';
import { Point, diffPoints, ORIGIN, middlePoint, pointDistance } from './util/point';

interface CanvasProps {
    cameraBound: Size;
    onDragStart: (windowPos: Point, canvasPos: Point) => void;
    onDragMove: (windowPos: Point, canvasPos: Point) => void;
    onDragEnd: (windowPos: Point, canvasPos: Point) => void;
    onMouseMove: (windowPos: Point, canvasPos: Point) => void;
    onDoubleClick: (WindowPos: Point, canvasPos: Point) => void;
}

interface CanvasState {
}

class Canvas extends Component<CanvasProps, CanvasState> {
    private _canvasRef = createRef<HTMLCanvasElement>();
    private _lastMousePos: Point = ORIGIN; // for touch screen, track pad and mouse
    private _distance: number = 0; // for touch screen

    private _cameraControl?: CameraControl;

    private _ticker: any;
    private _wheelTimeout: any;

    private _shapes: Shape[] = [];

    set shapes(s: Shape[]) {
        this._shapes = s;
    }

    set cameraDisable(b: boolean) {
        this._cameraControl!.disabled = b;
    }

    get cameraState(): CameraState { return this._cameraControl!.state };

    constructor(prop: CanvasProps) {
        super(prop);
        this.state = {}
    }

    componentDidMount(): void {
        const [canvas, context] = this._getCanvas();
        this._cameraControl = new CameraControl({ context: context, canvas: canvas, cameraBound: this.props.cameraBound })
        this._setCanvasSize();
        this._cameraControl.zoomTo({ x: 0, y: 0 }, this.props.cameraBound);
        this._ticker = setInterval(this._draw, 16.667);
        window.addEventListener('resize', this._onWindowsResize);
        canvas.addEventListener('wheel', this._onWheel);
        canvas.addEventListener('mousedown', this._onMouseDown);
        canvas.addEventListener('mousemove', this._onMouseMove);
        canvas.addEventListener('touchstart', this._onTouchStart);
        canvas.addEventListener('dblclick', this._onDoubleClick);
    }

    componentWillUnmount(): void {
        const [canvas, _] = this._getCanvas();
        clearInterval(this._ticker);
        window.removeEventListener('resize', this._onWindowsResize);
        canvas.removeEventListener('wheel', this._onWheel);
        canvas.removeEventListener('mousedown', this._onMouseDown);
        canvas.removeEventListener('mousemove', this._onMouseMove);
        canvas.removeEventListener('touchstart', this._onTouchStart);
        canvas.removeEventListener('dblclick', this._onDoubleClick);
    }

    public toCanvasPoint = (p: Point): Point => {
        return this._cameraControl!.toLocalPoint(p);
    }

    public toScreenPoint = (p: Point): Point => {
        return this._cameraControl!.toClientPoint(p);
    }

    private _onWindowsResize = (): void => {
        this._setCanvasSize();
    }

    private _getCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
        const canvas = this._canvasRef.current!;
        const context = canvas.getContext('2d')!;
        return [canvas, context];
    }

    private _setCanvasSize = (): void => {
        const [canvas, context] = this._getCanvas();
        const storedTransform = context.getTransform();
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        context.setTransform(storedTransform);
        this._cameraControl!.canvasSize = { w: canvas.width, h: canvas.height };
    }

    private _draw = (): void => {
        const [canvas, context] = this._getCanvas();
        const storedTransform = context.getTransform();
        canvas.width = canvas.width;
        context.setTransform(storedTransform);

        this._cameraControl!.outBoundCorrection();

        for (const s of this._shapes) {
            s.draw(canvas, context);
        }
    }

    private _onDoubleClick = (event: MouseEvent): void => {
        this.props.onDoubleClick({ x: event.pageX, y: event.pageY }, this._cameraControl!.toLocalPoint({ x: event.pageX, y: event.pageY }));
    }

    private _onMouseMove = (event: MouseEvent): void => {
        this.props.onMouseMove({ x: event.pageX, y: event.pageY }, this._cameraControl!.toLocalPoint({ x: event.pageX, y: event.pageY }));
    }

    private _onMouseDown = (event: MouseEvent): void => {
        if (event.button === 1) {
            event.preventDefault();
            const [canvas, _] = this._getCanvas();
            canvas.addEventListener('mousemove', this._onMouseWheelMove);
            canvas.addEventListener('mouseup', this._onMouseWheelUp);
            canvas.addEventListener('mouseout', this._onMouseWheelUp);
            this._cameraControl!.control();
            this._lastMousePos = { x: event.pageX, y: event.pageY };
        } else if (event.button === 0) {
            event.preventDefault();
            const [canvas, _] = this._getCanvas();
            canvas.addEventListener('mousemove', this._onMouseLeftMove);
            canvas.addEventListener('mouseup', this._onMouseLeftUp);
            canvas.addEventListener('mouseout', this._onMouseLeftUp);
            this.props.onDragStart({ x: event.pageX, y: event.pageY }, this._cameraControl!.toLocalPoint({ x: event.pageX, y: event.pageY }));
        }
    }

    private _onMouseWheelUp = (event: MouseEvent): void => {
        event.preventDefault();
        const [canvas, _] = this._getCanvas();
        canvas.removeEventListener('mousemove', this._onMouseWheelMove);
        canvas.removeEventListener('mouseup', this._onMouseWheelUp);
        canvas.removeEventListener('mouseout', this._onMouseWheelUp);
        this._cameraControl!.release();
    }

    private _onMouseWheelMove = (event: MouseEvent): void => {
        event.preventDefault();
        const lastMousePos = this._lastMousePos;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        this._lastMousePos = currentMousePos;

        const delta = diffPoints(currentMousePos, lastMousePos);
        this._cameraControl!.moveCamera(delta);
    }

    private _onMouseLeftUp = (event: MouseEvent): void => {
        event.preventDefault();
        const [canvas, _] = this._getCanvas();
        this.props.onDragEnd({ x: event.pageX, y: event.pageY }, this._cameraControl!.toLocalPoint({ x: event.pageX, y: event.pageY }));

        canvas.removeEventListener('mouseup', this._onMouseLeftUp);
        canvas.removeEventListener('mousemove', this._onMouseLeftMove);
        canvas.removeEventListener('mouseout', this._onMouseLeftUp);
    }

    private _onMouseLeftMove = (event: MouseEvent): void => {
        event.preventDefault();
        this.props.onDragMove({ x: event.pageX, y: event.pageY }, this._cameraControl!.toLocalPoint({ x: event.pageX, y: event.pageY }));
    }

    private _onWheel = (event: WheelEvent): void => {
        event.preventDefault();
        this._cameraControl?.control();
        clearTimeout(this._wheelTimeout);
        this._wheelTimeout = setTimeout(() => {
            this._cameraControl?.release();
        }, 100);
        if (event.ctrlKey) {
            this._cameraControl!.zoom({ x: event.pageX, y: event.pageY }, event.deltaY)
        } else {
            this._cameraControl!.moveCamera({ x: -event.deltaX, y: -event.deltaY });
        }
    }

    private _onTouchStart = (event: TouchEvent): void => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const [canvas, _] = this._getCanvas();
            canvas.addEventListener('touchmove', this._onTouchMove);
            canvas.addEventListener('touchend', this._onTouchEnd);
            const p1: Point = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            const p2: Point = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            this._cameraControl!.control();
            this._lastMousePos = middlePoint(p1, p2);
            this._distance = pointDistance(p1, p2);
        }
    }

    private _onTouchMove = (event: TouchEvent): void => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const p1: Point = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            const p2: Point = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            const lastMousePos = this._lastMousePos;
            const currentMousePos = middlePoint(p1, p2);
            this._lastMousePos = currentMousePos;
            const moveDelta = diffPoints(currentMousePos, lastMousePos);
            this._cameraControl!.moveCamera(moveDelta);

            const lastDistance = this._distance;
            const currentDistance = pointDistance(p1, p2);
            this._distance = currentDistance;
            const zoomDelta = currentDistance - lastDistance;
            this._cameraControl!.zoom(this._lastMousePos, -zoomDelta);
        }
    }

    private _onTouchEnd = (event: TouchEvent): void => {
        event.preventDefault();
        const [canvas, _] = this._getCanvas();
        canvas.removeEventListener('touchmove', this._onTouchMove);
        canvas.removeEventListener('touchend', this._onTouchEnd);
        this._cameraControl?.release();
    }

    render(): ReactNode {
        return (
            <canvas id="canvas" ref={this._canvasRef} />
        )
    }
}

export default Canvas;