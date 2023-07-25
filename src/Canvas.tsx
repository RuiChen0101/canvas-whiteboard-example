import { Component, ReactNode, createRef } from 'react';

import './Canvas.scss';

import { Point, diffPoints, addPoints, scalePoint, ORIGIN } from './util/point';

const ZOOM_SENSITIVITY = 500;

interface CanvasState {
}

class Canvas extends Component<any, CanvasState> {
    private _canvasRef = createRef<HTMLCanvasElement>();
    private _lastMousePos: Point = ORIGIN;
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
        document.addEventListener('resize', this._onWindowsResize);
        canvas.addEventListener("wheel", this._onZoom);
    }

    componentWillUnmount(): void {
        const [canvas, _] = this._getCanvas();
        document.removeEventListener('resize', this._onWindowsResize);
        canvas.removeEventListener("wheel", this._onZoom);
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
        const [_, context] = this._getCanvas();
        const storedTransform = context.getTransform();
        context.canvas.width = context.canvas.width;
        context.setTransform(storedTransform);
        context.strokeStyle = "#0d6efd";
        context?.rect(800, 20, 200, 100);
        context.stroke();
        context.font = "100px serif";
        context?.fillText("text", 100, 200);
        context.font = "50px serif";
        context?.fillText("text", 100, 0);
    }

    private _onStartPen = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("mouseup", this._onMouseUp);
        this._lastMousePos = { x: event.pageX, y: event.pageY };
    }

    private _onMouseUp = (): void => {
        document.removeEventListener("mousemove", this._onMouseMove);
        document.removeEventListener("mouseup", this._onMouseUp);
    }

    private _onMouseMove = (event: MouseEvent): void => {
        const lastMousePos = this._lastMousePos;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        this._lastMousePos = currentMousePos;

        const diff = diffPoints(currentMousePos, lastMousePos);
        const newOffset = addPoints(this._offset, diff);

        const offsetDiff = scalePoint(
            diffPoints(newOffset, this._offset),
            this._scale
        );
        this._offset = newOffset;
        this._viewport = diffPoints(this._viewport, offsetDiff);
        const [_, context] = this._getCanvas();
        context.translate(offsetDiff.x, offsetDiff.y);
        this._draw();
    }

    private _onZoom = (event: WheelEvent): void => {
        event.preventDefault();
        const [canvas, context] = this._getCanvas();
        const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
        const mousePos = diffPoints({ x: event.clientX, y: event.clientY }, { x: canvas.offsetLeft, y: canvas.offsetTop });
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

        this._draw();
    }

    render(): ReactNode {
        return (
            <canvas onMouseDown={this._onStartPen} id="canvas" ref={this._canvasRef} />
        )
    }
}

export default Canvas;