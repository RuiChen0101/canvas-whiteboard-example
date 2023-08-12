const measureCanvas = document.createElement('canvas');
const measureContext = measureCanvas.getContext('2d');

measureCanvas.style.display = 'none';

document.body.appendChild(measureCanvas);

const measureTextWidth = (text: string, fontFamily: string, fontSize: number): number => {
    measureCanvas.width = measureCanvas.width;
    measureContext!.font = `${fontSize}px ${fontFamily}`;
    let maxWidth = 0;
    const lines = text.split(/\n/g);
    for (const l of lines) {
        const metric = measureContext!.measureText(l);
        maxWidth = Math.max(maxWidth, metric.width);
    }
    return maxWidth;
}

const measureTextHeight = (text: string, fontSize: number, lineHeight: number): number => {
    const lineCount = (text.match(/\n/g) ?? []).length + 1;
    return fontSize + (fontSize * lineHeight * (lineCount - 1));
}

export {
    measureTextWidth,
    measureTextHeight,
}