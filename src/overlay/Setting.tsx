import Form from 'react-bootstrap/esm/Form';
import { DisplayFlag } from '../AppContext';
import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Setting.scss';

interface SettingProps {
    displayFlag: DisplayFlag;
    onSettingChange: (name: string, enable: boolean) => void
}

interface SettingState {
    show: boolean
}

class Setting extends Component<SettingProps, SettingState> {
    constructor(props: SettingProps) {
        super(props);
        this.state = {
            show: false,
        }
    }
    render(): ReactNode {
        return (
            <div className="setting-area">
                <div className="setting-toggle">
                    <Button variant='link' onClick={() => this.setState({ show: !this.state.show })}>
                        <FontAwesomeIcon icon={faGear} />
                    </Button>
                </div>
                <div className={this.state.show ? 'setting show' : 'setting'}>
                    <Form>
                        <Form.Check
                            type="switch"
                            label="show text"
                            checked={this.props.displayFlag.showText}
                            onChange={(e) => this.props.onSettingChange('showText', e.target.checked)}
                        />
                        <Form.Check
                            type="switch"
                            label="show obstacle"
                            checked={this.props.displayFlag.showObstacle}
                            onChange={(e) => this.props.onSettingChange('showObstacle', e.target.checked)}
                        />
                        <Form.Check
                            type="switch"
                            label="show size"
                            checked={this.props.displayFlag.showSize}
                            onChange={(e) => this.props.onSettingChange('showSize', e.target.checked)}
                        />
                        <Form.Check
                            type="switch"
                            label="show editable area"
                            checked={this.props.displayFlag.showEditableArea}
                            onChange={(e) => this.props.onSettingChange('showEditableArea', e.target.checked)}
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export default Setting;