import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DialogHeader.scss';

interface DialogHeaderProp {
    title?: string;
    onClose?: () => void;
    closeButton: boolean;
}

class DialogHeader extends Component<DialogHeaderProp>{
    render(): ReactNode {
        return (
            <div className="dialog-header">
                <h4 className="dialog-header-title">{this.props.title ?? ''}</h4>
                {this.props.closeButton && (
                    <Button variant="link" className="dialog-header-close p-1" onClick={this.props.onClose}>
                        <FontAwesomeIcon width={24} icon={faXmark} />
                    </Button>
                )}
            </div>
        )
    }
}

export default DialogHeader;