import { Size } from './size';

const imageUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((onSuccess, onError) => {
        try {
            const reader = new FileReader();
            reader.onload = function () {
                if (this.result === null) {
                    onError('empty data');
                    return;
                }
                onSuccess(this.result.toString());
            };
            reader.readAsDataURL(blob);
        } catch (e) {
            onError(e);
        }
    });
};

const imageSize = async (encodedImage: string): Promise<Size> => {
    const image = new Image();
    image.src = encodedImage;
    await image.decode();
    return { w: image.naturalWidth, h: image.naturalHeight };
}

export { imageUrlToBase64, imageSize };