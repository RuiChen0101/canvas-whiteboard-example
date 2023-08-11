import { Point } from '../util/point';
import { Root, createRoot } from 'react-dom/client';
import { Component, FormEvent, ReactNode, createRef } from 'react';

import './TextEditor.scss';

let root: Root | undefined = undefined;

interface FreeTextEditorProps {
    pos: Point;
    scale: number;
    rotate: number;
    text: string;
    onTextChange: (text: string) => void;
}

class FreeTextEditor extends Component<FreeTextEditorProps> {
    private _inputRef = createRef<HTMLDivElement>();

    componentDidMount(): void {
        this._inputRef.current!.innerHTML = this.props.text;
        this._inputRef.current!.focus();
    }

    private _onInput = (e: FormEvent<HTMLDivElement>): void => {
        this.props.onTextChange(this._inputRef.current!.innerHTML);
    }

    render(): ReactNode {
        return (
            <div
                className='free-text-editor-root'
                style={{
                    top: this.props.pos.y - (7 * this.props.scale),
                    left: this.props.pos.x - (6 * this.props.scale),
                    transform: `rotate(${this.props.rotate}deg) scale(${this.props.scale})`
                }}
            >
                <div
                    ref={this._inputRef}
                    className="text-editor"
                    contentEditable="true"
                    spellCheck="false"
                    onInput={this._onInput}
                ></div>
            </div>
        )
    }
}

class BoundedTextEditor extends Component {
    render(): ReactNode {
        return (<></>)
    }
}

function hideTextEditor(): void {
    if (root) root.unmount();
}

function showTextEditor(props: any): void {
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

export {
    hideTextEditor,
    showTextEditor,
}