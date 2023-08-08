import Canvas from './Canvas';
import { Component, ReactNode, createRef } from 'react';

import './App.css';

import Tool from './tool/tool';
import Booth from './item/booth';
import { Point } from './util/point';
import Toolbox from './overlay/Toolbox';
import ItemPool from './item/item-pool';
import SelectionTool from './tool/selection-tool';
import DrawingVisitor from './visitor/drawing-visitor';
import BoothDrawingTool from './tool/booth-drawing-tool';
import { InteractingType } from './interactor/item-interactor';
import ItemPoolMemento from './item/item-pool-memento';

interface AppState {
  currentTool: string;
  cursorType: string;
}

class App extends Component<any, AppState> {
  private _canvasRef = createRef<Canvas>();
  private _itemPool: ItemPool = new ItemPool({ w: 1920, h: 1080 });
  private _currentTool: Tool;
  private _historyStack: ItemPoolMemento[] = [];

  constructor(prop: any) {
    super(prop);
    this.state = {
      currentTool: 'select',
      cursorType: 'default',
    }
    this._currentTool = new SelectionTool(this._itemPool);
    this._itemPool.addItem(new Booth({ id: '1', name: 'booth1', pos: { x: 100, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '2', name: 'booth2', pos: { x: 400, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '3', name: 'booth3', pos: { x: 700, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '4', name: 'booth4', pos: { x: 1000, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '5', name: 'booth5', pos: { x: 1300, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '6', name: 'booth6', pos: { x: 100, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '7', name: 'booth7', pos: { x: 400, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '8', name: 'booth8', pos: { x: 700, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '9', name: 'booth9', pos: { x: 1000, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '10', name: 'booth10', pos: { x: 1300, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '11', name: 'booth11', pos: { x: 100, y: 500 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '12', name: 'booth12', pos: { x: 400, y: 500 }, size: { w: 200, h: 100 }, rotate: -45 }));
    this._itemPool.addItem(new Booth({ id: '13', name: 'booth13', pos: { x: 700, y: 500 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '14', name: 'booth14', pos: { x: 1000, y: 500 }, size: { w: 200, h: 100 }, rotate: 45 }));
    this._itemPool.addItem(new Booth({ id: '15', name: 'booth15', pos: { x: 1300, y: 500 }, size: { w: 200, h: 100 }, rotate: 0 }));
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

  private _onKeyboardDown = (e: KeyboardEvent): void => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this._itemPool.deleteSelectedItem();
      this._updateCanvas();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      this._restoreItemPool();
    }
  }

  private _onDragStart = (pos: Point): void => {
    if (this._itemPool.selected !== undefined && this._itemPool.selected.checkInteract(pos) !== InteractingType.None) {
      this._saveItemPool();
      this._itemPool.selected.onStart(pos);
    } else {
      if (!this._currentTool.isStatic) this._saveItemPool();
      this._currentTool.onStart(pos);
    }
    this._updateCanvas();
  }

  private _onDragEnd = (pos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onEnd(pos);
    } else {
      this._currentTool.onEnd(pos);
      if (this.state.currentTool !== 'default') {
        this._currentTool = new SelectionTool(this._itemPool);
        this.setState({
          currentTool: 'select',
          cursorType: this._currentTool.cursor
        });
      }
    }
    this._updateCanvas();
  }

  private _onDragMove = (pos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onMove(pos);
    } else {
      this._currentTool.onMove(pos);
    }
    this._updateCanvas();
  }

  private _onMouseMove = (pos: Point): void => {
    if (this._itemPool.selected !== undefined) {
      switch (this._itemPool.selected.checkInteract(pos)) {
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
        />
      </div>
    )
  }
}

export default App;
