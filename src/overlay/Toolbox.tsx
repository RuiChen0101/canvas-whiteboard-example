import { Component, ReactNode } from 'react';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faSquare as faSolidSquare } from '@fortawesome/free-solid-svg-icons';

import './Toolbox.scss';

interface ToolboxProps {
    onToolChange: (toolName: string) => void;
    currentTool: string;
}

class Toolbox extends Component<ToolboxProps> {
    render(): ReactNode {
        return (
            <div className="toolbox-area">
                <div className="toolbox">
                    <div className={`tool${this.props.currentTool === 'select' ? ' active' : ''}`} onClick={() => this.props.onToolChange('select')}>
                        <FontAwesomeIcon icon={faArrowPointer} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'box-draw' ? ' active' : ''}`} onClick={() => this.props.onToolChange('box-draw')}>
                        <FontAwesomeIcon icon={faSquare} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'obstacle-draw' ? ' active' : ''}`} onClick={() => this.props.onToolChange('obstacle-draw')}>
                        <FontAwesomeIcon icon={faSolidSquare} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Toolbox;