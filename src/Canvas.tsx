import { Component, ReactNode, createRef } from 'react';

import './Canvas.scss';

import Text from './shape/text';
import Circle from './shape/circle';
import Rectangle from './shape/rectangle';
import { Point, diffPoints, addPoints, scalePoint, ORIGIN, middlePoint, pointDistance } from './util/point';

const ZOOM_SENSITIVITY: number = 200;

interface CanvasState {
}

class Canvas extends Component<any, CanvasState> {
    private _canvasRef = createRef<HTMLCanvasElement>();
    private _lastMousePos: Point = ORIGIN; // for touch screen, track pad and mouse
    private _distance: number = 0; // for touch screen
    private _offset: Point = ORIGIN;
    private _viewport: Point = ORIGIN;
    private _scale: number = 1;

    constructor(prop: any) {
        super(prop);
        this.state = {
        }
    }

    componentDidMount(): void {
        this._setCanvasSize();
        this._draw();
        const [canvas, _] = this._getCanvas();
        window.addEventListener('resize', this._onWindowsResize);
        canvas.addEventListener('wheel', this._onWheel);
        canvas.addEventListener('mousedown', this._onMouseDown);
        canvas.addEventListener('touchstart', this._onTouchStart);
    }

    componentWillUnmount(): void {
        const [canvas, _] = this._getCanvas();
        window.removeEventListener('resize', this._onWindowsResize);
        canvas.removeEventListener('wheel', this._onWheel);
        canvas.removeEventListener('mousedown', this._onMouseDown);
        canvas.removeEventListener('touchstart', this._onTouchStart);
    }

    private _onWindowsResize = (): void => {
        this._setCanvasSize();
        this._draw();
    }

    private _getCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
        const canvas = this._canvasRef.current!;
        const context = canvas.getContext('2d')!;
        return [canvas, context];
    }

    private _setCanvasSize = (): void => {
        const [canvas, _] = this._getCanvas();
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }

    private _draw = (): void => {
        const [canvas, context] = this._getCanvas();
        const storedTransform = context.getTransform();
        context.canvas.width = context.canvas.width;
        context.setTransform(storedTransform);

        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                const pos = { x: i * 60 + i * 5, y: j * 60 + j * 5 };
                new Text({ pos: { x: pos.x - 9, y: pos.y + 5 }, text: "text" }).draw(canvas, context);
            }
        }
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                const pos = { x: i * 60 + i * 5, y: j * 60 + j * 5 };
                new Circle({ pos: pos, radius: 30 }).draw(canvas, context);
            }
        }
    }

    private _onMouseDown = (event: MouseEvent): void => {
        if (event.button === 1) {
            const [canvas, _] = this._getCanvas();
            canvas.addEventListener('mousemove', this._onMouseMove);
            canvas.addEventListener('mouseup', this._onMouseUp);
            this._lastMousePos = { x: event.pageX, y: event.pageY };
        }
    }

    private _onMouseUp = (event: MouseEvent): void => {
        const [canvas, _] = this._getCanvas();
        canvas.removeEventListener('mousemove', this._onMouseMove);
        canvas.removeEventListener('mouseup', this._onMouseUp);
    }

    private _onMouseMove = (event: MouseEvent): void => {
        const lastMousePos = this._lastMousePos;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        this._lastMousePos = currentMousePos;

        const delta = diffPoints(currentMousePos, lastMousePos);
        this._moveCamera(delta);
        this._draw();
    }

    private _onWheel = (event: WheelEvent): void => {
        event.preventDefault();
        if (event.ctrlKey) {
            this._zoom({ x: event.clientX, y: event.clientY }, event.deltaY)
        } else {
            this._moveCamera({ x: -event.deltaX, y: -event.deltaY });
        }
        this._draw();
    }

    private _onTouchStart = (event: TouchEvent): void => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const [canvas, _] = this._getCanvas();
            canvas.addEventListener('touchmove', this._onTouchMove);
            canvas.addEventListener('touchend', this._onTouchEnd);
            const p1: Point = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            const p2: Point = { x: event.touches[1].clientX, y: event.touches[1].clientY };
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
            this._moveCamera(moveDelta);

            const lastDistance = this._distance;
            const currentDistance = pointDistance(p1, p2);
            this._distance = currentDistance;
            const zoomDelta = currentDistance - lastDistance;
            this._zoom(this._lastMousePos, -zoomDelta);

            this._draw();
        }
    }

    private _onTouchEnd = (event: TouchEvent): void => {
        event.preventDefault();
        const [canvas, _] = this._getCanvas();
        canvas.addEventListener('touchmove', this._onTouchMove);
        canvas.addEventListener('touchend', this._onTouchEnd);
    }

    private _moveCamera = (delta: Point): void => {
        const [_, context] = this._getCanvas();
        const newOffset = addPoints(this._offset, delta);

        const offsetDiff = scalePoint(
            diffPoints(newOffset, this._offset),
            this._scale
        );
        this._offset = newOffset;
        this._viewport = diffPoints(this._viewport, offsetDiff);
        context.translate(offsetDiff.x, offsetDiff.y);
    }

    private _zoom = (zoomCenter: Point, delta: number): void => {
        const [canvas, context] = this._getCanvas();
        const zoom = 1 - delta / ZOOM_SENSITIVITY;
        const mousePos = diffPoints({ x: zoomCenter.x, y: zoomCenter.y }, { x: canvas.offsetLeft, y: canvas.offsetTop });
        const viewportDelta = {
            x: (mousePos.x / this._scale) * (1 - 1 / zoom),
            y: (mousePos.y / this._scale) * (1 - 1 / zoom)
        };
        const newViewport = addPoints(
            this._viewport,
            viewportDelta
        );

        context.translate(this._viewport.x, this._viewport.y);
        context.scale(zoom, zoom);
        context.translate(-newViewport.x, -newViewport.y);

        this._viewport = newViewport;
        this._scale = this._scale * zoom;

        const offsetDiff = scalePoint(
            ORIGIN,
            this._scale
        );
        context.translate(offsetDiff.x, offsetDiff.y);
        this._viewport = diffPoints(this._viewport, offsetDiff);
    }

    render(): ReactNode {
        return (
            <canvas id="canvas" ref={this._canvasRef} />
        )
    }
}

export default Canvas;