import { RefObject } from 'react';
import { Size } from '../util/size';
import { Point } from '../util/point';
import { FontStyle } from '../type/font-style';
import { EventNotifierBase } from '../util/event';
import { TextEditController, TextEditor } from './TextEditor';
import { Component, createRef, ClipboardEvent, ReactNode, FormEvent } from 'react';

import './FreeTextEditor.scss';

interface FreeTextEditorProps {
    pos: Point;
    scale: number;
    rotate: number;
    text: string;
    fontStyle: FontStyle;
    bordered: boolean;
    onTextChange: (text: string) => void;
}

interface FreeTextEditorState {
    pos: Point;
    rotate: number;
}

class FreeTextEditController extends EventNotifierBase implements TextEditController {
    private _editorRef: RefObject<FreeTextEditor>;

    constructor(ref: RefObject<FreeTextEditor>) {
        super()
        this._editorRef = ref;
    }

    set pos(p: Point) { this._editorRef.current!.pos = p; }

    set size(s: Size) { }

    set rotate(r: number) { this._editorRef.current!.rotate = r; }

    onTextChange = (text: string): void => {
        this._emit('text_change', text);
    }
}

class FreeTextEditor extends Component<FreeTextEditorProps, FreeTextEditorState> implements TextEditor {
    private _inputRef = createRef<HTMLDivElement>();

    set pos(p: Point) { this.setState({ pos: p }); }

    set size(s: Size) { }

    set rotate(r: number) { this.setState({ rotate: r }) }

    constructor(props: FreeTextEditorProps) {
        super(props);
        this.state = {
            pos: { ...props.pos },
            rotate: props.rotate
        }
    }

    componentDidMount(): void {
        document.execCommand('defaultParagraphSeparator', false, 'p');
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
            .map(l => `<p>${l.replace(/&/gi, '&amp;').replace(/</gi, '&lt;') || '<br />'}</p>`)
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
                    top: this.state.pos.y - (5 * this.props.scale),
                    left: this.state.pos.x - (4 * this.props.scale),
                    transform: `scale(${this.props.scale})`
                }}
            >

                <div
                    ref={this._inputRef}
                    className={`text-editor${!!this.props.bordered ? ' bordered' : ''}`}
                    style={{
                        fontFamily: this.props.fontStyle.family,
                        fontSize: `${this.props.fontStyle.size}px`,
                        lineHeight: this.props.fontStyle.lineHight,
                        transform: `rotate(${this.state.rotate}deg)`
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
export {
    FreeTextEditController
}