import sha1 from 'crypto-js/sha1';
import enc from 'crypto-js/enc-hex';
import ImageData from '../type/image-data';
import { imageSize, imageUrlToBase64 } from '../util/image';

class ImagePreloader {
    private _imageData: Map<string, ImageData> = new Map();

    async load(urls: string[]): Promise<Map<string, ImageData>> {
        const uniqueUrls = new Set(urls);
        const promises: Promise<ImageData>[] = [];
        uniqueUrls.forEach(url => promises.push(this.loadUrl(url)))
        const data: ImageData[] = await Promise.all(promises);
        for (const m of data) {
            this._imageData.set(m.urlHash, m);
        }
        return this._imageData;
    }

    async loadUrl(url: string): Promise<ImageData> {
        const data = await imageUrlToBase64(url);
        const size = await imageSize(data);
        return {
            url: url,
            urlHash: this.hash(url),
            data: data,
            size: size,
        }
    }

    hash(str: string): string {
        return sha1(str).toString(enc);
    }

    getResult(): Map<string, ImageData> {
        return this._imageData;
    }
}

export default ImagePreloader;