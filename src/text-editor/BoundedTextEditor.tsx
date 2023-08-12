import { Component, FormEvent, ClipboardEvent, ReactNode, createRef } from 'react';

import './BoundedTextEditor.scss';
import { Size } from '../util/size';
import { Point } from '../util/point';

interface BoundedTextEditorProps {
    pos: Point;
    scale: number;
    rotate: number;
    text: string;
    size: Size;
    bordered?: boolean;
    onTextChange: (text: string) => void;
}


class BoundedTextEditor extends Component<BoundedTextEditorProps> {
    private _inputRef = createRef<HTMLDivElement>();

    componentDidMount(): void {
        this._inputRef.current!.innerHTML = this._convertTextToHtml(this.props.text);
        this._inputRef.current!.focus();
    }

    private _convertTextToHtml = (text: string): string => {
        return text
            .split('\n')
            .map(l => `<div>${l.replace(/&/gi, '&amp;').replace(/</gi, '&lt;') || '<br />'}</div>`)
            .join('');
    }

    private _notifyUpdate = (): string => {
        let text = '';
        this._inputRef.current!.childNodes.forEach((node: any, i) => {
            text += (node.innerText || node.nodeValue || '').replace(/\n/g, '');
            if (i !== this._inputRef.current!.childNodes.length - 1) {
                text += '\n';
            }
        });
        this.props.onTextChange(text);
        return text;
    }

    private _onInput = (e: FormEvent<HTMLDivElement>): void => {
        const text = this._notifyUpdate();

        if (text === '') {
            this._inputRef.current!.innerHTML = '';
        }
    }

    private _onPast = (e: ClipboardEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const clipText = e.clipboardData.getData('text').split(/\n/g).map(element => element.trimStart().trimEnd()).join('\n');

        // should replace it in the future, but it seems not replaceable in 2023
        document.execCommand('insertText', false, clipText);

        this._notifyUpdate();
    }

    render(): ReactNode {
        return (
            <div
                className='bounded-text-editor-root'
                style={{
                    top: this.props.pos.y,
                    left: this.props.pos.x,
                    transform: `scale(${this.props.scale})`
                }}
            >
                <div
                    ref={this._inputRef}
                    className={`text-editor${this.props.bordered ? ' bordered' : ''}`}
                    style={{
                        width: this.props.size.w,
                        height: this.props.size.h,
                        transform: `rotate(${this.props.rotate}deg)`
                    }}
                    contentEditable="true"
                    spellCheck="false"
                    suppressContentEditableWarning={true}
                    onInput={this._onInput}
                    onPaste={this._onPast}
                >
                </div>
            </div >
        )
    }
}

export default BoundedTextEditor;