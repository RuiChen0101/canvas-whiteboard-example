import { Size } from '../util/size';
import { Point } from '../util/point';
import { Root, createRoot } from 'react-dom/client';

import FreeTextEditor, { FreeTextEditController } from './FreeTextEditor';
import BoundedTextEditor, { BoundedTextEditController } from './BoundedTextEditor';
import EventNotifier from '../util/event';
import { createRef } from 'react';

let root: Root | undefined = undefined;

interface TextEditor {
    set pos(p: Point);
    set size(s: Size);
    set rotate(r: number);
}

interface TextEditController extends EventNotifier {
    set pos(p: Point);
    set size(s: Size);
    set rotate(r: number);
}

function hideTextEditor(): void {
    if (root) root.unmount();
}

function showFreeTextEditor(props: any): TextEditController {
    delete props['onTextChange'];

    let divTarget = document.getElementById('canvas-text-editor');

    const ref = createRef<FreeTextEditor>();
    const controller = new FreeTextEditController(ref);

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<FreeTextEditor ref={ref} onTextChange={controller.onTextChange} {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'canvas-text-editor';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<FreeTextEditor ref={ref} onTextChange={controller.onTextChange} {...props} />);
    }

    return controller;
}

function showBoundedTextEditor(props: any): TextEditController {
    delete props['onTextChange'];

    let divTarget = document.getElementById('canvas-text-editor');

    const ref = createRef<BoundedTextEditor>();
    const controller = new BoundedTextEditController(ref);

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<BoundedTextEditor ref={ref} onTextChange={controller.onTextChange} {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'canvas-text-editor';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<BoundedTextEditor ref={ref} onTextChange={controller.onTextChange} {...props} />);
    }

    return controller;
}

export type {
    TextEditor,
    TextEditController
}

export {
    hideTextEditor,
    showFreeTextEditor,
    showBoundedTextEditor
}