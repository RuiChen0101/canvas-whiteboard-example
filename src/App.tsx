import Canvas from './Canvas';
import { Component, ReactNode, createRef } from 'react';

import './App.css';

import Tool from './tool/tool';
import Booth from './item/booth';
import { Point } from './util/point';
import ItemPool from './item/item-pool';
import SelectionTool from './tool/selection-tool';
import DrawingVisitor from './visitor/drawing-visitor';
import { InteractingType } from './interactor/item-interactor';

interface AppState {
  currentTool: Tool;
  cursorType: string;
}

class App extends Component<any, AppState> {
  private _canvasRef = createRef<Canvas>();
  private _itemPool: ItemPool = new ItemPool({ w: 1920, h: 1080 });

  constructor(prop: any) {
    super(prop);
    this.state = {
      currentTool: new SelectionTool(this._itemPool),
      cursorType: 'default',
    }
    this._itemPool.addItem(new Booth({ id: '1', name: 'booth1', pos: { x: 100, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '2', name: 'booth2', pos: { x: 400, y: 100 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '3', name: 'booth3', pos: { x: 100, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
    this._itemPool.addItem(new Booth({ id: '4', name: 'booth4', pos: { x: 400, y: 300 }, size: { w: 200, h: 100 }, rotate: 0 }));
  }

  componentDidMount(): void {
    this._updateCanvas();
  }

  private _updateCanvas = (): void => {
    const drawVisitor = new DrawingVisitor();
    for (const i of this._itemPool.items) {
      i.visit(drawVisitor);
    }
    const shapes = drawVisitor.getResult();
    shapes.push(...this.state.currentTool.draw());
    shapes.push(...(this._itemPool.selected?.draw() ?? []));
    this._canvasRef.current!.shapes = drawVisitor.getResult();
  }

  private _onDragStart = (pos: Point): void => {
    if (this._itemPool.selected !== undefined && this._itemPool.selected.checkInteract(pos) !== InteractingType.None) {
      this._itemPool.selected.onStart(pos);
    } else {
      this.setState({ cursorType: "default" });
      this.state.currentTool.onStart(pos);
    }
    this._updateCanvas();
  }

  private _onDragEnd = (pos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onEnd(pos);
    } else {
      this.state.currentTool.onEnd(pos);
    }
    this._updateCanvas();
  }

  private _onDragMove = (pos: Point): void => {
    if (this._itemPool.selected?.isInteracting ?? false) {
      this._itemPool.selected!.onMove(pos);
    } else {
      this.state.currentTool.onMove(pos);
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
          this.setState({ cursorType: "nw-resize" });
          break;
        case InteractingType.TopRight:
          this.setState({ cursorType: "ne-resize" });
          break;
        case InteractingType.BottomLeft:
          this.setState({ cursorType: "sw-resize" });
          break;
        case InteractingType.BottomRight:
          this.setState({ cursorType: "se-resize" });
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

  render(): ReactNode {
    return (
      <div
        id="app"
        style={{ cursor: this.state.cursorType }}>
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
