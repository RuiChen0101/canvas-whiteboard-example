import Item from '../item/item';
import Shape from '../shape/shape';
import { Size } from '../util/size';
import { Point } from '../util/point';
import { FontStyle } from '../type/font-style';

enum InteractingType {
    Text,
    Body,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    Rotate,
    None
}

interface InteractorContext {
    topLeft: Point;
    topCenter: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
    size: Size;
    lastPos: Point;
}

const PADDING: number = 10;
const ANCHOR_SIZE: Size = Object.freeze({ w: 8, h: 8 });

interface ItemInteractor {
    get items(): Item[];
    get isInteracting(): boolean
    checkInteract(pos: Point, doubleClick: boolean): InteractingType;
    onTextEditStart(): [string, Point, Size, number, FontStyle, string];
    onTextEdit(text: string): [Point, Size, number];
    onTextEditEnd(text: string): void;
    onDragStart(pos: Point): void;
    onDragMove(pos: Point): void;
    onDragEnd(pos: Point): void;
    draw(): Shape[]
}

// export default ItemInteractor;
export type {
    ItemInteractor,
    InteractorContext,
}
export {
    InteractingType,
    PADDING,
    ANCHOR_SIZE,
};