import { Size } from '../util/size';
import { TextEditableItem } from '../item/item';
import { InteractorContext } from './item-interactor';
import { measureTextHeight, measureTextWidth } from '../util/font-metric';
import { Point } from '../util/point';

interface TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string];
    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): [Point, Size, number];
    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void;
}

class FreeTextEditStrategy implements TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string] {
        item.isEditing = true;
        return ['free', item.pos, item.size, item.rotate, item.text];
    }

    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): [Point, Size, number] {
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16), h: measureTextHeight(text, 16, 1.2) }
        // const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        // console.log(delta);
        // const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        // const rbr = addPoints(bottomRight, delta);
        // const newCenter = middlePoint(topLeft, rbr);
        // const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        // const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        // const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        // if (newSize.w <= 1 || newSize.h <= 1) return [item.pos, item.size, item.rotate];
        // item.pos = newTopLeft;
        item.size = size;
        return [item.pos, item.size, item.rotate];
    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.isEditing = false;
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16), h: measureTextHeight(text, 16, 1.2) }
        // const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        // const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        // const rbr = addPoints(bottomRight, delta);
        // const newCenter = middlePoint(topLeft, rbr);
        // const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        // const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        // const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        // if (newSize.w <= 1 || newSize.h <= 1) return;
        // item.pos = newTopLeft;
        item.size = size;
    }
}

class BoundedTextEditStrategy implements TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string] {
        item.isEditing = true;
        return ['bounded', item.pos, item.size, item.rotate, item.text];
    }

    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): [Point, Size, number] {
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16) + 8, h: measureTextHeight(text, 16, 1.2) + 8 }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        if (delta.x <= 0 && delta.y <= 0) return [item.pos, item.size, item.rotate];
        const newSize = { w: delta.x > 0 ? size.w : item.size.w, h: delta.y > 0 ? size.h : item.size.h };
        // delta.x = Math.max(0, delta.x);
        // delta.y = Math.max(0, delta.y);
        // const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        // const rbr = addPoints(bottomRight, delta);
        // const newCenter = middlePoint(topLeft, rbr);
        // const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        // const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        // const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        // if (newSize.w <= 1 || newSize.h <= 1) return [item.pos, item.size, item.rotate];
        // item.pos = newTopLeft;
        item.size = newSize;
        return [item.pos, item.size, item.rotate];
    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.isEditing = false;
        item.text = text;
        const size = { w: measureTextWidth(text, 'serif', 16) + 8, h: measureTextHeight(text, 16, 1.2) + 8 }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        if (delta.x <= 0 && delta.y <= 0) return;
        const newSize = { w: delta.x > 0 ? size.w : item.size.w, h: delta.y > 0 ? size.h : item.size.h };
        // delta.x = Math.max(0, delta.x);
        // delta.y = Math.max(0, delta.y);
        // const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        // const rbr = addPoints(bottomRight, delta);
        // const newCenter = middlePoint(topLeft, rbr);
        // const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        // const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        // const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        // if (newSize.w <= 1 || newSize.h <= 1) return;
        // item.pos = newTopLeft;
        item.size = newSize;
    }
}

export default TextEditStrategy;
export {
    FreeTextEditStrategy,
    BoundedTextEditStrategy
}