import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';

import './StandardDialogTemplate.scss';

import DialogBody from '../base/DialogBody';
import DialogFooter from '../base/DialogFooter';
import DialogHeader from '../base/DialogHeader';
import { DialogShareProps } from '../base/DialogBase';
import Spinner from 'react-bootstrap/esm/Spinner';

interface StandardDialogTemplateProps extends DialogShareProps {
    children?: any;
    className?: string;
    isLoading?: boolean;
    title?: string;
    closeText?: string;
    successText?: string;
    onSuccess?: () => void;
}

class StandardDialogTemplate extends Component<StandardDialogTemplateProps> {
    render(): ReactNode {
        return (
            <div className={`standard-dialog-template ${this.props.className ?? ""}`}>
                <DialogHeader title={this.props.title} onClose={this.props.onClose} closeButton />
                <DialogBody>
                    {
                        this.props.isLoading ? <div className="mw-100 d-flex justify-content-center align-items-center" >
                            <Spinner animation="border" variant="primary" />
                        </div> : this.props.children
                    }
                </DialogBody>
                <DialogFooter>
                    <Button variant="secondary" onClick={this.props.onClose}>
                        {this.props.closeText ?? ""}
                    </Button>
                    <Button variant="primary" disabled={!!this.props.isLoading} onClick={this.props.onSuccess ?? this.props.onClose}>
                        {this.props.successText ?? ""}
                    </Button>
                </DialogFooter>
            </div>
        );
    }
}

export default StandardDialogTemplate;