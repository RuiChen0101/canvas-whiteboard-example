import { Size } from '../util/size';
import { Point } from '../util/point';
import { Component, createRef, ClipboardEvent, ReactNode, FormEvent } from 'react';

import './FreeTextEditor.scss';

interface FreeTextEditorProps {
    pos: Point;
    size: Size;
    scale: number;
    rotate: number;
    text: string;
    bordered: boolean;
    onTextChange: (text: string) => void;
}

class FreeTextEditor extends Component<FreeTextEditorProps> {
    private _inputRef = createRef<HTMLDivElement>();

    componentDidMount(): void {
        this._inputRef.current!.innerHTML = this._convertTextToHtml(this.props.text);
        this._inputRef.current!.focus();
        this._inputRef.current!.addEventListener('wheel', this._onWheel);
    }

    componentWillUnmount(): void {
        this._inputRef.current!.removeEventListener('wheel', this._onWheel);
    }

    private _onWheel = (e: WheelEvent): void => {
        e.preventDefault();
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
                className='free-text-editor-root'
                style={{
                    top: this.props.pos.y - (8 * this.props.scale),
                    left: this.props.pos.x - (6 * this.props.scale),
                    transform: `scale(${this.props.scale})`
                }}
            >

                <div
                    ref={this._inputRef}
                    className={`text-editor${!!!this.props.bordered ? ' bordered' : ''}`}
                    style={{
                        transform: `rotate(${this.props.rotate}deg)`
                    }}
                    contentEditable="true"
                    spellCheck="false"
                    suppressContentEditableWarning={true}
                    onInput={this._onInput}
                    onPaste={this._onPast}
                >
                </div>
            </div>
        )
    }
}

export default FreeTextEditor;