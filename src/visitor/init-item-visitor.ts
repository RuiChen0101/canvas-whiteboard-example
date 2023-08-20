import Photo from '../item/photo';
import Visitor, { VisitorBase } from './visitor';

class InitItemVisitor extends VisitorBase implements Visitor {
    private _promise: Promise<any>[] = [];
    private _imageData: Map<string, ImageData> = new Map();

    visitPhoto(photo: Photo): void {

    }

    async waitComplete(): Promise<void> {
        await Promise.all(this._promise);
    }
}

export default InitItemVisitor;