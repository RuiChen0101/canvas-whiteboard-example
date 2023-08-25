import Photo from '../item/photo';
import sha1 from 'crypto-js/sha1';
import enc from 'crypto-js/enc-hex';
import ImageData from '../type/image-data';
import Visitor, { VisitorBase } from './visitor';
import RemoteComposite from '../item/remote-composite';
import { imageUrlToBase64, imageSize } from '../util/image';

class InitItemVisitor extends VisitorBase implements Visitor {
    private _promise: Promise<any>[] = [];
    private _urlSet: Set<string> = new Set();
    private _imageData: Map<string, ImageData> = new Map();

    visitPhoto(photo: Photo): void {
        this._urlSet.add(photo.url);
    }

    visitRemoteComposite(remoteComposite: RemoteComposite): void {
        this._promise.push(this._visitRemoteComposite(remoteComposite));
    }

    async _visitRemoteComposite(removeComposite: RemoteComposite): Promise<void> {
        await removeComposite.load();
        const subVisitor = new InitItemVisitor();
        for (const i of removeComposite.items) {
            i.visit(subVisitor);
        }
        await subVisitor.waitComplete();
        subVisitor.getImageDataResult().forEach((d, k) => this._imageData.set(k, d));
    }

    async waitComplete(): Promise<void> {
        const imageLoadPromises: Promise<ImageData>[] = [];
        this._urlSet.forEach(url => imageLoadPromises.push(this._loadImageUrl(url)))
        const data: ImageData[] = await Promise.all(imageLoadPromises);
        for (const m of data) {
            this._imageData.set(m.urlHash, m);
        }
        await Promise.all(this._promise);
    }

    getImageDataResult(): Map<string, ImageData> {
        return this._imageData;
    }

    private async _loadImageUrl(url: string): Promise<ImageData> {
        const data = await imageUrlToBase64(url);
        const size = await imageSize(data);
        return {
            url: url,
            urlHash: this._hash(url),
            data: data,
            size: size,
        }
    }

    private _hash(str: string): string {
        return sha1(str).toString(enc);
    }
}

export default InitItemVisitor;