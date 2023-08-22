import { Point } from './util/point';
import { Size } from './util/size';

const DEFAULT_DISPLAY: DisplayFlag = {
    showEditableArea: true,
    showObstacle: true,
    showSize: false,
    showText: true
};

interface DisplayFlag {
    showEditableArea: boolean;
    showObstacle: boolean;
    showSize: boolean;
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
export type { DisplayFlag };
export {
    DEFAULT_DISPLAY
}