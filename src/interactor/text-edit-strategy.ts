import { Size, ZERO_SIZE } from '../util/size';
import { ORIGIN, Point } from '../util/point';
import { TextEditableItem } from '../item/item';
import { InteractorContext } from './item-interactor';

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
    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {
        item.isEditing = false;
        item.text = text;
    }
}

class BoundedTextEditStrategy implements TextEditStrategy {
    startEdit(ctx: InteractorContext, item: TextEditableItem): [string, Point, Size, number, string] {
        return ['bounded', ORIGIN, ZERO_SIZE, 0, ''];
    }

    onEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {

    }

    endEdit(ctx: InteractorContext, item: TextEditableItem, text: string): void {

    }
}

export default TextEditStrategy;
export {
    FreeTextEditStrategy,
    BoundedTextEditStrategy
}