import sha1 from 'crypto-js/sha1';
import enc from 'crypto-js/enc-hex';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import { ImageData } from '../../preloader/image-preload';
import { imageSize, imageUrlToBase64 } from '../../util/image';

import { DialogShareProps } from '../base/DialogBase';
import StandardDialogTemplate from '../template/StandardDialogTemplate';

interface ImageSelectDialogProps extends DialogShareProps {
    onSuccess: (data: ImageData) => void;
}

interface ImageSelectDialogState {
    isLoading: boolean;
    url: string;
}

class ImageSelectDialog extends Component<ImageSelectDialogProps, ImageSelectDialogState> {
    constructor(prop: ImageSelectDialogProps) {
        super(prop);
        this.state = {
            isLoading: false,
            url: '',
        }
    }

    private _onAdd = async (): Promise<void> => {
        if (this.state.url === '') toast.error('empty url');
        this.setState({
            isLoading: true
        });
        try {
            const data = await imageUrlToBase64(this.state.url);
            const size = await imageSize(data);

            this.props.onSuccess({
                url: this.state.url,
                urlHash: sha1(this.state.url).toString(enc),
                data: data,
                size: size,
            });
            this.props.onClose();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            this.setState({
                isLoading: false
            });
        }
    }

    render(): ReactNode {
        return (
            <StandardDialogTemplate
                isLoading={this.state.isLoading}
                onClose={this.props.onClose}
                onSuccess={this._onAdd}
                title="Add Image"
                closeText="Cancel"
                successText="Add"
            >
                <Form.Group className="mb-3" controlId="addAccount">
                    <Form.Label>Url</Form.Label>
                    <Form.Control
                        placeholder="Url"
                        value={this.state.url}
                        onChange={(e) => {
                            this.setState({ url: e.target.value });
                        }}
                    />
                </Form.Group>
            </StandardDialogTemplate>
        )
    }
}

export default ImageSelectDialog;