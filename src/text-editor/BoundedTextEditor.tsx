import { Size } from '../util/size';
import { Point } from '../util/point';
import { EventNotifierBase } from '../util/event';
import { TextEditController, TextEditor } from './TextEditor';
import { Component, FormEvent, ClipboardEvent, ReactNode, createRef, RefObject } from 'react';

import './BoundedTextEditor.scss';

interface BoundedTextEditorProps {
    pos: Point;
    scale: number;
    rotate: number;
    text: string;
    size: Size;
    bordered: boolean;
    onTextChange: (text: string) => void;
}

interface BoundedTextEditorState {
    pos: Point;
    size: Size;
    rotate: number;
}

class BoundedTextEditController extends EventNotifierBase implements TextEditController {
    private _editorRef: RefObject<BoundedTextEditor>;

    constructor(ref: RefObject<BoundedTextEditor>) {
        super()
        this._editorRef = ref;
    }

    set pos(p: Point) { this._editorRef.current!.pos = p; }

    set size(s: Size) { this._editorRef.current!.size = s; }

    set rotate(r: number) { this._editorRef.current!.rotate = r; }

    onTextChange = (text: string): void => {
        this._emit('text_change', text);
    }
}

class BoundedTextEditor extends Component<BoundedTextEditorProps, BoundedTextEditorState> implements TextEditor {
    private _inputRef = createRef<HTMLDivElement>();

    set pos(p: Point) { this.setState({ pos: p }); }

    set size(s: Size) { this.setState({ size: s }); }

    set rotate(r: number) { this.setState({ rotate: r }); }

    constructor(props: BoundedTextEditorProps) {
        super(props);
        this.state = {
            pos: { ...props.pos },
            size: { ...props.size },
            rotate: props.rotate
        }
    }

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
                    top: this.state.pos.y,
                    left: this.state.pos.x,
                    transform: `scale(${this.props.scale})`
                }}
            >
                <div
                    ref={this._inputRef}
                    className={`text-editor${!!this.props.bordered ? ' bordered' : ''}`}
                    style={{
                        width: this.state.size.w,
                        height: this.state.size.h,
                        transform: `rotate(${this.state.rotate}deg)`
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
export {
    BoundedTextEditController
};