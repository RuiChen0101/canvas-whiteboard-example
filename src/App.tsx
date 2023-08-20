import Box from './item/box';
import Canvas from './Canvas';
import Photo from './item/photo';
import Random from './util/random';
import AppContext from './AppContext';
import Obstacle from './item/obstacle';
import ItemPool from './item/item-pool';
import Description from './item/description';
import { ORIGIN, Point } from './util/point';
import { Size, ZERO_SIZE } from './util/size';
import SelectionTool from './tool/selection-tool';
import Spinner from 'react-bootstrap/esm/Spinner';
import BoxDrawingTool from './tool/box-drawing-tool';
import { showDialog } from './dialog/base/DialogBase';
import DrawingVisitor from './visitor/drawing-visitor';
import ItemPoolMemento from './item/item-pool-memento';
import { Component, ReactNode, createRef } from 'react';
import { DEFAULT_STYLE, FontStyle } from './type/font-style';
import ObstacleDrawingTool from './tool/obstacle-drawing-tool';
import { InteractingType } from './interactor/item-interactor';
import MassiveBoxDrawingTool from './tool/massive-box-drawing-tool';
import ImagePreloader, { ImageData } from './preloader/image-preload';
import CollectImageUrlVisitor from './visitor/collect-image-url-visitor';

import './App.scss';

import Tool from './tool/tool';
import Toolbox from './overlay/Toolbox';
import ImageSelectDialog from './dialog/image/ImageSelectDialog';
import { TextEditController, hideTextEditor, showBoundedTextEditor, showFreeTextEditor } from './text-editor/TextEditor';

interface AppState {
  isLoading: boolean;
  currentTool: string;
  cursorType: string;
  ctx: AppContext;
}

class App extends Component<any, AppState> {
  private _canvasRef = createRef<Canvas>();
  private _itemPool: ItemPool;
  private _currentTool: Tool;
  private _historyStack: ItemPoolMemento[] = [];

  private _imageData: Map<string, ImageData> = new Map();

  private _textEditController?: TextEditController = undefined;
  private _isTextEditing: boolean = false;
  private _textBuffer: string = '';
  private _editorPos: Point = ORIGIN;

  private _random: Random = new Random();

  constructor(prop: any) {
    super(prop);
    this.state = {
      isLoading: true,
      currentTool: 'select',
      cursorType: 'default',
      ctx: {
        canvasSize: { w: 1920, h: 1080 },
        editableTopLeftPos: { x: 0, y: 0 },
        editableBottomRightPos: { x: 1920, y: 1080 },
        scale: 10,
        display: {
          showObstacle: true,
          showText: true
        }
      }
    }
    this._itemPool = new ItemPool(this.state.ctx.canvasSize);
    this._currentTool = new SelectionTool(this._itemPool);
    this._itemPool.addItem(new Description({ id: '1', text: 'box1\ncsacsacas\naaaaaaa', pos: { x: 100, y: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Box({ id: '2', name: 'box2', pos: { x: 300, y: 100 }, size: { w: 200, h: 100 }, rotate: 45 }));
    this._itemPool.addItem(new Photo({ id: '3', url: `${process.env.PUBLIC_URL}/logo512.png`, size: { w: 128, h: 128 }, pos: { x: 300, y: 300 }, rotate: 0 }));
    this._itemPool.addItem(new Obstacle({ id: '4', pos: { x: 100, y: 300 }, size: { w: 100, h: 100 }, rotate: 0 }));
  }

  async componentDidMount(): Promise<void> {
    const visitor = new CollectImageUrlVisitor();
    this._itemPool.visit(visitor);
    const preload = new ImagePreloader();
    await preload.load(visitor.getResult());
    this._imageData = preload.getResult();
    this.setState({ isLoading: false });
    setTimeout(() => this._updateCanvas(), 100);
    window.addEventListener('keydown', this._onKeyboardDown);
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this._onKeyboardDown);
  }

  private _updateCanvas = (): void => {
    const drawVisitor = new DrawingVisitor(this._imageData);
    this._itemPool.visit(drawVisitor);
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
    const history = this._historyStack.pop();
    if (history === undefined) return;
    this._itemPool.restore(history);
    this._updateCanvas();
  }

  private _addImage = (imageData: ImageData): void => {
    this._imageData.set(imageData.urlHash, imageData);
    const pos = { x: (window.innerWidth / 2) - (imageData.size.w / 2), y: (window.innerHeight / 2) - (imageData.size.h / 2) };
    this._itemPool.addItem(new Photo({ id: this._random.nanoid8(), pos: this._canvasRef.current!.toCanvasPoint(pos), size: imageData.size, rotate: 0, url: imageData.url }));
    this._updateCanvas();
  }

  private _showTextEditor = (type: string, pos: Point, size: Size, rotate: number, style: FontStyle, text: string, bordered: boolean = true): void => {
    if (type === 'none') return;
    this._canvasRef.current!.cameraDisable = true;
    this._editorPos = pos;
    if (type === 'free') {
      this._textEditController = showFreeTextEditor({ text: text, pos: pos, scale: this._canvasRef.current!.cameraState.scale, rotate: rotate, fontStyle: style, bordered: bordered });
    } else {
      this._textEditController = showBoundedTextEditor({ text: text, pos: pos, size: size, scale: this._canvasRef.current!.cameraState.scale, rotate: rotate, fontStyle: style, bordered: bordered })
    }
    this._textEditController.on('text_change', argv => this._onTextChange(argv));
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
      this._textEditController?.clear();
      this._textEditController = undefined;
      hideTextEditor();
    }
    if (this._itemPool.selected !== undefined && this._itemPool.selected.checkInteract(canvasPos, false) !== InteractingType.None) {
      this._itemPool.selected.onDragStart(canvasPos);
    } else {
      this._currentTool.onStart(canvasPos);
    }
    this._updateCanvas();
  }

  private _onDragEnd = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onDragEnd(canvasPos);
    } else {
      if (!this._currentTool.isStatic) this._saveItemPool();
      this._currentTool.onEnd(canvasPos);
      if (this.state.currentTool !== 'select') {
        this._onToolChange('select');
      }
    }
    this._updateCanvas();
  }

  private _onDragMove = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      if (this._itemPool.selected!.stillStatic) { this._saveItemPool(); }
      this._itemPool.selected!.onDragMove(this.state.ctx, canvasPos);
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
      if (this._itemPool.selected!.stillStatic) { this._saveItemPool(); }
      const [pos, size, rotate] = this._itemPool.selected.onTextEdit(this.state.ctx, text);
      this._textEditController!.pos = this._canvasRef.current!.toScreenPoint(pos);
      this._textEditController!.size = size;
      this._textEditController!.rotate = rotate;
    }
    this._updateCanvas();
  }

  private _onDoubleClick = (windowPos: Point, canvasPos: Point): void => {
    if (this._itemPool.selected !== undefined) {
      const interactType = this._itemPool.selected.checkInteract(canvasPos, true);
      if (interactType === InteractingType.Text) {
        const [type, pos, size, rotate, style, text] = this._itemPool.selected.onTextEditStart();
        this._textBuffer = text;
        this._showTextEditor(type, this._canvasRef.current!.toScreenPoint(pos), size, rotate, style, text, false);
        this._updateCanvas();
        return;
      } else if (interactType !== InteractingType.None) {
        return;
      }
    }
    this._itemPool.clearSelect();
    this._textBuffer = '';
    this._showTextEditor('free', windowPos, ZERO_SIZE, 0, DEFAULT_STYLE, '');
    this._updateCanvas();
  }

  private _onToolChange = (toolName: string): void => {
    switch (toolName) {
      case 'select':
        this._currentTool = new SelectionTool(this._itemPool);
        this.setState({
          currentTool: toolName,
          cursorType: this._currentTool.cursor
        });
        break;
      case 'box-draw':
        this._itemPool.clearSelect();
        this._currentTool = new BoxDrawingTool(this._itemPool);
        this.setState({
          currentTool: toolName,
          cursorType: this._currentTool.cursor
        });
        break;
      case 'obstacle-draw':
        this._itemPool.clearSelect();
        this._currentTool = new ObstacleDrawingTool(this._itemPool);
        this.setState({
          currentTool: toolName,
          cursorType: this._currentTool.cursor
        });
        break;
      case 'massive-box-draw':
        this._itemPool.clearSelect();
        this._currentTool = new MassiveBoxDrawingTool(this._itemPool);
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

  private _showImageSelectDialog = (): void => {
    showDialog((close: () => void): ReactNode => {
      return (<ImageSelectDialog onClose={close} onSuccess={this._addImage} />)
    });
  }

  render(): ReactNode {
    if (this.state.isLoading) return (<div id="app" className="d-flex justify-content-center align-items-center"><Spinner animation="border" /></div>)
    return (
      <div
        id="app"
        style={{ cursor: this.state.cursorType }}>
        <Toolbox
          onAddImage={this._showImageSelectDialog}
          currentTool={this.state.currentTool}
          onToolChange={this._onToolChange}
        />
        <Canvas
          ref={this._canvasRef}
          cameraBound={this.state.ctx.canvasSize}
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
