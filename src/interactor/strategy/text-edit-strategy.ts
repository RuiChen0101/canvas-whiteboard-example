import { Size } from '../../util/size';
import { FontStyle } from '../../type/font-style';
import { TextEditableItem } from '../../item/item';
import { InteractorInfo } from '../item-interactor';
import { fourCornerForRotatedRectangle } from '../../util/bounding-box';
import { measureTextHeight, measureTextWidth } from '../../util/font-measure';
import { ORIGIN, Point, addPoints, middlePoint, rotatePoint } from '../../util/point';

interface TextEditStrategy {
    startEdit(info: InteractorInfo, item: TextEditableItem): [string, Point, Size, number, FontStyle, string];
    onEdit(info: InteractorInfo, item: TextEditableItem, text: string): [Point, Size, number];
    endEdit(info: InteractorInfo, item: TextEditableItem, text: string): void;
}

class FreeTextEditStrategy implements TextEditStrategy {
    startEdit(info: InteractorInfo, item: TextEditableItem): [string, Point, Size, number, FontStyle, string] {
        item.setIsEditing(true);
        return ['free', item.pos, item.size, item.rotate, item.fontStyle, item.text];
    }

    onEdit(info: InteractorInfo, item: TextEditableItem, text: string): [Point, Size, number] {
        item.setText(text);
        const size = { w: measureTextWidth(text, item.fontStyle.family, item.fontStyle.size), h: measureTextHeight(text, item.fontStyle.size, item.fontStyle.lineHight) }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        const rotatedDelta: Point = rotatePoint(delta, ORIGIN, item.rotate);
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, rotatedDelta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return [item.pos, item.size, item.rotate];
        item.setPos(newTopLeft);
        item.setSize(newSize);
        return [item.pos, item.size, item.rotate];
    }

    endEdit(info: InteractorInfo, item: TextEditableItem, text: string): void {
        item.setIsEditing(false);
        item.setText(text);
        const size = { w: measureTextWidth(text, item.fontStyle.family, item.fontStyle.size), h: measureTextHeight(text, item.fontStyle.size, item.fontStyle.lineHight) }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        const rotatedDelta: Point = rotatePoint(delta, ORIGIN, item.rotate);
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, rotatedDelta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        item.setPos(newTopLeft);
        item.setSize(newSize);
    }
}

class BoundedTextEditStrategy implements TextEditStrategy {
    startEdit(info: InteractorInfo, item: TextEditableItem): [string, Point, Size, number, FontStyle, string] {
        item.setIsEditing(true);
        return ['bounded', item.pos, item.size, item.rotate, item.fontStyle, item.text];
    }

    onEdit(info: InteractorInfo, item: TextEditableItem, text: string): [Point, Size, number] {
        item.setText(text);
        const size = { w: measureTextWidth(text, item.fontStyle.family, item.fontStyle.size) + 8, h: measureTextHeight(text, item.fontStyle.size, item.fontStyle.lineHight) + 8 };
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        if (delta.x <= 0 && delta.y <= 0) return [item.pos, item.size, item.rotate];
        delta.x = Math.max(0, delta.x);
        delta.y = Math.max(0, delta.y);
        const rotatedDelta = rotatePoint(delta, ORIGIN, item.rotate);
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, rotatedDelta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return [item.pos, item.size, item.rotate];
        item.setPos(newTopLeft);
        item.setSize(newSize);
        return [item.pos, item.size, item.rotate];
    }

    endEdit(info: InteractorInfo, item: TextEditableItem, text: string): void {
        item.setIsEditing(false);
        item.setText(text);
        const size = { w: measureTextWidth(text, item.fontStyle.family, item.fontStyle.size) + 8, h: measureTextHeight(text, item.fontStyle.size, item.fontStyle.lineHight) + 8 }
        const delta: Point = { x: size.w - item.size.w, y: size.h - item.size.h };
        if (delta.x <= 0 && delta.y <= 0) return;
        delta.x = Math.max(0, delta.x);
        delta.y = Math.max(0, delta.y);
        const rotatedDelta = rotatePoint(delta, ORIGIN, item.rotate);
        const [topLeft, _topRight, bottomRight, _bottomLeft] = fourCornerForRotatedRectangle(item.pos, item.size, item.rotate);
        const rbr = addPoints(bottomRight, rotatedDelta);
        const newCenter = middlePoint(topLeft, rbr);
        const newTopLeft = rotatePoint(topLeft, newCenter, -item.rotate);
        const newBottomRight = rotatePoint(rbr, newCenter, -item.rotate);
        const newSize = { w: newBottomRight.x - newTopLeft.x, h: newBottomRight.y - newTopLeft.y };
        if (newSize.w <= 1 || newSize.h <= 1) return;
        item.setPos(newTopLeft);
        item.setSize(newSize);
    }
}

export default TextEditStrategy;
export {
    FreeTextEditStrategy,
    BoundedTextEditStrategy
}