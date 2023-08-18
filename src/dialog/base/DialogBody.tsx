import { Component, ReactNode } from 'react';

import './DialogBody.scss';

interface DialogBodyProp {
    children?: any;
    className?: string;
}

class DialogBody extends Component<DialogBodyProp>{
    render(): ReactNode {
        return (
            <div className={`dialog-body ${this.props.className ?? ''}`}>
                {this.props.children}
            </div>
        )
    }
}

export default DialogBody;