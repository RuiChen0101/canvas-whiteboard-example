import { Point } from './util/point';
import { Size } from './util/size';

interface DisplayFlag {
    showObstacle: boolean;
    showText: boolean;
}

interface AppContext {
    canvasSize: Size;
    editableTopLeftPos: Point;
    editableBottomRightPos: Point;
    scale: number; // pixel to 1 meter;
    display: DisplayFlag;
}

export default AppContext;