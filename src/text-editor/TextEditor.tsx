import { Root, createRoot } from 'react-dom/client';

import FreeTextEditor from './FreeTextEditor';
import BoundedTextEditor from './BoundedTextEditor';

let root: Root | undefined = undefined;

function hideTextEditor(): void {
    if (root) root.unmount();
}

function showFreeTextEditor(props: any): void {
    let divTarget = document.getElementById('canvas-text-editor');

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<FreeTextEditor {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'canvas-text-editor';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<FreeTextEditor {...props} />);
    }
}

function showBoundedTextEditor(props: any): void {
    let divTarget = document.getElementById('canvas-text-editor');

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<BoundedTextEditor {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'canvas-text-editor';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<BoundedTextEditor {...props} />);
    }
}

export {
    hideTextEditor,
    showFreeTextEditor,
    showBoundedTextEditor
}