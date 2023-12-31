import Item from '../item/item';
import Shape from '../shape/shape';
import { Size } from '../util/size';
import { Point } from '../util/point';
import AppContext from '../AppContext';
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

interface InteractorInfo {
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
    get isInteracting(): boolean;
    get stillStatic(): boolean;
    checkInteract(pos: Point, doubleClick: boolean): InteractingType;
    onTextEditStart(): [string, Point, Size, number, FontStyle, string];
    onTextEdit(ctx: AppContext, text: string): [Point, Size, number];
    onTextEditEnd(text: string): boolean;
    onDragStart(pos: Point): void;
    onDragMove(ctx: AppContext, pos: Point): void
    onDragEnd(pos: Point): boolean;
    draw(): Shape[]
}

// export default ItemInteractor;
export type {
    ItemInteractor,
    InteractorInfo,
}
export {
    InteractingType,
    PADDING,
    ANCHOR_SIZE,
};