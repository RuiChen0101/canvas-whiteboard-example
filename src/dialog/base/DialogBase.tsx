import { Component, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';

import './DialogBase.scss';

type DialogRenderFunc = (close: DialogCloseCallback) => ReactNode;
type DialogCloseCallback = (...argv: any[]) => void;

interface DialogProps {
    render: DialogRenderFunc;
    afterClose?: DialogCloseCallback;
    noBackdrop?: boolean;
    size?: string;
}

interface DialogShowProp {
    afterClose?: DialogCloseCallback;
    noBackdrop?: boolean;
    size?: string;
}

interface DialogShareProps {
    onClose: DialogCloseCallback;
}

interface DialogBaseState {
    isShow: boolean;
}

class DialogBase extends Component<DialogProps, DialogBaseState> {

    constructor(prop: DialogProps) {
        super(prop);
        this.state = {
            isShow: false
        }
    }

    componentDidMount(): void {
        document.addEventListener('keydown', this._onKeyStroke);

        setTimeout(() => {
            this.setState({ isShow: true });
        }, 10)
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this._onKeyStroke);
    }

    private _onBackdropClick = (e: any): void => {
        if (!!this.props.noBackdrop || !e.target.classList.contains('dialog-base')) return;
        this._onClose();
    }

    private _onKeyStroke = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this._onClose();
        }
    }

    private _onClose = (...argv: string[]): void => {
        this.setState({ isShow: false });
        setTimeout(() => {
            removeDialog();
            removeBodyClass();
            if (this.props.afterClose !== undefined) this.props.afterClose(...argv);
        }, 150);
    }

    render(): ReactNode {
        return (
            <>
                <div className={`dialog-backdrop${this.state.isShow ? " show" : ""}`} />
                <div
                    className={`dialog-base${this.state.isShow ? " show" : ""}`}
                    onMouseDown={this._onBackdropClick}
                >
                    <div className={`dialog-content dialog-content-size-${this.props.size ?? 'sm'}`}>
                        <div className="dialog">
                            {this.props.render(this._onClose)}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

let root: Root | undefined = undefined;

function renderDialog(render: DialogRenderFunc, props?: DialogShowProp) {
    let divTarget = document.getElementById('react-dialog');

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<DialogBase render={render} {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'react-dialog';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<DialogBase render={render} {...props} />);
    }
}

function removeDialog() {
    if (root) root.unmount();
}

function addBodyClass() {
    document.body.classList.add('react-dialog-open');
}

function removeBodyClass() {
    document.body.classList.remove('react-dialog-open');
}

function showDialog(render: DialogRenderFunc, props?: DialogShowProp) {
    addBodyClass();
    renderDialog(render, props);
}

export default DialogBase;
export type {
    DialogShareProps,
    DialogRenderFunc,
    DialogCloseCallback
}
export { showDialog }