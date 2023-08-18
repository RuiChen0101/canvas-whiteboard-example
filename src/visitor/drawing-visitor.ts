import Box from '../item/box';
import Text from '../shape/text';
import Photo from '../item/photo';
import sha1 from 'crypto-js/sha1';
import Shape from '../shape/shape';
import enc from 'crypto-js/enc-hex';
import Rotate from '../shape/rotate';
import Obstacle from '../item/obstacle';
import Rectangle from '../shape/rectangle';
import ImageShape from '../shape/image-shape';
import Description from '../item/description';
import Visitor, { VisitorBase } from './visitor';
import { Point, centerPoint } from '../util/point';
import { ImageData } from '../preloader/image-preload';

class DrawingVisitor extends VisitorBase implements Visitor {
    private _shapes: Shape[] = [];
    private _imageData: Map<string, ImageData>;

    constructor(ImageData: Map<string, ImageData>) {
        super();
        this._imageData = ImageData;
    }

    visitBox(box: Box): void {
        const shapes: Shape[] = [
            new Rectangle({ pos: box.pos, size: box.size }),
        ];
        if (!box.isEditing) {
            shapes.push(new Text({ text: box.name, pos: centerPoint(box.pos, box.size), vAlign: 'middle', hAlign: 'center' }));
        }
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(box.pos, box.size), box.rotate));
    }

    visitPhoto(photo: Photo): void {
        const imageData = this._imageData.get(this._hash(photo.url));
        if (imageData === undefined) throw `image not found`;
        const shapes: Shape[] = [
            new ImageShape({ pos: photo.pos, size: photo.size, encodedImage: imageData.data })
        ];
        this._shapes.push(...this._decoWithRotate(shapes, centerPoint(photo.pos, photo.size), photo.rotate));
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

    private _decoWithRotate(shapes: Shape[], anchor: Point, rotate: number): Shape[] {
        if (rotate === 0) {
            return shapes;
        } else {
            return [new Rotate({ shapes: shapes, rotate: rotate, anchor: anchor })];
        }
    }

    private _hash(str: string): string {
        return sha1(str).toString(enc);
    }

    getResult(): Shape[] {
        return this._shapes;
    }
}

export default DrawingVisitor;