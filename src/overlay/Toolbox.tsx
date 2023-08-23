import { Component, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faArrowPointer, faRuler, faSquare as faSolidSquare, faTableCells } from '@fortawesome/free-solid-svg-icons';

import './Toolbox.scss';

interface ToolboxProps {
    onToolChange: (toolName: string) => void;
    onAddImage: () => void;
    currentTool: string;
}

class Toolbox extends Component<ToolboxProps> {
    render(): ReactNode {
        return (
            <div className="toolbox-area">
                <div className="toolbox">
                    <div className="tool" onClick={this.props.onAddImage}>
                        <FontAwesomeIcon icon={faImage} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'select' ? ' active' : ''}`} onClick={() => this.props.onToolChange('select')}>
                        <FontAwesomeIcon icon={faArrowPointer} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'box-draw' ? ' active' : ''}`} onClick={() => this.props.onToolChange('box-draw')}>
                        <FontAwesomeIcon icon={faSquare} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'obstacle-draw' ? ' active' : ''}`} onClick={() => this.props.onToolChange('obstacle-draw')}>
                        <FontAwesomeIcon icon={faSolidSquare} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'massive-box-draw' ? ' active' : ''}`} onClick={() => this.props.onToolChange('massive-box-draw')}>
                        <FontAwesomeIcon icon={faTableCells} />
                    </div>
                    <div className={`tool${this.props.currentTool === 'ruler' ? ' active' : ''}`} onClick={() => this.props.onToolChange('ruler')}>
                        <FontAwesomeIcon icon={faRuler} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Toolbox;