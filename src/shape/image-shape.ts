import Shape from './shape';
import { ORIGIN, Point } from '../util/point';
import { Size, ZERO_SIZE } from '../util/size';

type ImageShapeProp = {
    pos?: Point;
    size?: Size;
    encodedImage?: string; // base64 encoded
}

class ImageShape implements Shape {
    private _pos: Point;
    private _size: Size;
    private _encodedImage: string;

    constructor(prop?: ImageShapeProp) {
        this._pos = prop?.pos ?? ORIGIN;
        this._size = prop?.size ?? ZERO_SIZE;
        this._encodedImage = prop?.encodedImage ?? '';
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        const image = new Image();
        image.src = this._encodedImage;
        context.drawImage(image, this._pos.x, this._pos.y, this._size.w, this._size.h);
        context.closePath();
    }
}

export default ImageShape;
export type { ImageShapeProp };