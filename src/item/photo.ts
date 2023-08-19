import Visitor from '../visitor/visitor';
import Item, { Collidable, ItemBase, ItemState } from './item';
import MoveStrategy, { FreeMoveStrategy } from '../interactor/move-strategy';
import RotateStrategy, { FreeRotateStrategy } from '../interactor/rotate-strategy';
import ResizeStrategy, { DiagonalResizeStrategy } from '../interactor/resize-strategy';

interface PhotoProps extends ItemState {
    url: string;
}

interface PhotoState extends ItemState {
    url: string;
    isCollide: boolean;
}

class Photo extends ItemBase<PhotoState> implements Item, Collidable {
    get url(): string { return this._state.url; }

    get collidable(): boolean { return true; }
    get isCollide(): boolean { return this._state.isCollide; }
    setIsCollide(b: boolean): void { this._state.isCollide = b; }

    constructor(prop: PhotoProps) {
        super({ ...prop, isCollide: false });
    }

    get moveStrategy(): MoveStrategy {
        return new FreeMoveStrategy();
    }

    get resizeStrategy(): ResizeStrategy {
        return new DiagonalResizeStrategy();
    }

    get rotateStrategy(): RotateStrategy {
        return new FreeRotateStrategy();
    }

    visit(visitor: Visitor): void {
        visitor.visitPhoto(this);
    }
}

export default Photo;