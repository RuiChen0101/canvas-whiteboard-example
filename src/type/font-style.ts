interface FontStyle {
    family: string;
    size: number;
    lineHight: number;
}

const DEFAULT_STYLE: FontStyle = {
    family: "serif",
    size: 16,
    lineHight: 1.2
}

export type { FontStyle };
export {
    DEFAULT_STYLE
}