import Canvas from './Canvas';
import { Component, ReactNode, createRef } from 'react';

import './App.scss';

import Tool from './tool/tool';
import Random from './util/random';
import Toolbox from './overlay/Toolbox';
import ItemPool from './item/item-pool';
import Description from './item/description';
import { ORIGIN, Point } from './util/point';
import { Size, ZERO_SIZE } from './util/size';
import SelectionTool from './tool/selection-tool';
import DrawingVisitor from './visitor/drawing-visitor';
import ItemPoolMemento from './item/item-pool-memento';
import BoothDrawingTool from './tool/booth-drawing-tool';
import { InteractingType } from './interactor/item-interactor';
import { hideTextEditor, showBoundedTextEditor, showFreeTextEditor } from './text-editor/TextEditor';
import Booth from './item/booth';

interface AppState {
  currentTool: string;
  cursorType: string;
}

class App extends Component<any, AppState> {
  private _canvasRef = createRef<Canvas>();
  private _itemPool: ItemPool = new ItemPool({ w: 1920, h: 1080 });
  private _currentTool: Tool;
  private _historyStack: ItemPoolMemento[] = [];

  private _isTextEditing: boolean = false;
  private _textBuffer: string = '';
  private _editorPos: Point = ORIGIN;

  private _random: Random = new Random();

  constructor(prop: any) {
    super(prop);
    this.state = {
      currentTool: 'select',
      cursorType: 'default',
    }
    this._currentTool = new SelectionTool(this._itemPool);
    this._itemPool.addItem(new Description({ id: '1', text: 'booth1\ncsacsacas\naaaaaaa', pos: { x: 100, y: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '2', name: 'booth2', pos: { x: 300, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
  }

  componentDidMount(): void {
    this._updateCanvas();
    window.addEventListener('keydown', this._onKeyboardDown);
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this._onKeyboardDown);
  }

  private _updateCanvas = (): void => {
    const drawVisitor = new DrawingVisitor();
    for (const i of this._itemPool.items) {
      i.visit(drawVisitor);
    }
    const shapes = drawVisitor.getResult();
    shapes.push(...this._currentTool.draw());
    shapes.push(...(this._itemPool.selected?.draw() ?? []));
    this._canvasRef.current!.shapes = drawVisitor.getResult();
  }

  private _saveItemPool = (): void => {
    this._historyStack.push(this._itemPool.save());
    if (this._historyStack.length > 30) this._historyStack.shift();
  }

  private _restoreItemPool = (): void => {
    const history = this._historyStack.pop()
    if (history !== undefined) {
      this._itemPool.restore(history);
    }
    this._updateCanvas();
  }

  private _showTextEditor = (type: string, pos: Point, size: Size, rotate: number, text: string, bordered: boolean = true): void => {
    if (type === 'none') return;
    this._canvasRef.current!.cameraDisable = true;
    this._editorPos = pos;
    if (type === 'free') {
      showFreeTextEditor({ text: text, pos: pos, size: size, scale: this._canvasRef.current!.cameraState.scale, rotate: rotate, onTextChange: this._onTextChange });
    } else {
      showBoundedTextEditor({ text: text, pos: pos, size: size, scale: this._canvasRef.current!.cameraState.scale, rotate: rotate, onTextChange: this._onTextChange })
    }
    this._isTextEditing = true;
  }

  private _onKeyboardDown = (e: KeyboardEvent): void => {
    if (this._itemPool.selected !== undefined && this._itemPool.selected.isInteracting) {
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this._saveItemPool();
      this._itemPool.deleteSelectedItem();
      this._updateCanvas();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      this._restoreItemPool();
    }
  }

  private _onDragStart = (windowPos: Point, canvasPos: Point): void => {
    if (this._isTextEditing) {
      if (this._itemPool.selected !== undefined && this._itemPool.selected.isInteracting) {
        this._itemPool.selected!.onTextEditEnd(this._textBuffer);
      } else if (this._textBuffer !== '') {
        this._saveItemPool();
        this._itemPool.addItem(new Description({ id: this._random.nanoid8(), pos: this._canvasRef.current!.toCanvasPoint(this._editorPos), text: this._textBuffer, rotate: 0 }));
      }
      this._canvasRef.current!.cameraDisable = false;
      this._isTextEditing = false;
      hideTextEditor();
    }
    if (this._itemPool.selected !== undefined && this._itemPool.selected.checkInteract(canvasPos, false) !== InteractingType.None) {
      this._saveItemPool();
      this._itemPool.selected.onDragStart(canvasPos);
    } else {
      if (!this._currentTool.isStatic) this._saveItemPool();
      this._currentTool.onStart(canvasPos);
    }
    this._updateCanvas();
  }

  private _onDragEnd = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onDragEnd(canvasPos);
    } else {
      this._currentTool.onEnd(canvasPos);
      if (this.state.currentTool !== 'select') {
        this._onToolChange('select');
      }
    }
    this._updateCanvas();
  }

  private _onDragMove = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onDragMove(canvasPos);
    } else {
      this._currentTool.onMove(canvasPos);
    }
    this._updateCanvas();
  }

  private _onMouseMove = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected !== undefined) {
      switch (this._itemPool.selected.checkInteract(canvasPos, false)) {
        case InteractingType.Body:
          this.setState({ cursorType: "move" });
          break;
        case InteractingType.TopLeft:
          this.setState({ cursorType: "nwse-resize" });
          break;
        case InteractingType.TopRight:
          this.setState({ cursorType: "nesw-resize" });
          break;
        case InteractingType.BottomLeft:
          this.setState({ cursorType: "nesw-resize" });
          break;
        case InteractingType.BottomRight:
          this.setState({ cursorType: "nwse-resize" });
          break;
        case InteractingType.Rotate:
          this.setState({ cursorType: "e-resize" });
          break;
        default:
          this.setState({ cursorType: "default" });
          break;
      }
      return;
    }
  }

  private _onTextChange = (text: string): void => {
    this._textBuffer = text;
    if (this._itemPool.selected !== undefined && this._itemPool.selected.isInteracting) {
      this._itemPool.selected.onTextEdit(text);
    }
    this._updateCanvas();
  }

  private _onDoubleClick = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected !== undefined) {
      const interactType = this._itemPool.selected.checkInteract(canvasPos, true);
      if (interactType === InteractingType.Text) {
        const [type, pos, size, rotate, text] = this._itemPool.selected.onTextEditStart();
        this._textBuffer = text;
        this._showTextEditor(type, this._canvasRef.current!.toScreenPoint(pos), size, rotate, text, true);
        this._updateCanvas();
        return;
      } else if (interactType !== InteractingType.None) {
        return;
      }
    }
    this._itemPool.clearSelect();
    this._textBuffer = '';
    this._showTextEditor('free', windowPos, ZERO_SIZE, 0, '');
    this._updateCanvas();
  }

  private _onToolChange = (toolName: string): void => {
    this._itemPool.clearSelect();
    switch (toolName) {
      case 'select':
        this._currentTool = new SelectionTool(this._itemPool);
        this.setState({
          currentTool: toolName,
          cursorType: this._currentTool.cursor
        });
        break;
      case 'booth-draw':
        this._currentTool = new BoothDrawingTool(this._itemPool);
        this.setState({
          currentTool: toolName,
          cursorType: this._currentTool.cursor
        });
        break;
    }
    this.setState({
      currentTool: toolName
    });
    this._updateCanvas();
  }

  render(): ReactNode {
    return (
      <div
        id="app"
        style={{ cursor: this.state.cursorType }}>
        <Toolbox currentTool={this.state.currentTool} onToolChange={this._onToolChange} />
        <Canvas
          ref={this._canvasRef}
          cameraBound={{ w: 1920, h: 1080 }}
          onDragStart={this._onDragStart}
          onDragMove={this._onDragMove}
          onDragEnd={this._onDragEnd}
          onMouseMove={this._onMouseMove}
          onDoubleClick={this._onDoubleClick}
        />
      </div>
    )
  }
}

export default App;
