import { Component, ReactNode } from 'react';
import { DialogShareProps } from './base/DialogBase';

import './ShowExportDialog.scss';

import DialogBody from './base/DialogBody';
import DialogHeader from './base/DialogHeader';

interface ShowExportDialogProps extends DialogShareProps {
    json: any;
}

class ShowExportDialog extends Component<ShowExportDialogProps> {
    render(): ReactNode {
        return (
            <div className="show-export-dialog">
                <DialogHeader title="Captured Export Data" onClose={this.props.onClose} closeButton />
                <DialogBody>
                    <div className="show-export-dialog-code">
                        <pre>{JSON.stringify(this.props.json, null, 2)}</pre>
                    </div>
                </DialogBody>
            </div>
        )
    }
}

export default ShowExportDialog;