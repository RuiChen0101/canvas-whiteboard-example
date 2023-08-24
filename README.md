# Canvas Whiteboard Example Test

[live demo](https://ruichen0101.github.io/canvas-whiteboard-example/)

An example implementation of canvas base whiteboard, including camera control, item creation and deletion, item manipulation, collision detection and text editing.

##  Feature

### General

- Drawing to create items.
- Undo.
- Double-click to trigger text editing.
- Limiting editable area.

### Camera Control

- Zoom in, zoom out and move with the mouse and trackpad.
- Limiting camera region.
- Bouncing over-scroll correction.

### Item Control

- Selecting with click and region.
- Single item resize, move, rotate and text editing(for text editable item).
- Grouped items resize, move and rotate.
- Item collision detection and highlight.

### Others

- Ability to control the presentation of (some) items.
- Size measure and indicator.
- (Maybe) efficient collision detection with quadtree.
- (Maybe) separation of detail implementation.

## Implementation

### General

- Component orchestration: [src/App.tsx](src/App.tsx)
- Canvas: [src/Canvas.tsx](src/Canvas.tsx)
- Camera control: [src/util/camera-control.ts](src/util/camera-control.ts)

### Item and Interaction

- Item definition: [src/item](src/item)
- Item management: [src/item/item-pool.ts](src/item/item-pool.ts)
- Item Interaction: [src/interactor](src/interactor)
- Interaction Strategy: [src/interactor/strategy](src/interactor/strategy)
- Text Editing: [src/text-editor](src/text-editor)
- Collision detection: [src/quadtree](src/quadtree)

### Drawing

- Canvas drawing adapter: [src/shape](src/shape)
- Item drawing: [src/visitor/drawing-visitor.ts](src/visitor/drawing-visitor.ts)

### User Interface

- Editing Tools: [src/tool](src/tool)
- Overlay: [src/overlay](src/overlay)

## LICENSE

MIT License