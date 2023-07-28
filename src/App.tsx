import Canvas from './Canvas';
import { Component, ReactNode } from 'react';

import './App.css';

import Item from './item/item';
import Table from './item/table';
import Booth from './item/booth';
import Shape from './shape/shape';
import DrawingVisitor from './visitor/drawing-visitor';

interface AppState {
  items: Item[];
}

class App extends Component<any, AppState> {

  constructor(prop: any) {
    super(prop);
    this.state = {
      items: [
        new Table({ id: '0', pos: { x: 0, y: 0 }, size: { w: 10, h: 10 }, rotate: 0 }),
        new Table({ id: '1', pos: { x: 1270, y: 0 }, size: { w: 10, h: 10 }, rotate: 0 }),
        new Table({ id: '2', pos: { x: 0, y: 710 }, size: { w: 10, h: 10 }, rotate: 0 }),
        new Table({ id: '3', pos: { x: 1270, y: 710 }, size: { w: 10, h: 10 }, rotate: 0 }),
        new Table({ id: '4', pos: { x: 630, y: 350 }, size: { w: 10, h: 10 }, rotate: 0 }),
        new Table({ id: '5', pos: { x: 0, y: 0 }, size: { w: 1280, h: 720 }, rotate: 0 }),
        new Booth({ id: '6', name: 'booth1', pos: { x: 100, y: 110 }, size: { w: 200, h: 300 }, rotate: 0 }),
      ]
    }
  }

  render(): ReactNode {
    const drawVisitor = new DrawingVisitor();
    for (const i of this.state.items) {
      i.visit(drawVisitor);
    }
    console.log("render");
    return (
      <div id="app">
        <Canvas shapes={drawVisitor.getResult()} cameraBound={{ w: 1280, h: 720 }} />
      </div>
    )
  }
}

export default App;
