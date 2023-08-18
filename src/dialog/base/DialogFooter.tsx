import { Component, ReactNode } from 'react';

import './DialogFooter.scss';

interface DialogFooterProps {
    children?: any;
}

class DialogFooter extends Component<DialogFooterProps> {
    render(): ReactNode {
        return (
            <div className="dialog-footer">
                {this.props.children}
            </div>
        )
    }
}

export default DialogFooter;