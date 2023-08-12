import { Size, ZERO_SIZE } from '../util/size';
import { ORIGIN, Point, addPoints, middlePoint, rotatePoint } from '../util/point';
import { TextEditableItem } from '../item/item';
import { InteractorContext } from './item-interactor';
import { measureTextHeight, measureTextWidth } from '../util/font-metric';
import { fourCornerForRotatedRectangle } from '../util/bounding-box';

interface TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string];
    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void;
    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void;
}

class FreeTextEditStrategy implements TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string] {
        item.isEditing = true;
        return ['free', item.pos, item.size, item.rotate, item.text];
    }

    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16), h: measureTextHeight(text, 16, 1.2) }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, delta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        item.pos = newTopLeft;
        item.size = newSize;
    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.isEditing = false;
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16), h: measureTextHeight(text, 16, 1.2) }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, delta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        item.pos = newTopLeft;
        item.size = newSize;
    }
}

class BoundedTextEditStrategy implements TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string] {
        item.isEditing = true;
        return ['bounded', item.pos, item.size, item.rotate, item.text];
    }

    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.text = text;
    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.isEditing = false;
        item.text = text;
    }
}

export default TextEditStrategy;
export {
    FreeTextEditStrategy,
    BoundedTextEditStrategy
}