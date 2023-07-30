import Canvas from './Canvas';
import { Component, ReactNode, createRef } from 'react';

import './App.css';

import Tool from './tool/tool';
import Booth from './item/booth';
import { Point } from './util/point';
import ItemPool from './item/item-pool';
import SelectionTool from './tool/selection-tool';
import DrawingVisitor from './visitor/drawing-visitor';

interface AppState {
  currentTool: Tool;
}

class App extends Component<any, AppState> {
  private _canvasRef = createRef<Canvas>();
  private _itemPool: ItemPool = new ItemPool({ w: 1920, h: 1080 });

  constructor(prop: any) {
    super(prop);
    this.state = {
      currentTool: new SelectionTool(this._itemPool),
    }
    this._itemPool.addItem(new Booth({ id: '1', name: 'booth1', pos: { x: 100, y: 110 }, size: { w: 200, h: 300 }, rotate: 0 }));
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
    this._canvasRef.current!.shapes = drawVisitor.getResult();
  }

  private _onDragStart = (pos: Point): void => {
    this.state.currentTool.onStart(pos);
    this._updateCanvas();
  }

  private _onDragEnd = (pos: Point): void => {
    this.state.currentTool.onEnd(pos);
    this._updateCanvas();
  }

  private _onDragMove = (pos: Point): void => {
    this.state.currentTool.onMove(pos);
    this._updateCanvas();
  }

  private _onMouseMove = (pos: Point): void => {

  }

  render(): ReactNode {
    return (
      <div id="app">
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
