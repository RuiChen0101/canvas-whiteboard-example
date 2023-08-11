import { Point } from '../util/point';
import { TextEditableItem } from '../item/item';
import { Component, FormEvent, ReactNode, createRef } from 'react';

import './TextEditor.scss';

interface TextEditorState {
    pos: Point;
    scale: number;
    rotate: number;
    text: string;
    enable: boolean
}

class TextEditor extends Component<any, TextEditorState>{
    private _inputRef = createRef<HTMLDivElement>();

    get isEnable(): boolean { return this.state.enable; };
    get text(): string { return this.state.text; };
    get pos(): Point { return this.state.pos; };

    constructor(prop: any) {
        super(prop);
        this.state = {
            pos: { x: 0, y: 0 },
            scale: 1,
            rotate: 0,
            text: '',
            enable: false
        }
    }

    public enableFreeEdit = (scale: number, pos: Point, text: string = ''): void => {
        this.setState({
            pos: pos,
            scale: scale,
            rotate: 0,
            text: text,
            enable: true
        });
        setTimeout(() => {
            this._inputRef.current!.innerText = text;
            this._inputRef.current!.focus();
        }, 100);
    }

    public enableItemEdit = (scale: number, item: TextEditableItem): void => {
        this.setState({
            pos: item.pos,
            scale: scale,
            rotate: item.rotate,
            text: item.text,
            enable: true
        });
        setTimeout(() => {
            this._inputRef.current!.innerText = item.text;
            this._inputRef.current!.focus();
        }, 100);
    }

    public disable = (): void => {
        this._inputRef.current!.innerText = '';
        this.setState({
            text: '',
            enable: false
        });
    }

    private _onInput = (e: FormEvent<HTMLDivElement>): void => {
        this.setState({
            text: this._inputRef.current!.innerText
        })
    }

    render(): ReactNode {
        return (
            <div
                className={`text-editor-root${!this.state.enable ? ' disable' : ''}`}
                style={{
                    top: this.state.pos.y - (7 * this.state.scale),
                    left: this.state.pos.x - (6 * this.state.scale),
                    transform: `rotate(${this.state.rotate}deg) scale(${this.state.scale})`
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
        );
    }
}

export default TextEditor;