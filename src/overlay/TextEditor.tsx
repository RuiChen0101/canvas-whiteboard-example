import { Point } from '../util/point';
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
    get pos(): Point { return this.state.pos };

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

    public enable = (scale: number, pos: Point, rotate: number, text: string = ''): void => {
        this.setState({
            pos: pos,
            scale: scale,
            rotate: rotate,
            text: text,
            enable: true
        });
        setTimeout(() => {
            this._inputRef.current!.innerText = text;
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
            <div className={`text-editor-root${!this.state.enable ? ' disable' : ''}`} style={{ top: this.state.pos.y, left: this.state.pos.x }}>
                <div
                    ref={this._inputRef}
                    className="text-editor"
                    contentEditable='true'
                    onInput={this._onInput}
                ></div>
            </div>
        );
    }
}

export default TextEditor;