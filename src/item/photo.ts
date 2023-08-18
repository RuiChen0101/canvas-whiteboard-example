import Visitor from '../visitor/visitor';
import Item, { ItemBase, ItemState } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import ResizeStrategy, { DiagonalResizeStrategy } from '../interactor/resize-strategy';

interface PhotoState extends ItemState {
    url: string;
}

class Photo extends ItemBase<PhotoState> implements Item {
    public get url(): string { return this._state.url; }

    public get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    public get resizeStrategy(): ResizeStrategy {
        return new DiagonalResizeStrategy();
    }

    public get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    visit(visitor: Visitor): void {
        visitor.visitPhoto(this);
    }
}

export default Photo;