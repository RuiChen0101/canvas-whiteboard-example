import Photo from '../item/photo';
import Visitor, { VisitorBase } from './visitor';

class CollectImageUrlVisitor extends VisitorBase implements Visitor {
    private _urls: string[] = [];

    visitPhoto(photo: Photo): void {
        this._urls.push(photo.url);
    }

    getResult(): string[] {
        return this._urls;
    }
}

export default CollectImageUrlVisitor;